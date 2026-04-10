const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.$queryRawUnsafe(`
  SELECT LOWER(sector) as sector, COUNT(*)::int as cnt 
  FROM sector.resource_documents 
  WHERE is_active = TRUE AND is_published = TRUE 
  GROUP BY LOWER(sector) 
  ORDER BY cnt DESC 
  LIMIT 40
`)
  .then(r => { /* console.log(JSON.stringify(r, null, 2)); */ return prisma.$disconnect(); })
  .catch(e => { console.error(e.message); return prisma.$disconnect(); });
