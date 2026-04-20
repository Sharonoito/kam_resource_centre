/**
 * seed-powerbi.js
 * Migrates all hardcoded Power BI page IDs from lib/powerbi-config.ts into the database.
 * Safe to re-run: uses upsert by slug.
 *
 * sector_id values must match KAM_SECTORS[*].id in types/sectors.ts
 * tags values must match HsSection.name in types/sectors.ts sectionsData
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Report 1: HS-section trade data (original report)
const BASE_URL_HS =
  'https://app.powerbi.com/view?r=eyJrIjoiYzcyNjY0ZTYtM2QyMy00YjczLTgwNTEtNTU1MzMwYzU4OWUyIiwidCI6Ijk0ZGQwMWM2LWFhMTItNGMzNS1hODEyLWMxMDc5ZGUyOGQ2YSIsImMiOjl9';

// Report 2: Sector-level export report
const BASE_URL_SECTOR =
  'https://app.powerbi.com/view?r=eyJrIjoiNDkyMWY5OGQtYzk3ZS00MTgyLTkyNDItODA5Y2JmNTc1MmExIiwidCI6ImRjZmU1OGFmLTQxNmEtNGQwMy1iNWRkLTNlM2U3YWY0ZmMyYSJ9';

// Report 3: Sector-level import report
const BASE_URL_IMPORTS =
  'https://app.powerbi.com/view?r=eyJrIjoiYzJlMTdjNTItOGM0MS00NGFhLWIxNDgtOTg2M2UwNGZhYTFhIiwidCI6ImRjZmU1OGFmLTQxNmEtNGQwMy1iNWRkLTNlM2U3YWY0ZmMyYSJ9';

// Report 4: Macro-economic data (Research Hub)
const BASE_URL_MACRO =
  'https://app.powerbi.com/view?r=eyJrIjoiZjc5Y2EyMDctYjQ2Ni00ZGJhLWFjYjYtZjY3NmZkMmNjZTNmIiwidCI6ImRjZmU1OGFmLTQxNmEtNGQwMy1iNWRkLTNlM2U3YWY0ZmMyYSJ9';

// Report 5: KRA Tax performance reports (sector / HS-section level)
const BASE_URL_TAX =
  'https://app.powerbi.com/view?r=eyJrIjoiNzk2OWU2OTUtODFiYS00ZTY2LWFlNGQtOTE1NTM3MDlhNTdlIiwidCI6Ijk0ZGQwMWM2LWFhMTItNGMzNS1hODEyLWMxMDc5ZGUyOGQ2YSIsImMiOjl9';

/**
 * tags must match HsSection.name exactly from types/sectors.ts.
 *
 * ── REPORT 2: Sector-level export reports ───────────────────────────────────
 * One report per sector. For sectors with a single HS section, tags is set
 * so the report appears under that section. For multi-section sectors, tags
 * is null — the report will be displayed in the "Sector Overview" group at
 * the top of the sector page.
 *
 * Overview / Sectors: cross-sector reports stored with sector_id=null.
 * These are not yet wired to a UI page — display location TBD.
 */
