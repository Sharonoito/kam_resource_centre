const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
(async () => {
  const subs = await prisma.kam_sub_sector.findMany({
    where: { sector_id: 1 },
    select: { id: true, sector_id: true, name: true, slug: true },
    orderBy: { id: 'asc' }
  });
  // console.log('Sub-sectors for Agriculture (sector_id=1):', JSON.stringify(subs, null, 2));
  await prisma.$disconnect();
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
