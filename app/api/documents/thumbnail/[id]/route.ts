import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getMicrosoftGraphToken } from "@/lib/microsoft-graph";

/**
 * GET /api/documents/thumbnail/:id
 *
 * Lightweight PDF proxy specifically for thumbnail rendering.
 * Differences from the full download route:
 *   - 5-second timeout (not 15s) — fails fast instead of blocking
 *   - Forwards the browser's Range header so pdfjs-dist can make
 *     efficient partial fetches instead of downloading the whole PDF
 *   - Returns 204 on any failure so the UI shows the fallback icon
 *     instead of a 500/network error
 *   - Only looks up trade + sector schemas (no complex fallback chain)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
const docId = parseInt(id, 10);
  console.log('[TRADE THUMB DEBUG] Requested docId:', docId);

  if (isNaN(docId)) {
    return new NextResponse(null, { status: 204 });
  }

  try {
    // 1. Try trade schema first (most common miss in download route)
    let row: { download_url: string; filename: string | null } | null = null;

    const tradeRows = await prisma.$queryRaw<{ download_url: string; filename: string | null }[]>`
      SELECT sharepoint_download_url AS download_url, filename
      FROM trade.resource_documents
      WHERE id = ${docId}
    `;
    if (tradeRows[0]?.download_url) {
      row = tradeRows[0];
    }

    // 2. Fall back to sector schema
    if (!row) {
      const sectorRows = await prisma.$queryRaw<{ download_url: string; filename: string | null }[]>`
        SELECT sharepoint_download_url AS download_url, filename
        FROM sector.resource_documents
        WHERE id = ${docId}
      `;
      if (sectorRows[0]?.download_url) {
        row = sectorRows[0];
      }
    }

    // 3. Local static file (fastest — short-circuit with redirect)
    if (row?.filename) {
      const localPath = `/documents/sector-reports/${encodeURIComponent(row.filename)}`;
      const localRes = await fetch(new URL(localPath, request.url), {
        signal: AbortSignal.timeout(2000),
      }).catch(() => null);
      if (localRes?.ok) {
        return new NextResponse(localRes.body, {
          headers: {
            "Content-Type": localRes.headers.get("content-type") || "application/pdf",
            "Accept-Ranges": "bytes",
            "Cache-Control": "public, max-age=3600",
          },
        });
      }
    }

    if (!row?.download_url) {
      return new NextResponse(null, { status: 204 });
    }

    // 4. Fetch from Graph/SharePoint with Graph token + forwarded Range header
    const token = await getMicrosoftGraphToken();
    const fetchHeaders: Record<string, string> = {
      Authorization: `Bearer ${token}`,
      Accept: "*/*",
    };

    // Forward the Range header from the browser so pdfjs-dist can do
    // efficient partial fetches (only downloads what it needs for page 1)
    const rangeHeader = request.headers.get("range");
    if (rangeHeader) {
      fetchHeaders["Range"] = rangeHeader;
    }

    const upstream = await fetch(row.download_url, {
      headers: fetchHeaders,
      signal: AbortSignal.timeout(5000), // fail fast — 5s not 15s
      cache: "no-store",
    });

    if (!upstream.ok && upstream.status !== 206) {
      return new NextResponse(null, { status: 204 });
    }

    const responseHeaders: Record<string, string> = {
      "Content-Type": upstream.headers.get("content-type") || "application/pdf",
      "Accept-Ranges": "bytes",
      "Cache-Control": "private, max-age=300",
    };

    const contentRange = upstream.headers.get("content-range");
    if (contentRange) responseHeaders["Content-Range"] = contentRange;
    const contentLength = upstream.headers.get("content-length");
    if (contentLength) responseHeaders["Content-Length"] = contentLength;

    return new NextResponse(upstream.body, {
      status: upstream.status, // preserves 206 Partial Content
      headers: responseHeaders,
    });
  } catch {
    // Never return 500 for a thumbnail — just show the fallback icon
    return new NextResponse(null, { status: 204 });
  }
}