const POWERBI_RECORDS = [
  // ── Report 1: HS-section trade data (Agriculture, sector_id=1) ───────────
  {
    baseUrl:     BASE_URL_HS,
    slug:        'agri-live-animals-pbi',
    title:       'Live Animals & Products Dashboard',
    description: 'HS Section I: Live Animals & Products (Ch. 1–5)',
    sector_id:   1,
    tags:        'Live Animals & Products',
    pageId:      '5174b7720480096b117c',
  },
  {
    baseUrl:     BASE_URL_HS,
    slug:        'agri-vegetable-products-pbi',
    title:       'Vegetable Products Dashboard',
    description: 'HS Section II: Vegetable Products (Ch. 6–14)',
    sector_id:   1,
    tags:        'Vegetable Products',
    pageId:      'a07fc76b3ed0c671875c',
  },
  {
    baseUrl:     BASE_URL_HS,
    slug:        'agri-fats-oils-pbi',
    title:       'Fats and Oils Dashboard',
    description: 'HS Section III: Animal and Vegetable Fats and Oils (Ch. 15)',
    sector_id:   1,
    tags:        'Fats and Oils',
    pageId:      '5cb0946bc8c254a71ad0',
  },
  {
    baseUrl:     BASE_URL_HS,
    slug:        'agri-prepared-food-pbi',
    title:       'Prepared Foodstuffs Dashboard',
    description: 'HS Section IV: Prepared Foodstuffs (Ch. 16–24)',
    sector_id:   1,
    tags:        'Prepared Foodstuffs',
    pageId:      'e0b70589900315438756',
  },
  // ── Report 1: Mineral Products (two sectors share this HS section) ────────
  {
    baseUrl:     BASE_URL_HS,
    slug:        'energy-mineral-products-pbi',
    title:       'Mineral Products Dashboard',
    description: 'HS Section V: Mineral Products (Ch. 25–27)',
    sector_id:   11,
    tags:        'Mineral Products',
    pageId:      'eef57ede27775b057dd4',
  },
  {
    baseUrl:     BASE_URL_HS,
    slug:        'construction-mineral-products-pbi',
    title:       'Mineral Products Dashboard',
    description: 'HS Section V: Mineral Products (Ch. 25–27)',
    sector_id:   12,
    tags:        'Mineral Products',
    pageId:      'eef57ede27775b057dd4',
  },

  // ── Report 2: Sector-level export reports ─────────────────────────────────
  // Agriculture (id=1) — multi-section (I,II,III,IV) → no tag → Sector Overview
  {
    baseUrl:     BASE_URL_SECTOR,
    slug:        'sector-agriculture-export-pbi',
    title:       'Agriculture & Agro-processing Export Report',
    description: 'Sector-level export data for Agriculture and Agro-processing',
    sector_id:   1,
    tags:        null,
    pageId:      '067263adf56d980eb21d',
  },
  // Food & Beverages (id=2) — single section: IV (Prepared Foodstuffs)
  {
    baseUrl:     BASE_URL_SECTOR,
    slug:        'sector-food-beverages-export-pbi',
    title:       'Food & Beverages Export Report',
    description: 'Sector-level export data for Food and Beverages',
    sector_id:   2,
    tags:        'Prepared Foodstuffs',
    pageId:      '4bde26c07f15f0baee68',
  },
  // Leather & Footwear (id=4) — multi-section (VIII,XII) → no tag → Sector Overview
  {
    baseUrl:     BASE_URL_SECTOR,
    slug:        'sector-leather-footwear-export-pbi',
    title:       'Leather & Footwear Export Report',
    description: 'Sector-level export data for Leather and Footwear',
    sector_id:   4,
    tags:        null,
    pageId:      'f4f24a3844824b0fc162',
  },
  // Metal & Allied (id=9) — single section: XV (Base Metals)
  {
    baseUrl:     BASE_URL_SECTOR,
    slug:        'sector-metal-allied-export-pbi',
    title:       'Metal & Allied Export Report',
    description: 'Sector-level export data for Metal and Allied',
    sector_id:   9,
    tags:        'Base Metals',
    pageId:      'd84c61833a718f3ce25d',
  },
  // Paper (id=8) — single section: X (Paper & Pulp)
  {
    baseUrl:     BASE_URL_SECTOR,
    slug:        'sector-paper-export-pbi',
    title:       'Paper Sector Export Report',
    description: 'Sector-level export data for the Paper sector',
    sector_id:   8,
    tags:        'Paper & Pulp',
    pageId:      '07518f12097b6cedb16b',
  },
  // Timber (id=3) — single section: IX (Wood Articles)
  {
    baseUrl:     BASE_URL_SECTOR,
    slug:        'sector-timber-export-pbi',
    title:       'Timber Sector Export Report',
    description: 'Sector-level export data for the Timber sector',
    sector_id:   3,
    tags:        'Wood Articles',
    pageId:      'a28fe37a3d8afa703683',
  },
  // Plastics & Rubber (id=6) — single section: VII (Plastics & Rubber)
  {
    baseUrl:     BASE_URL_SECTOR,
    slug:        'sector-plastics-rubber-export-pbi',
    title:       'Plastics & Rubber Export Report',
    description: 'Sector-level export data for Plastics and Rubber',
    sector_id:   6,
    tags:        'Plastics & Rubber',
    pageId:      '50647fac11674e4a7fd1',
  },
  // Textile & Apparel (id=5) — single section: XI (Textiles)
  {
    baseUrl:     BASE_URL_SECTOR,
    slug:        'sector-textile-apparel-export-pbi',
    title:       'Textile & Apparel Export Report',
    description: 'Sector-level export data for Textile and Apparel',
    sector_id:   5,
    tags:        'Textiles',
    pageId:      'e9524eaa6bbf2fc882a6',
  },
  // Automotive (id=13) — single section: XVII (Transport)
  {
    baseUrl:     BASE_URL_SECTOR,
    slug:        'sector-automotive-export-pbi',
    title:       'Automotive Sector Export Report',
    description: 'Sector-level export data for the Automotive sector',
    sector_id:   13,
    tags:        'Transport',
    pageId:      '2d0a0edd1d29463b14b0',
  },
  // Pharmaceutical & Medical Equipment (id=7) — multi-section (VI,XVIII) → no tag
  {
    baseUrl:     BASE_URL_SECTOR,
    slug:        'sector-pharmaceutical-export-pbi',
    title:       'Pharmaceutical & Medical Equipment Export Report',
    description: 'Sector-level export data for Pharmaceutical and Medical Equipment',
    sector_id:   7,
    tags:        null,
    pageId:      '34e4f959864dc5150409',
  },
  // Chemical & Allied (id=10) — single section: VI (Chemical Products)
  {
    baseUrl:     BASE_URL_SECTOR,
    slug:        'sector-chemical-allied-export-pbi',
    title:       'Chemical & Allied Export Report',
    description: 'Sector-level export data for Chemical and Allied',
    sector_id:   10,
    tags:        'Chemical Products',
    pageId:      'c98d8455e0c7fbf8c2be',
  },
  // Energy, Electrical & Electronics (id=11) — multi-section (V,XVI) → no tag
  {
    baseUrl:     BASE_URL_SECTOR,
    slug:        'sector-energy-electrical-export-pbi',
    title:       'Energy, Electrical & Electronics Export Report',
    description: 'Sector-level export data for Energy, Electrical and Electronics',
    sector_id:   11,
    tags:        null,
    pageId:      'de13a4f21548d3c934df',
  },
  // Building, Mining & Construction (id=12) — multi-section (V,XIII,XV) → no tag
  {
    baseUrl:     BASE_URL_SECTOR,
    slug:        'sector-construction-export-pbi',
    title:       'Building, Mining & Construction Export Report',
    description: 'Sector-level export data for Building, Mining and Construction',
    sector_id:   12,
    tags:        null,
    pageId:      '1693831242cb7e3f9344',
  },
  // Overview & Sectors — cross-sector; sector_id=null; display location TBD
  {
    baseUrl:     BASE_URL_SECTOR,
    slug:        'global-overview-export-pbi',
    title:       'Manufacturing Exports Overview',
    description: 'High-level overview of Kenya manufacturing exports across all sectors',
    sector_id:   null,
    tags:        null,
    pageId:      '99bdc7204bd0394a0040',
  },
  {
    baseUrl:     BASE_URL_SECTOR,
    slug:        'global-sectors-export-pbi',
    title:       'All Sectors Export Summary',
    description: 'Cross-sector export summary for all KAM sectors',
    sector_id:   null,
    tags:        null,
    pageId:      'ReportSection2e5116d592f50302d0cc',
  },
  // ── Report 3: Sector import reports ──────────────────────────────────────
  {
    baseUrl:     BASE_URL_IMPORTS,
    slug:        'global-import-overview-pbi',
    title:       'Manufacturing Imports Overview',
    description: 'Top-level overview of manufacturing sector imports',
    sector_id:   null,
    tags:        null,
    pageId:      '959bd9f7af11e3813fa0',
  },
  {
    baseUrl:     BASE_URL_IMPORTS,
    slug:        'global-import-products-pbi',
    title:       'Import Products Summary',
    description: 'Summary of imported products across all sectors',
    sector_id:   null,
    tags:        null,
    pageId:      'b1a5e14364008dd77a3e',
  },
  {
    baseUrl:     BASE_URL_IMPORTS,
    slug:        'sector-agriculture-import-pbi',
    title:       'Agriculture & Agro-processing Import Report',
    description: 'Imports data for the agriculture and agro-processing sector',
    sector_id:   1,
    tags:        null,
    pageId:      'ab90600ddae857772059',
  },
  {
    baseUrl:     BASE_URL_IMPORTS,
    slug:        'sector-automotive-import-pbi',
    title:       'Automotive Import Report',
    description: 'Imports data for the automotive sector',
    sector_id:   13,
    tags:        'Transport',
    pageId:      '91eb920b5046a8894982',
  },
  {
    baseUrl:     BASE_URL_IMPORTS,
    slug:        'sector-construction-import-pbi',
    title:       'Building, Mining & Construction Import Report',
    description: 'Imports data for the building, mining and construction sector',
    sector_id:   12,
    tags:        null,
    pageId:      '72ddd7fbcc7f488a00a9',
  },
  {
    baseUrl:     BASE_URL_IMPORTS,
    slug:        'sector-chemical-allied-import-pbi',
    title:       'Chemical & Allied Import Report',
    description: 'Imports data for the chemical and allied products sector',
    sector_id:   10,
    tags:        'Chemical Products',
    pageId:      '095ab8690c6c69e31671',
  },
  {
    baseUrl:     BASE_URL_IMPORTS,
    slug:        'sector-energy-electrical-import-pbi',
    title:       'Energy, Electrical & Electronics Import Report',
    description: 'Imports data for the energy, electrical and electronics sector',
    sector_id:   11,
    tags:        null,
    pageId:      'af7a8b9444b5bf9c7854',
  },
  {
    baseUrl:     BASE_URL_IMPORTS,
    slug:        'sector-food-beverages-import-pbi',
    title:       'Food & Beverages Import Report',
    description: 'Imports data for the food and beverages sector',
    sector_id:   2,
    tags:        'Prepared Foodstuffs',
    pageId:      '03520d4eaf3ccc0e3039',
  },
  {
    baseUrl:     BASE_URL_IMPORTS,
    slug:        'sector-leather-footwear-import-pbi',
    title:       'Leather & Footwear Import Report',
    description: 'Imports data for the leather and footwear sector',
    sector_id:   4,
    tags:        null,
    pageId:      '68fe6099bf1a9e29e045',
  },
  {
    baseUrl:     BASE_URL_IMPORTS,
    slug:        'sector-metal-allied-import-pbi',
    title:       'Metal & Allied Import Report',
    description: 'Imports data for the metal and allied products sector',
    sector_id:   9,
    tags:        'Base Metals',
    pageId:      '82a76496eb0afa4fa6f4',
  },
  {
    baseUrl:     BASE_URL_IMPORTS,
    slug:        'sector-paper-import-pbi',
    title:       'Paper Sector Import Report',
    description: 'Imports data for the paper sector',
    sector_id:   8,
    tags:        'Paper & Pulp',
    pageId:      '8a1ab43100b0bbfd5232',
  },
  {
    baseUrl:     BASE_URL_IMPORTS,
    slug:        'sector-pharmaceutical-import-pbi',
    title:       'Pharmaceutical Import Report',
    description: 'Imports data for the pharmaceutical sector',
    sector_id:   7,
    tags:        null,
    pageId:      '74b475b6879dc03d9e05',
  },
  {
    baseUrl:     BASE_URL_IMPORTS,
    slug:        'sector-plastics-rubber-import-pbi',
    title:       'Plastics & Rubber Import Report',
    description: 'Imports data for the plastics and rubber sector',
    sector_id:   6,
    tags:        'Plastics & Rubber',
    pageId:      '1771bad8a7a3525024ad',
  },
  {
    baseUrl:     BASE_URL_IMPORTS,
    slug:        'sector-textile-apparel-import-pbi',
    title:       'Textile & Apparel Import Report',
    description: 'Imports data for the textile and apparel sector',
    sector_id:   5,
    tags:        'Textiles',
    pageId:      'a5ccc55e190668ebe8bb',
  },
  {
    baseUrl:     BASE_URL_IMPORTS,
    slug:        'sector-timber-import-pbi',
    title:       'Timber Sector Import Report',
    description: 'Imports data for the timber sector',
    sector_id:   3,
    tags:        'Wood Articles',
    pageId:      'ec6e65062c38a2b53f7c',
  },

  // ── Report 4: Macro-economic data (Research Hub) ─────────────────────────
  {
    baseUrl:     BASE_URL_MACRO,
    slug:        'macro-overview-pbi',
    title:       'Macro Overview',
    description: 'Top-level overview of macro-economic indicators for Africa',
    sector_id:   null,
    tags:        'macro',
    pageId:      '72bb1f7478e9717ba2aa',
  },
  {
    baseUrl:     BASE_URL_MACRO,
    slug:        'macro-africa-gdp-pbi',
    title:       'Africa GDP',
    description: 'Gross Domestic Product data across African countries',
    sector_id:   null,
    tags:        'macro',
    pageId:      '8aa1b521cdb3b63d3f74',
  },
  {
    baseUrl:     BASE_URL_MACRO,
    slug:        'macro-africa-gdp-growth-pbi',
    title:       'Africa GDP Growth Annual',
    description: 'Annual GDP growth rates across African countries',
    sector_id:   null,
    tags:        'macro',
    pageId:      '7f697ce2df3e4c122b84',
  },
  {
    baseUrl:     BASE_URL_MACRO,
    slug:        'macro-africa-gdp-per-capita-pbi',
    title:       'Africa GDP per Capita',
    description: 'GDP per capita trends across African countries',
    sector_id:   null,
    tags:        'macro',
    pageId:      '5a990f00cc67e0163efd',
  },
  {
    baseUrl:     BASE_URL_MACRO,
    slug:        'macro-africa-inflation-pbi',
    title:       'Africa Inflation',
    description: 'Inflation rates and trends across African countries',
    sector_id:   null,
    tags:        'macro',
    pageId:      'e7a87765923fc815aef6',
  },
  {
    baseUrl:     BASE_URL_MACRO,
    slug:        'macro-africa-deposit-rates-pbi',
    title:       'Africa Deposit Interest Rates',
    description: 'Deposit interest rates across African countries',
    sector_id:   null,
    tags:        'macro',
    pageId:      '6569f34e2337cf4fc9ed',
  },
  {
    baseUrl:     BASE_URL_MACRO,
    slug:        'macro-africa-lending-rates-pbi',
    title:       'Africa Lending Interest Rates',
    description: 'Lending interest rates across African countries',
    sector_id:   null,
    tags:        'macro',
    pageId:      '6efd0dc3a097354c25f9',
  },
  {
    baseUrl:     BASE_URL_MACRO,
    slug:        'macro-africa-real-interest-pbi',
    title:       'Africa Real Interest Rates',
    description: 'Real interest rates across African countries',
    sector_id:   null,
    tags:        'macro',
    pageId:      '6615b9f58971d58efeb2',
  },

  // ── Report 5: KRA Tax performance — Live Animals & Animal Products (Section I) ──
  {
    baseUrl:     BASE_URL_TAX,
    slug:        'kra-tax-live-animals-overview-pbi',
    title:       'Tax Performance — Live Animals & Animal Products',
    description: 'Overall tax performance report for HS Section I: Live Animals & Animal Products',
    sector_id:   1,
    tags:        'Live Animals & Products',
    pageId:      '6ec016681553452c19b0',
  },
  {
    baseUrl:     BASE_URL_TAX,
    slug:        'kra-export-duty-live-animals-pbi',
    title:       'Export Duty Performance — Live Animals & Animal Products',
    description: 'Export duty performance for HS Section I: Live Animals & Animal Products',
    sector_id:   1,
    tags:        'Live Animals & Products',
    pageId:      '699131e82eeab37bc12c',
  },
  {
    baseUrl:     BASE_URL_TAX,
    slug:        'kra-excise-duty-live-animals-pbi',
    title:       'Excise Duty Performance — Live Animals & Animal Products',
    description: 'Excise duty performance for HS Section I: Live Animals & Animal Products',
    sector_id:   1,
    tags:        'Live Animals & Products',
    pageId:      '5a148b282ab745e0c9be',
  },
  {
    baseUrl:     BASE_URL_TAX,
    slug:        'kra-idf-live-animals-pbi',
    title:       'Import Declaration Fee — Live Animals & Animal Products',
    description: 'Import Declaration Fee performance for HS Section I: Live Animals & Animal Products',
    sector_id:   1,
    tags:        'Live Animals & Products',
    pageId:      '1ac94e6b666cc9ee1a3b',
  },
  {
    baseUrl:     BASE_URL_TAX,
    slug:        'kra-import-duty-live-animals-pbi',
    title:       'Import Duty Performance — Live Animals & Animal Products',
    description: 'Import duty performance overview for HS Section I: Live Animals & Animal Products',
    sector_id:   1,
    tags:        'Live Animals & Products',
    pageId:      '14c79f5688b66ee078c2',
  },
];

