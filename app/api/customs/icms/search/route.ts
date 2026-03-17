import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  // Pagination
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '12')
  const skip = (page - 1) * limit

  // Filters
  const tab = searchParams.get('tab') || 'overview' // overview, products, tax
  const year = searchParams.get('year')
  const product = searchParams.get('product') // HS Code
  const search = searchParams.get('search') // General search
  const flow = searchParams.get('flow') // IM or EX

  try {
    // Build filter conditions
    const whereConditions: any = {
      AND: [
        year ? { year: parseInt(year) } : {},
        product ? { hscode: { contains: product, mode: 'insensitive' } } : {},
        flow ? { regime: { startsWith: flow, mode: 'insensitive' } } : {},
        search ? {
          OR: [
            { entry_number: { contains: search, mode: 'insensitive' } },
            { good_description: { contains: search, mode: 'insensitive' } },
            { hscode: { contains: search, mode: 'insensitive' } }
          ]
        } : {}
      ]
    }

    let results: any[] = []

    if (tab === 'products') {
      // Group by HS Code (product) and aggregate
      const groupedProducts = await prisma.icms_master.groupBy({
        by: ['hscode', 'good_description'],
        _sum: { fob_value: true },
        _count: { id: true },
        _avg: { fob_value: true },
        where: whereConditions,
        orderBy: { _sum: { fob_value: 'desc' } },
        take: limit,
        skip: skip
      })

      results = groupedProducts.map(item => ({
        id: `product-${item.hscode}`,
        type: 'product',
        hscode: item.hscode,
        product: item.hscode,
        description: item.good_description,
        title: item.good_description || `HS Code: ${item.hscode}`,
        total_value: item._sum.fob_value || 0,
        total_declarations: item._count.id,
        avg_value: item._avg.fob_value || 0,
        source: 'database'
      }))
    } else if (tab === 'tax') {
      // Group by origin country (relevant for tax/tariff purposes)
      const groupedByCountry = await prisma.icms_master.groupBy({
        by: ['origin_country', 'regime'],
        _sum: { fob_value: true },
        _count: { id: true },
        where: whereConditions,
        orderBy: { _sum: { fob_value: 'desc' } },
        take: limit,
        skip: skip
      })

      results = groupedByCountry.map(item => ({
        id: `tax-${item.origin_country}-${item.regime}`,
        type: 'tax',
        country: item.origin_country,
        regime: item.regime,
        title: `${item.regime} from ${item.origin_country}`,
        total_value: item._sum.fob_value || 0,
        total_declarations: item._count.id,
        source: 'database'
      }))
    } else {
      // Overview: Show recent declarations with all details
      const declarations = await prisma.icms_master.findMany({
        where: whereConditions,
        take: limit,
        skip: skip,
        orderBy: { id: 'desc' }
      })

      results = declarations.map(item => ({
        id: item.id,
        type: 'declaration',
        entry_number: item.entry_number,
        good_description: item.good_description,
        hscode: item.hscode,
        regime: item.regime,
        origin_country: item.origin_country,
        fob_value: item.fob_value,
        title: item.good_description || 'Trade Declaration',
        description: `Declaration #${item.entry_number}`,
        total_value: item.fob_value,
        source: 'database'
      }))
    }

    // TODO: In future, aggregate PowerBI reports data here
    // TODO: In future, aggregate document data (PDFs, docs) here
    // For now, we're focusing on database data which is the primary source

    return NextResponse.json(results)
  } catch (error: any) {
    console.error("Search API Error:", error)
    return NextResponse.json(
      { error: error.message, results: [] },
      { status: 500 }
    )
  }
}
