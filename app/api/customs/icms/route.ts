import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  // Pagination params
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const skip = (page - 1) * limit;

  // Filters
  const year = searchParams.get('year');
  const country = searchParams.get('country');
  const month = searchParams.get('month'); 
  const search = searchParams.get('search');
  const flow = searchParams.get('flow');    // Maps to 'regime'
  const office = searchParams.get('office'); // Maps to 'station'

  try {
    const data = await prisma.icms_master.findMany({
      where: {
        AND: [
          year ? { year: parseInt(year) } : {},
          month ? { month: { contains: `-${month}` } } : {},
          country ? { origin_country: { equals: country, mode: 'insensitive' } } : {},
          flow ? { regime: { startsWith: flow, mode: 'insensitive' } } : {},
          office ? { station: { contains: office, mode: 'insensitive' } } : {},
          search ? {
            OR: [
              { entry_number: { contains: search, mode: 'insensitive' } },
              { good_description: { contains: search, mode: 'insensitive' } },
              { hscode: { contains: search, mode: 'insensitive' } }
            ]
          } : {}
        ]
      },
      take: limit,
      skip: skip,
      orderBy: { id: 'desc' } 
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}