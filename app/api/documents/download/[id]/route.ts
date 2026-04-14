import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getMicrosoftGraphToken } from "@/lib/microsoft-graph";

/**
 * Encodes a SharePoint/OneDrive URL into a Graph API Share ID
 */
function toGraphSharesContentUrl(shareUrl: string): string {
  const encoded = Buffer.from(shareUrl)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
  return `https://graph.microsoft.com/v1.0/shares/u!${encoded}/driveItem/content`;
}

async function fetchDocument(url: string): Promise<Response> {
  const parsedUrl = new URL(url);
  const host = parsedUrl.hostname.toLowerCase();
  const isMicrosoftHosted = host.includes("graph.microsoft.com") || host.includes("sharepoint.com");

  const headers: Record<string, string> = { "Accept": "*/*" };

  if (isMicrosoftHosted) {
    const token = await getMicrosoftGraphToken();
    if (!token) throw new Error("Microsoft Auth Failed");
    headers.Authorization = `Bearer ${token}`;
  }

  return fetch(url, {
    method: "GET",
    headers,
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Strip prefixes and parse ID
    const docId = parseInt(id.replace(/^(sp-|admin-)/, ""));

    if (isNaN(docId)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    let doc: any = null;

    // --- PRIORITY 1: CHECK TRADE SCHEMA ---
    const tradeRows: any[] = await prisma.$queryRaw`
      SELECT 
        sharepoint_download_url as download_url, 
        title,
        mime_type
      FROM trade.resource_documents 
      WHERE id = ${docId} AND is_active = true
    `;
    doc = tradeRows[0];

    // --- PRIORITY 2: CHECK ADMIN UPLOADS ---
    if (!doc) {
      const kamRows: any[] = await prisma.$queryRaw`
        SELECT 
          pdf_url as download_url, 
          title
        FROM public.kam_content 
        WHERE id = ${docId} AND is_active = true
      `;
      doc = kamRows[0];
    }

    if (!doc || !doc.download_url) {
      return NextResponse.json({ error: "Document source not found" }, { status: 404 });
    }

    const downloadUrl = doc.download_url.trim();

    // 1. Handle Local Files
    if (downloadUrl.startsWith("/") || !downloadUrl.startsWith("http")) {
      const baseUrl = new URL(request.url).origin;
      return NextResponse.redirect(new URL(downloadUrl, baseUrl));
    }

    // 2. Remote URL (SharePoint/Graph)
    try {
      const sharePointProxyUrl = toGraphSharesContentUrl(downloadUrl);
      const response = await fetchDocument(sharePointProxyUrl);

      if (response.ok) {
        return handleStream(response, doc, request);
      }

      const directResponse = await fetchDocument(downloadUrl);
      if (!directResponse.ok) throw new Error("External source unreachable");
      return handleStream(directResponse, doc, request);

    } catch (fetchErr) {
      console.error("Remote fetch error:", fetchErr);
      return NextResponse.json({ error: "Could not retrieve remote file" }, { status: 502 });
    }

  } catch (error: any) {
    console.error("Route Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function handleStream(response: Response, doc: any, request: NextRequest) {
  const mode = request.nextUrl.searchParams.get("mode");
  
  // Clean the title and force .pdf extension
  let filename = (doc.title || "document").trim();
  if (!filename.toLowerCase().endsWith(".pdf")) {
    filename += ".pdf";
  }

  // URL-encode the filename for the header to prevent errors with spaces/quotes
  const safeFilename = encodeURIComponent(filename);
  
  const contentType = response.headers.get("content-type") || "application/pdf";
  
  // Use both filename (legacy) and filename* (modern UTF-8) for maximum compatibility
  const dispositionType = mode === "download" ? "attachment" : "inline";
  const disposition = `${dispositionType}; filename="${safeFilename}"; filename*=UTF-8''${safeFilename}`;

  return new NextResponse(response.body, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": disposition,
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

