const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
(async () => {
  const doc = await prisma.vDocumentsAdmin.findUnique({
    where: {id:12},
    select: {download_url: true, title: true, sector: true}
  });
  const res = await prisma.resource_documents.findUnique({
    where: {id:12},
    select: {sharepoint_download_url: true, sharepoint_file_id: true, filename: true, title: true, mime_type: true}
  });
  console.log('VDocumentsAdmin id=12:', JSON.stringify(doc, null,2));
  console.log('resource_documents id=12:', JSON.stringify(res, null,2));
  await prisma.$disconnect();
  process.exit(0);
})().catch(e => {
  console.error(e);
  process.exit(1);
});
