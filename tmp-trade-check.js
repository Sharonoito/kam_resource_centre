const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  try {
    const resourceCount = await prisma.$queryRawUnsafe(
      "select count(*)::int as c from trade.resource_documents"
    );
    console.log("trade.resource_documents", resourceCount);
  } catch (error) {
    console.log("trade.resource_documents ERROR", error.message);
  }

  try {
    const mappedCount = await prisma.$queryRawUnsafe(
      "select count(*)::int as c from trade.trade_resource_documents"
    );
    console.log("trade.trade_resource_documents", mappedCount);
  } catch (error) {
    console.log("trade.trade_resource_documents ERROR", error.message);
  }

  try {
    const cols = await prisma.$queryRawUnsafe(
      "select column_name from information_schema.columns where table_schema='trade' and table_name='resource_documents' order by ordinal_position"
    );
    console.log("trade.resource_documents columns", cols.map((x) => x.column_name));
  } catch (error) {
    console.log("columns ERROR", error.message);
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
