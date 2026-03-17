import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const year = searchParams.get('year')
  const country = searchParams.get('country')
  const month = searchParams.get('month')
  const search = searchParams.get('search')
  const flow = searchParams.get('flow') // Added for regime filtering

  const filters: any = {
    AND: [
      year ? { year: parseInt(year) } : {},
      month ? { month: { contains: `-${month}` } } : {},
      country ? { origin_country: country } : {},
      flow ? { regime: { startsWith: flow, mode: 'insensitive' } } : {},
      search ? {
        OR: [
          { entry_number: { contains: search, mode: 'insensitive' } },
          { good_description: { contains: search, mode: 'insensitive' } },
          { hscode: { contains: search, mode: 'insensitive' } }
        ],
      } : {},
    ],
  }

  try {
    const totals = await prisma.icms_master.aggregate({
      _sum: { fob_value: true },
      _count: { id: true },
      _avg: { fob_value: true },
      where: filters,
    })

    const topCountry = await prisma.icms_master.groupBy({
      by: ['origin_country'],
      _sum: { fob_value: true },
      where: filters,
      orderBy: { _sum: { fob_value: 'desc' } },
      take: 1,
    })

    const topHsCode = await prisma.icms_master.groupBy({
      by: ['hscode'],
      _sum: { fob_value: true },
      where: filters,
      orderBy: { _sum: { fob_value: 'desc' } },
      take: 1,
    })

    return NextResponse.json({
      total_fob: totals._sum.fob_value || 0,
      record_count: totals._count.id || 0,
      average_fob: totals._avg.fob_value || 0,
      top_country: topCountry[0]?.origin_country || 'N/A',
      top_hscode: topHsCode[0]?.hscode || 'N/A',
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}


// import { NextResponse } from 'next/server'
// import prisma from '@/lib/prisma'

// export async function GET(request: Request) {
//   const { searchParams } = new URL(request.url)

//   const year = searchParams.get('year')
//   const country = searchParams.get('country')
//   const month = searchParams.get('month')
//   const search = searchParams.get('search')

//   const filters: any = {
//     AND: [
//       year ? { year: parseInt(year) } : {},
//       month ? { month } : {},
//       country ? { origin_country: country } : {},
//       search
//         ? {
//             OR: [
//               {
//                 entry_number: {
//                   contains: search,
//                   mode: 'insensitive',
//                 },
//               },
//               {
//                 good_description: {
//                   contains: search,
//                   mode: 'insensitive',
//                 },
//               },
//             ],
//           }
//         : {},
//     ],
//   }

//   try {
//     // 1️⃣ Aggregate totals
//     const totals = await prisma.icms_master.aggregate({
//       _sum: { fob_value: true },
//       _count: { id: true },
//       _avg: { fob_value: true },
//       where: filters,
//     })

//     // 2️⃣ Top Country
//     const topCountry = await prisma.icms_master.groupBy({
//       by: ['origin_country'],
//       _sum: { fob_value: true },
//       where: filters,
//       orderBy: {
//         _sum: {
//           fob_value: 'desc',
//         },
//       },
//       take: 1,
//     })

//     // 3️⃣ Top HS Code
//     const topHsCode = await prisma.icms_master.groupBy({
//       by: ['hscode'],
//       _sum: { fob_value: true },
//       where: filters,
//       orderBy: {
//         _sum: {
//           fob_value: 'desc',
//         },
//       },
//       take: 1,
//     })

//     return NextResponse.json({
//       total_fob: totals._sum.fob_value || 0,
//       record_count: totals._count.id || 0,
//       average_fob: totals._avg.fob_value || 0,
//       top_country: topCountry[0]?.origin_country || null,
//       top_hscode: topHsCode[0]?.hscode || null,
//     })
//   } catch (error: any) {
//     return NextResponse.json(
//       { error: error.message },
//       { status: 500 }
//     )
//   }
// }