(async () => {
  // 1. Remove the temporary test record inserted via force-insert.sql
  const deleted = await prisma.kam_content.deleteMany({
    where: { title: { contains: 'TEST PowerBI' } },
  });
  if (deleted.count > 0) {/* console.log(`Removed ${deleted.count} test record(s)`); */}

  // 2. Upsert every proper record
  for (const record of POWERBI_RECORDS) {
    const embedUrl = `${record.baseUrl}&pageName=${record.pageId}`;

    await prisma.kam_content.upsert({
      where:  { slug: record.slug },
      update: {
        title:         record.title,
        description:   record.description,
        sector_id:     record.sector_id,
        tags:          record.tags,
        powerbi_embed: embedUrl,
        is_active:     true,
      },
      create: {
        slug:          record.slug,
        title:         record.title,
        description:   record.description,
        sector_id:     record.sector_id,
        content_type:  'POWERBI',
        powerbi_embed: embedUrl,
        tags:          record.tags,
        is_active:     true,
      },
    });

    /* console.log(`✓  ${record.slug}  →  sector_id=${record.sector_id}  tags="${record.tags}"`); */
  }

  // 3. Verify final state
  const all = await prisma.kam_content.findMany({
    where:   { content_type: 'POWERBI' },
    select:  { id: true, slug: true, sector_id: true, tags: true, is_active: true },
    orderBy: { id: 'asc' },
  });

  /* console.log('\nAll POWERBI records now in database:'); */
  console.table(all);

  await prisma.$disconnect();
  process.exit(0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
