import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getMicrosoftGraphToken } from "@/lib/microsoft-graph";

function toGraphSharesContentUrl(shareUrl: string): string {
  const encoded = Buffer.from(shareUrl)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
  return `https://graph.microsoft.com/v1.0/shares/u!${encoded}/driveItem/content`;
}

function buildGraphSiteAlternates(url: string, hostnameFromEnv?: string): string[] {
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.toLowerCase().includes("graph.microsoft.com")) {
      return [];
    }

    const marker = "/v1.0/sites/";
    const markerIndex = parsed.pathname.indexOf(marker);
    if (markerIndex === -1) {
      return [];
    }

    const rest = parsed.pathname.slice(markerIndex + marker.length);
    const parts = rest.split("/drive/items/");
    if (parts.length !== 2) {
      return [];
    }

    const sitePart = parts[0];
    const itemPart = parts[1];
    const envHost = (hostnameFromEnv || "").trim();
    const altSiteParts = new Set<string>();

    if (sitePart.includes(",")) {
      const segments = sitePart.split(",");
      if (segments.length >= 3 && segments[0].includes(".")) {
        altSiteParts.add(`${segments[1]},${segments[2]}`);
      }
      if (segments.length === 2 && envHost) {
        altSiteParts.add(`${envHost},${segments[0]},${segments[1]}`);
      }
    }

    const base = `${parsed.origin}/v1.0/sites/`;
    return Array.from(altSiteParts).map((s) => `${base}${s}/drive/items/${itemPart}`);
  } catch {
    return [];
  }
}

function extractGraphItemId(url: string): string {
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.toLowerCase().includes("graph.microsoft.com")) {
      return "";
    }
    const match = parsed.pathname.match(/\/drive\/items\/([^/]+)\/content/i);
    return match?.[1]?.trim() || "";
  } catch {
    return "";
  }
}

