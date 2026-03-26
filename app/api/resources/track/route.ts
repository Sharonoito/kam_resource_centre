import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, action } = body;
    const parsedId = parseInt(String(id), 10);

    if (!id || !action || Number.isNaN(parsedId)) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!["VIEW", "DOWNLOAD"].includes(String(action))) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const content = await prisma.kam_content.findUnique({
      where: { id: parsedId },
      select: { id: true },
    });

    // Some UI entries come from sector.resource_documents / v_documents_admin,
    // so they do not exist in kam_content and would violate FK on resource_log.
    if (!content) {
      return NextResponse.json({ success: true, skipped: true });
    }

    await prisma.resource_log.create({
      data: {
        resource_id: parsedId,
        action_type: action, // 'VIEW' or 'DOWNLOAD'
        created_at: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Tracking API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}