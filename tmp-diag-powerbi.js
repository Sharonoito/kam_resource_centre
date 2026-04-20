const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
(async () => {
  // Check all POWERBI records and their sector
  const powerbiRecords = await prisma.kam_content.findMany({
    where: { content_type: 'POWERBI' },
    select: {
      id: true, title: true, content_type: true, is_active: true,
      sector_id: true, sub_sector_id: true, powerbi_embed: true, powerbi_url: true,
    },
    orderBy: { id: 'desc' }
  });
  // console.log('All POWERBI records:', JSON.stringify(powerbiRecords, null, 2));

  // Check all sectors
  const sectors = await prisma.kam_sector.findMany({
    select: { id: true, name: true, slug: true, is_active: true },
    orderBy: { id: 'asc' }
  });
  // console.log('All sectors:', JSON.stringify(sectors, null, 2));

  // Simulate the exact query in fetchSectorPowerBiReports for agriculture (id=1)
  const forAgri = await prisma.kam_content.findMany({
    where: { sector_id: 1, content_type: 'POWERBI', is_active: true },
    select: { id: true, title: true, sector_id: true, sub_sector_id: true, powerbi_embed: true, powerbi_url: true }
  });
  // console.log('fetchSectorPowerBiReports(1) result:', JSON.stringify(forAgri, null, 2));

  await prisma.$disconnect();
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