async function fetchDocument(url: string): Promise<Response> {
  if (url.startsWith("/")) {
    throw new Error("LOCAL_REDIRECT");
  }

  const parsedUrl = new URL(url);
  const host = parsedUrl.hostname.toLowerCase();
  const isMicrosoftHosted =
    host.includes("graph.microsoft.com") ||
    host.includes("sharepoint.com") ||
    host.includes("sharepoint-df.com") ||
    host.includes("microsoft.com");

  const headers: Record<string, string> = {
    "Accept": "*/*",
  };

  if (isMicrosoftHosted) {
    const token = await getMicrosoftGraphToken();
    if (!token || token.length < 10) {
      throw new Error("Could not acquire a valid Microsoft Graph access token.");
    }
    headers.Authorization = `Bearer ${token}`;
  }

  return fetch(url, { method: "GET", headers });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. MUST await params in Next.js 15+
    const resolvedParams = await params;
    const docId = parseInt(resolvedParams.id);

    if (isNaN(docId)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    // 2. Fixed: Raw query for vDocumentsAdmin view (no @id)
    // Try sector first
    let docsRaw = await prisma.$queryRaw`
      SELECT download_url, title
      FROM sector.v_documents_admin 
      WHERE id = ${docId}
    `;
    let doc = (docsRaw as any[])[0] || null;

    if (!doc) {
      // Fallback to trade schema
      docsRaw = await prisma.$queryRaw`
        SELECT sharepoint_download_url as download_url, filename as title
        FROM trade.resource_documents 
        WHERE id = ${docId}
      `;
      doc = (docsRaw as any[])[0] || null;
    }

    // Fallback for research/general docs (from fetchResearchDocuments)
    if (!doc) {
      docsRaw = await prisma.$queryRaw`
        SELECT sharepoint_download_url as download_url, filename as title
        FROM sector.resource_documents 
        WHERE id = ${docId}
        AND (LOWER(document_type) = 'general document' OR LOWER(sector) = 'general')
      `;
      doc = (docsRaw as any[])[0] || null;
    }

    if (!doc || !doc.download_url) {
      return NextResponse.json({ error: "Document or URL not found" }, { status: 404 });
    }

    // Fixed: Raw query for sector.resource_documents (not in Prisma client)
    const resourceDocsRaw = await prisma.$queryRaw`
      SELECT sharepoint_download_url, sharepoint_file_id, file_data, 
             mime_type, original_filename, filename
      FROM sector.resource_documents 
      WHERE id = ${docId}
    `;

    const resourceDoc = (resourceDocsRaw as any[])[0] || null;

const primaryUrl = doc.download_url.trim();
  const fallbackUrl = resourceDoc?.sharepoint_download_url?.trim() || "";
  const fallbackItemId = resourceDoc?.sharepoint_file_id?.trim() || "";
  const primaryItemId = extractGraphItemId(primaryUrl);
  const effectiveItemId = fallbackItemId || primaryItemId;
  const configuredSiteId = process.env.SHAREPOINT_SITE_ID?.trim() || "";
  const configuredHost = process.env.SHAREPOINT_HOSTNAME?.trim() || "";

  let candidateUrls: string[] = [];
  if (resourceDoc?.filename) {
    // Fix: sanitize and match exact public filename (no %20 → space)
    const publicFilename = resourceDoc.filename.replace(/%20/g, ' ').trim();
    candidateUrls.push(`/documents/sector-reports/${publicFilename}`);
  }
  candidateUrls.push(primaryUrl);
  if (fallbackUrl) {
    candidateUrls.push(toGraphSharesContentUrl(fallbackUrl));
  }
  if (fallbackUrl && fallbackUrl !== primaryUrl) {
      candidateUrls.push(fallbackUrl);
      const fallbackHost = (() => {
        try {
          return new URL(fallbackUrl).hostname.toLowerCase();
        } catch {
          return "";
        }
      })();
      if (fallbackHost && !fallbackHost.includes("graph.microsoft.com")) {
        candidateUrls.push(toGraphSharesContentUrl(fallbackUrl));
      }
    }
    candidateUrls.push(...buildGraphSiteAlternates(primaryUrl, configuredHost));
    if (fallbackUrl) {
      candidateUrls.push(...buildGraphSiteAlternates(fallbackUrl, configuredHost));
    }
    if (configuredSiteId && effectiveItemId) {
      candidateUrls.push(
        `https://graph.microsoft.com/v1.0/sites/${configuredSiteId}/drive/items/${effectiveItemId}/content`
      );
    }

    const uniqueCandidateUrls = Array.from(new Set(candidateUrls.filter(Boolean)));

    let upstreamResponse: Response | null = null;
    const attempted: Array<{ url: string; status?: number; error?: unknown }> = [];

    for (const targetUrl of uniqueCandidateUrls) {
      try {
        if (targetUrl.startsWith("/")) {
          return NextResponse.redirect(new URL(targetUrl, request.url));
        }

        const response = await fetchDocument(targetUrl);
        if (response.ok) {
          upstreamResponse = response;
          break;
        }

        let body: unknown = {};
        try {
          body = await response.clone().json();
        } catch {
          body = await response.text().catch(() => "");
        }

        attempted.push({ url: targetUrl, status: response.status, error: body });
      } catch (error) {
        attempted.push({ url: targetUrl, error });
      }
    }

    if (!upstreamResponse) {
      if (resourceDoc?.file_data) {
        const binaryFilename =
          resourceDoc.original_filename ||
          resourceDoc.filename ||
          (doc.title ? `${doc.title.replace(/[^a-z0-9]/gi, "_")}.pdf` : "document.pdf");
        const binaryContentType = resourceDoc.mime_type || "application/pdf";

        return new NextResponse(Buffer.from(resourceDoc.file_data), {
          headers: {
            "Content-Type": binaryContentType,
            "Content-Disposition": `inline; filename="${binaryFilename}"`,
            "Cache-Control": "no-store",
          },
        });
      }

      console.error("SharePoint Access Error:", attempted);
      return NextResponse.json(
        {
          error: "Unable to fetch document from upstream source",
          docId,
          hint: configuredSiteId
            ? "Configured SHAREPOINT_SITE_ID fallback was attempted."
            : "Set SHAREPOINT_SITE_ID in .env to enable file-id-based Graph fallback.",
          details: attempted,
        },
        { status: 404 }
      );
    }

    // 5. Stream the PDF back to the browser
    const contentType = upstreamResponse.headers.get("content-type") || "application/pdf";
const url = new URL(request.url);
  const mode = url.searchParams.get('mode');
  const filename = resourceDoc?.filename || doc.title ? `${doc.title.replace(/[^a-z0-9]/gi, '_')}.pdf` : 'document.pdf';

  const disposition = mode === 'download' ? `attachment; filename="${filename}"` : `inline; filename="${filename}"`;

  return new NextResponse(upstreamResponse.body, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": disposition,
      "Cache-Control": "no-store",
    },
  });

  } catch (error: any) {
    console.error("Critical Proxy Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}