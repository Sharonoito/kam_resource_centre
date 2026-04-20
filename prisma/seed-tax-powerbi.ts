import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const taxReports = [
  { title: "Overall Tax Performance report", url: "https://app.powerbi.com/view?r=eyJrIjoiMmY2MTUxNGItYWMzZS00NDA0LTgxNWItMWY5MDNmOGMxYzc1IiwidCI6ImRjZmU1OGFmLTQxNmEtNGQwMy1iNWRkLTNlM2U3YWY0ZmMyYSJ9&pageName=8c155576057a157d7a01" },
  { title: "Overall Tax Performance Trend Report", url: "https://app.powerbi.com/view?r=eyJrIjoiMmY2MTUxNGItYWMzZS00NDA0LTgxNWItMWY5MDNmOGMxYzc1IiwidCI6ImRjZmU1OGFmLTQxNmEtNGQwMy1iNWRkLTNlM2U3YWY0ZmMyYSJ9&pageName=8ad2d9862834bf7c1764" },
  { title: "Export Duty Performance Report", url: "https://app.powerbi.com/view?r=eyJrIjoiMmY2MTUxNGItYWMzZS00NDA0LTgxNWItMWY5MDNmOGMxYzc1IiwidCI6ImRjZmU1OGFmLTQxNmEtNGQwMy1iNWRkLTNlM2U3YWY0ZmMyYSJ9&pageName=cb8374585a2b2810a615" },
  { title: "Excise Duty Performance Report", url: "https://app.powerbi.com/view?r=eyJrIjoiMmY2MTUxNGItYWMzZS00NDA0LTgxNWItMWY5MDNmOGMxYzc1IiwidCI6ImRjZmU1OGFmLTQxNmEtNGQwMy1iNWRkLTNlM2U3YWY0ZmMyYSJ9&pageName=cfe8266c2bd43232c198" },
  { title: "Import Declaration Fee Performance Report", url: "https://app.powerbi.com/view?r=eyJrIjoiMmY2MTUxNGItYWMzZS00NDA0LTgxNWItMWY5MDNmOGMxYzc1IiwidCI6ImRjZmU1OGFmLTQxNmEtNGQwMy1iNWRkLTNlM2U3YWY0ZmMyYSJ9&pageName=dcc2f15e77d04edd08eb" },
  { title: "Import duty Performance Report", url: "https://app.powerbi.com/view?r=eyJrIjoiMmY2MTUxNGItYWMzZS00NDA0LTgxNWItMWY5MDNmOGMxYzc1IiwidCI6ImRjZmU1OGFmLTQxNmEtNGQwMy1iNWRkLTNlM2U3YWY0ZmMyYSJ9&pageName=082f1fa9e313627083e0" },
  { title: "Import VAT Performance Report", url: "https://app.powerbi.com/view?r=eyJrIjoiMmY2MTUxNGItYWMzZS00NDA0LTgxNWItMWY5MDNmOGMxYzc1IiwidCI6ImRjZmU1OGFmLTQxNmEtNGQwMy1iNWRkLTNlM2U3YWY0ZmMyYSJ9&pageName=13d71309176c0bcd50e7" },
  { title: "Merchant Shipping Surcharge Performance Report", url: "https://app.powerbi.com/view?r=eyJrIjoiMmY2MTUxNGItYWMzZS00NDA0LTgxNWItMWY5MDNmOGMxYzc1IiwidCI6ImRjZmU1OGFmLTQxNmEtNGQwMy1iNWRkLTNlM2U3YWY0ZmMyYSJ9&pageName=8c5e365500070c8b6678" },
  { title: "Other Taxes Performance Report", url: "https://app.powerbi.com/view?r=eyJrIjoiMmY2MTUxNGItYWMzZS00NDA0LTgxNWItMWY5MDNmOGMxYzc1IiwidCI6ImRjZmU1OGFmLTQxNmEtNGQwMy1iNWRkLTNlM2U3YWY0ZmMyYSJ9&pageName=cda22ea4dd0818495b72" },
  { title: "Petroleum Regulatory Levy Performance Report", url: "https://app.powerbi.com/view?r=eyJrIjoiMmY2MTUxNGItYWMzZS00NDA0LTgxNWItMWY5MDNmOGMxYzc1IiwidCI6ImRjZmU1OGFmLTQxNmEtNGQwMy1iNWRkLTNlM2U3YWY0ZmMyYSJ9&pageName=0be106da9d0b044a0b8d" },
  { title: "Railway Development Levy Performance Report", url: "https://app.powerbi.com/view?r=eyJrIjoiMmY2MTUxNGItYWMzZS00NDA0LTgxNWItMWY5MDNmOGMxYzc1IiwidCI6ImRjZmU1OGFmLTQxNmEtNGQwMy1iNWRkLTNlM2U3YWY0ZmMyYSJ9&pageName=8e4849138ba587a873c3" },
  { title: "Road Maintenance Levy Performance Report", url: "https://app.powerbi.com/view?r=eyJrIjoiMmY2MTUxNGItYWMzZS00NDA0LTgxNWItMWY5MDNmOGMxYzc1IiwidCI6ImRjZmU1OGFmLTQxNmEtNGQwMy1iNWRkLTNlM2U3YWY0ZmMyYSJ9&pageName=0da86a41877673d496c5" },
  { title: "Agriculture and Food Processing Revenue performance Report", url: "https://app.powerbi.com/view?r=eyJrIjoiMmY2MTUxNGItYWMzZS00NDA0LTgxNWItMWY5MDNmOGMxYzc1IiwidCI6ImRjZmU1OGFmLTQxNmEtNGQwMy1iNWRkLTNlM2U3YWY0ZmMyYSJ9&pageName=00af670d24e3381aeccb" },
  { title: "Automotive Sector Revenue Performance Report", url: "https://app.powerbi.com/view?r=eyJrIjoiMmY2MTUxNGItYWMzZS00NDA0LTgxNWItMWY5MDNmOGMxYzc1IiwidCI6ImRjZmU1OGFmLTQxNmEtNGQwMy1iNWRkLTNlM2U3YWY0ZmMyYSJ9&pageName=749e0df698179ed6d9e2" },
  { title: "Building, Mining and Construction sector Revenue Performance Report", url: "https://app.powerbi.com/view?r=eyJrIjoiMmY2MTUxNGItYWMzZS00NDA0LTgxNWItMWY5MDNmOGMxYzc1IiwidCI6ImRjZmU1OGFmLTQxNmEtNGQwMy1iNWRkLTNlM2U3YWY0ZmMyYSJ9&pageName=d46ce332a91bf479c223" },
  { title: "Chemical and Allied Sector Revenue Performance Report", url: "https://app.powerbi.com/view?r=eyJrIjoiMmY2MTUxNGItYWMzZS00NDA0LTgxNWItMWY5MDNmOGMxYzc1IiwidCI6ImRjZmU1OGFmLTQxNmEtNGQwMy1iNWRkLTNlM2U3YWY0ZmMyYSJ9&pageName=d6bae634b4d33da79d17" },
  { title: "Energy and Electrical Sector Revenue Performance Report", url: "https://app.powerbi.com/view?r=eyJrIjoiMmY2MTUxNGItYWMzZS00NDA0LTgxNWItMWY5MDNmOGMxYzc1IiwidCI6ImRjZmU1OGFmLTQxNmEtNGQwMy1iNWRkLTNlM2U3YWY0ZmMyYSJ9&pageName=67b789c21b7ea32d06b9" },
  { title: "Food and Beverages Sector Revenue Performance Report", url: "https://app.powerbi.com/view?r=eyJrIjoiMmY2MTUxNGItYWMzZS00NDA0LTgxNWItMWY5MDNmOGMxYzc1IiwidCI6ImRjZmU1OGFmLTQxNmEtNGQwMy1iNWRkLTNlM2U3YWY0ZmMyYSJ9&pageName=590d7a571b10a6c3e042" },
  { title: "Leather and Footwear Revenue Performance Report", url: "https://app.powerbi.com/view?r=eyJrIjoiMmY2MTUxNGItYWMzZS00NDA0LTgxNWItMWY5MDNmOGMxYzc1IiwidCI6ImRjZmU1OGFmLTQxNmEtNGQwMy1iNWRkLTNlM2U3YWY0ZmMyYSJ9&pageName=e9f8f8674c1639c4ac36" },
  { title: "metals and Allied Sector Revenue Performance Report", url: "https://app.powerbi.com/view?r=eyJrIjoiMmY2MTUxNGItYWMzZS00NDA0LTgxNWItMWY5MDNmOGMxYzc1IiwidCI6ImRjZmU1OGFmLTQxNmEtNGQwMy1iNWRkLTNlM2U3YWY0ZmMyYSJ9&pageName=b41a5dec47a17177c512" },
  { title: "Paper Sector Revenue Performance Report", url: "https://app.powerbi.com/view?r=eyJrIjoiMmY2MTUxNGItYWMzZS00NDA0LTgxNWItMWY5MDNmOGMxYzc1IiwidCI6ImRjZmU1OGFmLTQxNmEtNGQwMy1iNWRkLTNlM2U3YWY0ZmMyYSJ9&pageName=077c2a50f2c7517c4861" },
  { title: "Pharmaceutical Sector Revenue Performance Report", url: "https://app.powerbi.com/view?r=eyJrIjoiMmY2MTUxNGItYWMzZS00NDA0LTgxNWItMWY5MDNmOGMxYzc1IiwidCI6ImRjZmU1OGFmLTQxNmEtNGQwMy1iNWRkLTNlM2U3YWY0ZmMyYSJ9&pageName=efaa0ab95692b26efa1e" },
  { title: "Plastic and Rubber Sector Revenue Performance Report", url: "https://app.powerbi.com/view?r=eyJrIjoiMmY2MTUxNGItYWMzZS00NDA0LTgxNWItMWY5MDNmOGMxYzc1IiwidCI6ImRjZmU1OGFmLTQxNmEtNGQwMy1iNWRkLTNlM2U3YWY0ZmMyYSJ9&pageName=5508162b7bd15e02a2f2" },
  { title: "Textile and Apparel Sector Revenue Performance Report", url: "https://app.powerbi.com/view?r=eyJrIjoiMmY2MTUxNGItYWMzZS00NDA0LTgxNWItMWY5MDNmOGMxYzc1IiwidCI6ImRjZmU1OGFmLTQxNmEtNGQwMy1iNWRkLTNlM2U3YWY0ZmMyYSJ9&pageName=e1601822a3f8c498e390" },
  { title: "Timber Sector Revenue Performance Report", url: "https://app.powerbi.com/view?r=eyJrIjoiMmY2MTUxNGItYWMzZS00NDA0LTgxNWItMWY5MDNmOGMxYzc1IiwidCI6ImRjZmU1OGFmLTQxNmEtNGQwMy1iNWRkLTNlM2U3YWY0ZmMyYSJ9&pageName=ebf6ae078bbd3b9b1da6" },
  { title: "Agriculture Revenue Trend Report", url: "https://app.powerbi.com/view?r=eyJrIjoiMmY2MTUxNGItYWMzZS00NDA0LTgxNWItMWY5MDNmOGMxYzc1IiwidCI6ImRjZmU1OGFmLTQxNmEtNGQwMy1iNWRkLTNlM2U3YWY0ZmMyYSJ9&pageName=1de75445efa01bd46f3a" },
  { title: "Automotive Sector Revenue Trend Report", url: "https://app.powerbi.com/view?r=eyJrIjoiMmY2MTUxNGItYWMzZS00NDA0LTgxNWItMWY5MDNmOGMxYzc1IiwidCI6ImRjZmU1OGFmLTQxNmEtNGQwMy1iNWRkLTNlM2U3YWY0ZmMyYSJ9&pageName=dec31b2716d4f112bbdd" },
  { title: "Building, Mining and Construction Sector Revenue Trend Report", url: "https://app.powerbi.com/view?r=eyJrIjoiMmY2MTUxNGItYWMzZS00NDA0LTgxNWItMWY5MDNmOGMxYzc1IiwidCI6ImRjZmU1OGFmLTQxNmEtNGQwMy1iNWRkLTNlM2U3YWY0ZmMyYSJ9&pageName=b5ccdde0fab80976188e" },
  { title: "Chemical and Allied Sector Revenue Trend Report", url: "https://app.powerbi.com/view?r=eyJrIjoiMmY2MTUxNGItYWMzZS00NDA0LTgxNWItMWY5MDNmOGMxYzc1IiwidCI6ImRjZmU1OGFmLTQxNmEtNGQwMy1iNWRkLTNlM2U3YWY0ZmMyYSJ9&pageName=5de395a4e2267ca38629" },
  { title: "Energy and Electricals Sector Revenue Trend Report", url: "https://app.powerbi.com/view?r=eyJrIjoiMmY2MTUxNGItYWMzZS00NDA0LTgxNWItMWY5MDNmOGMxYzc1IiwidCI6ImRjZmU1OGFmLTQxNmEtNGQwMy1iNWRkLTNlM2U3YWY0ZmMyYSJ9&pageName=57a40248f9386405c64e" },
  { title: "Food and Beverages sector Revenue Trend Report", url: "https://app.powerbi.com/view?r=eyJrIjoiMmY2MTUxNGItYWMzZS00NDA0LTgxNWItMWY5MDNmOGMxYzc1IiwidCI6ImRjZmU1OGFmLTQxNmEtNGQwMy1iNWRkLTNlM2U3YWY0ZmMyYSJ9&pageName=b4d1e3e98ee3dab2725d" },
  { title: "Leather and Footwear Revenue Trend Report", url: "https://app.powerbi.com/view?r=eyJrIjoiMmY2MTUxNGItYWMzZS00NDA0LTgxNWItMWY5MDNmOGMxYzc1IiwidCI6ImRjZmU1OGFmLTQxNmEtNGQwMy1iNWRkLTNlM2U3YWY0ZmMyYSJ9&pageName=51519b7d094df6d4295d" },
  { title: "Metal and Allied Sector Revenue Trend Report", url: "https://app.powerbi.com/view?r=eyJrIjoiMmY2MTUxNGItYWMzZS00NDA0LTgxNWItMWY5MDNmOGMxYzc1IiwidCI6ImRjZmU1OGFmLTQxNmEtNGQwMy1iNWRkLTNlM2U3YWY0ZmMyYSJ9&pageName=9ed8e0c3b7b0644b517e" },
  { title: "Paper sector Revenue Trend Revenue Trend ", url: "https://app.powerbi.com/view?r=eyJrIjoiMmY2MTUxNGItYWMzZS00NDA0LTgxNWItMWY5MDNmOGMxYzc1IiwidCI6ImRjZmU1OGFmLTQxNmEtNGQwMy1iNWRkLTNlM2U3YWY0ZmMyYSJ9&pageName=4686f2e7b5cd54de6280" },
  { title: "Pharmaceutical Sector Revenue Trend Report", url: "https://app.powerbi.com/view?r=eyJrIjoiMmY2MTUxNGItYWMzZS00NDA0LTgxNWItMWY5MDNmOGMxYzc1IiwidCI6ImRjZmU1OGFmLTQxNmEtNGQwMy1iNWRkLTNlM2U3YWY0ZmMyYSJ9&pageName=c2b0d8ed3a403c695839" },
  { title: "Plastic and Rubber Sector Revenue Trend Report", url: "https://app.powerbi.com/view?r=eyJrIjoiMmY2MTUxNGItYWMzZS00NDA0LTgxNWItMWY5MDNmOGMxYzc1IiwidCI6ImRjZmU1OGFmLTQxNmEtNGQwMy1iNWRkLTNlM2U3YWY0ZmMyYSJ9&pageName=9b920253f9ca98e35876" },
  { title: "Textile and Apparel Revenue Trend Report", url: "https://app.powerbi.com/view?r=eyJrIjoiMmY2MTUxNGItYWMzZS00NDA0LTgxNWItMWY5MDNmOGMxYzc1IiwidCI6ImRjZmU1OGFmLTQxNmEtNGQwMy1iNWRkLTNlM2U3YWY0ZmMyYSJ9&pageName=14937017b05364dd1417" },
  { title: "Timber Sector Revenue Trend Report", url: "https://app.powerbi.com/view?r=eyJrIjoiMmY2MTUxNGItYWMzZS00NDA0LTgxNWItMWY5MDNmOGMxYzc1IiwidCI6ImRjZmU1OGFmLTQxNmEtNGQwMy1iNWRkLTNlM2U3YWY0ZmMyYSJ9&pageName=569f361d91991875def5" }
];

async function main() {
  console.log('Ensuring Tax Hub sector exists in the sectors table...');

  // 1. Check/Create the Sector with ID -3
  // Note: Adjust the model name 'kam_sectors' if yours is just 'sectors'
  const taxSector = await prisma.kam_sector.upsert({
    where: { id: -3 },
    update: {},
    create: {
      id: -3,
      name: 'Tax Hub',
      slug: 'tax-hub',
      is_active: true,
    },
  });

  console.log(`Using Sector ID: ${taxSector.id}. Starting seed of 38 Tax Reports...`);
  
  for (const report of taxReports) {
    const baseSlug = report.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .substring(0, 240);
    
    const slug = `${baseSlug}-${Math.random().toString(36).slice(2, 8)}`;

    await prisma.kam_content.create({
      data: {
        title: report.title,
        slug,
        content_type: 'POWERBI',
        powerbi_url: report.url,
        sector_id: taxSector.id,
        tags: 'tax,Performance Reports',
        visibility: 'PUBLIC',
        is_active: true,
      },
    });
    console.log(`✅ Inserted: ${report.title}`);
  }
  
  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });