import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest, { params }) {
  const id = Number(params.id);
  if (!id) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  await prisma.kam_content.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

export async function PATCH(req: NextRequest, { params }) {
  const id = Number(params.id);
  if (!id) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  const data = await req.json();
  // Only allow updating editable fields
  const { title, slug, content_type, is_active } = data;
  await prisma.kam_content.update({
    where: { id },
    data: { title, slug, content_type, is_active },
  });
  return NextResponse.json({ success: true });
}
