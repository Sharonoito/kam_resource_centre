import { 
  PrismaClient, 
  Prisma, 
  ContentType, 
  ContentVisibility, 
  PricingTier, 
  PurchaseStatus 
} from '@prisma/client'

const prisma = new PrismaClient()

// 1. SECTORS DATA
const sectors = [
  {
    name: 'Agriculture and agro-processing',
    slug: 'agriculture-agro-processing',
    description: 'Covers agricultural production, processing, and export of crops.',
    icon: '🌾',
    color: '#22c55e',
    sort_order: 1
  },
  {
    name: 'Automotive',
    slug: 'automotive',
    description: 'Vehicle assembly and automotive parts.',
    icon: '🚗',
    color: '#3b82f6',
    sort_order: 2
  }
  // ... Add others as needed
]

async function main() {
  console.log('🌱 Starting KAM Resource Centre seed...')

  // 1. SEED SECTORS
  for (const sector of sectors) {
    await prisma.kam_sector.upsert({
      where: { slug: sector.slug },
      update: { ...sector },
      create: { ...sector }
    })
  }
  console.log('✅ Sectors synced.')

  // 2. SEED USERS
  const admin = await prisma.user.upsert({
    where: { email: 'admin@kam.co.ke' },
    update: {},
    create: {
      email: 'admin@kam.co.ke',
      name: 'Super Admin',
      role: 'SUPERADMIN'
    }
  })

  // 3. SEED CONTENT (Using YOUR Enum values: FREE, PREMIUM, ENTERPRISE)
  const content = await prisma.kam_content.upsert({
    where: { slug: 'livestock-report' },
    update: {},
    create: {
      title: 'Livestock Report',
      slug: 'livestock-report',
      description: 'Annual report.',
      content_type: ContentType.PDF,
      visibility: ContentVisibility.PUBLIC,
      pricing_tier: PricingTier.PREMIUM, // Matches your 'PREMIUM' enum
      price_kes: 500,
      pdf_url: '/doc.pdf',
      tags: 'report',
      sector_relation: { connect: { slug: 'agriculture-agro-processing' } }
    }
  })

  // 4. SEED PURCHASE (Using YOUR Enum values: PENDING, COMPLETED, FAILED)
  await prisma.purchase.create({
    data: {
      user_id: admin.id,
      content_id: content.id,
      mpesa_txn_id: 'TXN_' + Date.now(),
      amount: 500,
      status: PurchaseStatus.COMPLETED, // Matches your 'COMPLETED' enum
      download_token: 'token_123'
    }
  })

  console.log('🎉 Seed complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })