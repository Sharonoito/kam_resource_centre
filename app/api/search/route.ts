import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

const MAX_SEARCH_LIMIT = 100;

// Global Product Search API - Focuses on trade data (imports/exports) from icms_master
// Supports filtering by regime (import/export), year, and country
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const query = searchParams.get('q') || searchParams.get('query') || '';
  const regime = searchParams.get('regime'); // import, export, or all
  const year = searchParams.get('year');
  const country = searchParams.get('country');
  const hsCode = searchParams.get('hscode');
  const parsedLimit = Number.parseInt(searchParams.get('limit') || '20', 10);
  const limit = Number.isFinite(parsedLimit)
    ? Math.min(Math.max(parsedLimit, 1), MAX_SEARCH_LIMIT)
    : 20;

  if (!query || query.length < 2) {
    return NextResponse.json({ 
      results: [],
      filters: {
        regime: regime || 'all',
        year: year || null,
        country: country || null
      },
      message: 'Query must be at least 2 characters' 
    });
  }

  try {
    const searchTerm = query.toLowerCase();

    // Build filter conditions
    const whereConditions: any = {
      OR: [
        { good_description: { contains: searchTerm, mode: 'insensitive' } },
        { hscode: { contains: searchTerm, mode: 'insensitive' } },
        { entry_number: { contains: searchTerm, mode: 'insensitive' } },
        { origin_country: { contains: searchTerm, mode: 'insensitive' } },
        { country_name: { contains: searchTerm, mode: 'insensitive' } },
      ],
    };

    // Add regime filter (import/export)
    if (regime && regime !== 'all') {
      whereConditions.regime = regime.toUpperCase();
    }

    // Add year filter
    if (year) {
      const parsedYear = Number.parseInt(year, 10);
      if (Number.isFinite(parsedYear)) {
        whereConditions.year = parsedYear;
      }
    }

    // Add country filter
    if (country) {
      whereConditions.origin_country = { contains: country, mode: 'insensitive' };
    }

    // Add HS code filter
    if (hsCode) {
      whereConditions.hscode = { contains: hsCode, mode: 'insensitive' };
    }

    // Search trade data from icms_master
    const tradeResults = await prisma.icms_master.findMany({
      where: whereConditions,
      take: limit,
      orderBy: { id: 'desc' }
    });

    // Transform results to include all relevant trade information
    const results = tradeResults.map(item => ({
      id: item.id,
      // Basic identification
      entry_number: item.entry_number,
      hscode: item.hscode,
      hs_chapter: item.hs_chapter,
      good_description: item.good_description,
      
      // Trade type
      regime: item.regime, // IMPORT or EXPORT
      
      // Origin/Destination
      origin_country: item.origin_country,
      origin_country_code: item.origin_country_code,
      country_name: item.country_name,
      
      // Value & Quantity
      fob_value: item.fob_value,
      quantity: item.quantity,
      currency: item.currency,
      
      // Tax information
      total_tax_1: item.total_tax_1,
      total_tax_2: item.total_tax_2,
      import_duty: item.import_duty,
      import_vat: item.import_vat,
      excise: item.excise,
      export_levy: item.export_levy,
      idf: item.idf,
      rdl: item.rdl,
      rml: item.rml,
      prl: item.prl,
      mss: item.mss,
      other_tax: item.other_tax,
      
      // Date info
      year: item.year,
      month: item.month,
      reg_date: item.reg_date,
      
      // Navigation URL
      url: `/research/kra/${item.id}`,
    }));

    // Get unique years for filter options
    const years = await prisma.icms_master.findMany({
      select: { year: true },
      distinct: ['year'],
      orderBy: { year: 'desc' },
      take: 10
    });

    // Get unique countries for filter options
    const countries = await prisma.icms_master.findMany({
      select: { origin_country: true },
      distinct: ['origin_country'],
      where: { origin_country: { not: null } },
      orderBy: { origin_country: 'asc' },
      take: 20
    });

    // Log search query for analytics
    try {
      await prisma.kam_search_log.create({
        data: {
          query: query,
          results: results.length,
        }
      });
    } catch (logError) {
      console.warn('Search logging skipped');
    }

    return NextResponse.json({
      results,
      total: results.length,
      query,
      filters: {
        regime: regime || 'all',
        year: year || null,
        country: country || null,
        availableYears: years.map(y => y.year).filter(Boolean),
        availableCountries: countries.map(c => c.origin_country).filter(Boolean)
      }
    });

  } catch (error) {
    console.error('Search request failed', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      results: []
    }, { status: 500 });
  }
}

// Get all sectors with content count
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (body.action === 'getSectors') {
      const sectors = await prisma.kam_sector.findMany({
        where: { is_active: true },
        include: {
          _count: {
            select: {
              contents: {
                where: { is_active: true }
              }
            }
          }
        },
        orderBy: { sort_order: 'asc' }
      });

      return NextResponse.json({ sectors });
    }

    // Get featured content
    if (body.action === 'getFeatured') {
      const featured = await prisma.kam_content.findMany({
        where: {
          is_active: true,
          is_featured: true
        },
        include: {
          // sector: true,
          sub_sector: true,
        },
        take: 10,
        orderBy: { published_date: 'desc' }
      });

      return NextResponse.json({ featured });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Search POST request failed', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

