import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    // 1. Get unique years from the database
    const yearsData = await prisma.icms_master.findMany({
      select: { year: true },
      distinct: ['year'],
      orderBy: { year: 'desc' }
    })

    // 2. Get unique countries (origin_country)
    const countriesData = await prisma.icms_master.findMany({
      select: { origin_country: true },
      distinct: ['origin_country'],
      where: {
        NOT: { origin_country: null }
      },
      orderBy: { origin_country: 'asc' }
    })

    // 3. Format the response for the frontend
    return NextResponse.json({
      years: yearsData.map(y => y.year).filter(Boolean),
      countries: countriesData.map(c => c.origin_country).filter(Boolean)
    })
    
  } catch (error: any) {
    console.error("Meta API Error:", error)
    return NextResponse.json({ 
      error: "Failed to fetch metadata",
      years: [], 
      countries: [] 
    }, { status: 500 })
  }
}