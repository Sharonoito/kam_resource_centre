import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const country = searchParams.get('country')
  const search = searchParams.get('search')

  const filters: any = {
    AND: [
      country ? { origin_country: country } : {},
      search
        ? {
            OR: [
              {
                entry_number: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
              {
                good_description: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
            ],
          }
        : {},
    ],
  }

  try {
    const trend = await prisma.icms_master.groupBy({
      by: ['year', 'month'],
      _sum: { fob_value: true },
      where: filters,
      orderBy: [
        { year: 'asc' },
        { month: 'asc' },
      ],
    })

    const formatted = trend.map((item) => ({
      year: item.year,
      month: item.month,
      total_fob: item._sum.fob_value || 0,
    }))

    return NextResponse.json(formatted)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}