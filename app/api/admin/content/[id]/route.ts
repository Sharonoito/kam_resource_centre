import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// Define a reusable type for the context
type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  try {
    // 1. Await the params
    const { id: rawId } = await params;
    const id = Number(rawId);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    // 2. Perform deletion
    await prisma.kam_content.delete({ where: { id } });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete Error:', error);
    return NextResponse.json({ error: 'Failed to delete record' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  try {
    // 1. Await the params
    const { id: rawId } = await params;
    const id = Number(rawId);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    // 2. Parse request body
    const data = await req.json();
    const { title, slug, content_type, is_active } = data;

    // 3. Update database
    const updated = await prisma.kam_content.update({
      where: { id },
      data: { title, slug, content_type, is_active },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Update Error:', error);
    return NextResponse.json({ error: 'Failed to update record' }, { status: 500 });
  }
}