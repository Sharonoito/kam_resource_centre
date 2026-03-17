import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  // Note: params is now a Promise in Next.js 15/16
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Unwrap the params promise
    const resolvedParams = await params;
    const idString = resolvedParams.id;

    // 2. Validate and parse the ID
    if (!idString) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const id = parseInt(idString);

    // 3. Query the database
    const record = await prisma.icms_master.findUnique({
      where: { id: id },
    });

    if (!record) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    return NextResponse.json(record);
  } catch (error: any) {
    console.error("API ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}