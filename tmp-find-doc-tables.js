const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const tables = await prisma.$queryRawUnsafe(`
    select table_schema, table_name
    from information_schema.tables
    where table_type='BASE TABLE'
      and table_schema not in ('pg_catalog','information_schema')
      and (table_name ilike '%document%' or table_name ilike '%resource%')
    order by table_schema, table_name
  `);

  for (const t of tables) {
    const fq = `${t.table_schema}.${t.table_name}`;
    try {
      const rows = await prisma.$queryRawUnsafe(`select count(*)::int as c from ${fq}`);
      // console.log(fq, rows[0]?.c ?? 0);
    } catch (e) {
      // console.log(fq, 'ERR', e.message);
    }
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
