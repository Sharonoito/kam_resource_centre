const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const tradeTables = await prisma.$queryRawUnsafe(
    "select schemaname, tablename from pg_tables where schemaname='trade' order by tablename"
  );
  console.log("trade schema tables:", tradeTables);

  const sectorTables = await prisma.$queryRawUnsafe(
    "select schemaname, tablename from pg_tables where schemaname='sector' and tablename like '%resource%documents%' order by tablename"
  );
  console.log("sector resource-like tables:", sectorTables);

  const sectorCount = await prisma.$queryRawUnsafe(
    "select count(*)::int as c from sector.resource_documents"
  );
  console.log("sector.resource_documents", sectorCount);

  const topSectors = await prisma.$queryRawUnsafe(
    "select sector, count(*)::int as c from sector.resource_documents group by sector order by c desc limit 10"
  );
  console.log("sector breakdown", topSectors);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
