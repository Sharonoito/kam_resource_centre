const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
(async () => {
  const bad = await prisma.$queryRaw`SELECT id, title, filename, sharepoint_download_url, sharepoint_file_id FROM sector.resource_documents WHERE sharepoint_download_url LIKE '%graph.microsoft.com%' OR download_url LIKE '%graph.microsoft.com%' LIMIT 20`;
  console.log('Bad Graph URLs (first 20):', JSON.stringify(bad, null,2));
  const count = await prisma.$executeRaw`SELECT COUNT(*) FROM sector.resource_documents WHERE sharepoint_download_url LIKE '%graph.microsoft.com%'`;
  console.log('Total:', count);
  await prisma.$disconnect();
})().catch(console.error);
