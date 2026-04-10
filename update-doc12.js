const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
(async () => {
  const webUrl = 'https://kamkenya.sharepoint.com/sites/KAMWebResourceCentre/Shared%20Documents/KAM%20Sectors%20Data/Sector%20and%20Subsector%20%20Publications/sugar%20sub%20sector%20profile%202020%20(4).pdf';
  const updatedRes = await prisma.resource_documents.update({
    where: {id:12},
    data: {
      sharepoint_download_url: webUrl
    }
  });
  // console.log('Updated resource_documents#12:', updatedRes);
  const doc = await prisma.vDocumentsAdmin.findUnique({where:{id:12}, select:{download_url:true}});
  // console.log('Current vDocumentsAdmin download_url:', doc);
  await prisma.$disconnect();
  process.exit(0);
})().catch(console.error);
