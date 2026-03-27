import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

// Define the 13 KAM Sectors
const sectors = [
  {
    name: 'Agriculture and agro-processing',
    slug: 'agriculture-agro-processing',
    description: 'Covers agricultural production, processing, and export of crops, horticultural products, and value-added agricultural goods.',
    icon: '🌾',
    color: '#22c55e',
    sort_order: 1
  },
  {
    name: 'Automotive',
    slug: 'automotive',
    description: 'Vehicle assembly, manufacturing of automotive parts, and related industrial services.',
    icon: '🚗',
    color: '#3b82f6',
    sort_order: 2
  },
  {
    name: 'Building, Mining and Construction Sector',
    slug: 'building-mining-construction',
    description: 'Construction materials, mining equipment, cement, steel, and building supplies.',
    icon: '🏗️',
    color: '#78716c',
    sort_order: 3
  },
  {
    name: 'Chemical and Allied',
    slug: 'chemical-allied',
    description: 'Industrial chemicals, fertilizers, paints, adhesives, and chemical products.',
    icon: '🧪',
    color: '#8b5cf6',
    sort_order: 4
  },
  {
    name: 'Energy, Electrical and Electronics',
    slug: 'energy-electrical-electronics',
    description: 'Power generation, electrical equipment, wiring, electronics manufacturing, and renewable energy.',
    icon: '⚡',
    color: '#eab308',
    sort_order: 5
  },
  {
    name: 'Food and Beverages',
    slug: 'food-beverages',
    description: 'Food processing, packaging, beverages manufacturing, and food safety standards.',
    icon: '🍫',
    color: '#f97316',
    sort_order: 6
  },
  {
    name: 'Leather and Footwear',
    slug: 'leather-footwear',
    description: 'Leather processing, shoe manufacturing, leather goods, and tanning operations.',
    icon: '👞',
    color: '#92400e',
    sort_order: 7
  },
  {
    name: 'Metal and Allied',
    slug: 'metal-allied',
    description: 'Metal fabrication, steel products, foundry operations, and metalworks.',
    icon: '⚙️',
    color: '#64748b',
    sort_order: 8
  },
  {
    name: 'Paper',
    slug: 'paper',
    description: 'Paper manufacturing, packaging materials, paper products, and printing supplies.',
    icon: '📄',
    color: '#fef3c7',
    sort_order: 9
  },
  {
    name: 'Pharmaceutical and Medical Equipment',
    slug: 'pharmaceutical-medical-equipment',
    description: 'Medicine manufacturing, medical devices, healthcare equipment, and pharmaceutical supplies.',
    icon: '💊',
    color: '#ef4444',
    sort_order: 10
  },
  {
    name: 'Plastics and Rubber',
    slug: 'plastics-rubber',
    description: 'Plastic manufacturing, rubber products, packaging, and polymer materials.',
    icon: '🧴',
    color: '#06b6d4',
    sort_order: 11
  },
  {
    name: 'Textile and Apparel',
    slug: 'textile-apparel',
    description: 'Clothing manufacturing, fabric production, textile mills, and garment export.',
    icon: '👕',
    color: '#ec4899',
    sort_order: 12
  },
  {
    name: 'Timber',
    slug: 'timber',
    description: 'Wood processing, furniture manufacturing, sawmilling, and timber products.',
    icon: '🪵',
    color: '#78350f',
    sort_order: 13
  }
]

async function main() {
  console.log('🌱 Starting KAM Resource Centre seed...')

  // 1. SEED SECTORS (existing logic)
  for (const sector of sectors) {
    const existingSector = await prisma.kam_sector.findUnique({
      where: { slug: sector.slug }
    })

    if (existingSector) {
      await prisma.kam_sector.update({
        where: { slug: sector.slug },
        data: {
          name: sector.name,
          description: sector.description,
          icon: sector.icon,
          color: sector.color,
          sort_order: sector.sort_order
        }
      })
      console.log(`✅ Updated sector: ${sector.name}`)
    } else {
      await prisma.kam_sector.create({
        data: sector
      })
      console.log(`✅ Created sector: ${sector.name}`)
    }
  }

  // 2. SEED USERS
  const users = [
    {
      email: 'admin@kam.co.ke',
      name: 'Super Admin',
      role: 'SUPERADMIN'
    },
    {
      email: 'member@kam.co.ke',
      name: 'KAM Member',
      role: 'MEMBER'
    }
  ]

  for (const userData of users) {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email }
    })

    if (!existingUser) {
      await prisma.user.create({
        data: userData
      })
      console.log(`✅ Created user: ${userData.name} (${userData.role})`)
    } else {
      console.log(`⚠️  User already exists: ${userData.name}`)
    }
  }

  // 3. SEED SAMPLE CONTENT w/PRICING
  const sampleContent: Prisma.kam_contentCreateInput[] = [
    {
      title: 'Livestock Annual Report 2024',
      slug: 'livestock-annual-report-2024',
      description: 'Comprehensive annual trade report for live animals and animal products.',
      content_type: 'PDF',
      visibility: 'PUBLIC',
      pricing_tier: 'PAID',
      price_kes: 500,
      pdf_url: '/documents/sector-reports/livestock-annual-report-2024.pdf',
      tags: 'livestock, trade, export, report',
      sector_relation: { connect: { slug: 'agriculture-agro-processing' } }
    },
    {
      title: 'Member Export Guide',
      slug: 'member-export-guide',
      description: 'Exclusive guide for KAM members on AfCFTA export procedures.',
      content_type: 'PDF',
      visibility: 'MEMBER',
      pricing_tier: 'MEMBER_ONLY',
      price_kes: 0,
      pdf_url: '/documents/member-export-guide.pdf',
      tags: 'afcfta, export, member, guide',
      sector_relation: { connect: { slug: 'automotive' } }
    },
    {
      title: 'Premium Market Analysis',
      slug: 'premium-market-analysis',
      description: 'Advanced market analysis report for paid subscribers.',
      content_type: 'PDF',
      visibility: 'PUBLIC',
      pricing_tier: 'PAID',
      price_kes: 1500,
      pdf_url: '/documents/premium-market-analysis.pdf',
      tags: 'market, analysis, premium, paid',
      sector_relation: { connect: { slug: 'chemical-allied' } }
    }
  ]

  for (const contentData of sampleContent) {
    const existingContent = await prisma.kam_content.findUnique({
      where: { slug: contentData.slug }
    })

    if (!existingContent) {
      await prisma.kam_content.create({
        data: contentData
      })
      console.log(`✅ Created content: ${contentData.title} (${contentData.pricing_tier})`)
    } else {
      console.log(`⚠️  Content already exists: ${contentData.title}`)
    }
  }

  // 4. SEED SAMPLE PURCHASE
  const memberUser = await prisma.user.findUnique({
    where: { email: 'member@kam.co.ke' }
  })

  const paidContent = await prisma.kam_content.findUnique({
    where: { slug: 'livestock-annual-report-2024' }
  })

  if (memberUser && paidContent) {
    const existingPurchase = await prisma.purchase.findFirst({
      where: {
        user_id: memberUser.id,
        content_id: paidContent.id
      }
    })

    if (!existingPurchase) {
      await prisma.purchase.create({
        data: {
          user_id: memberUser.id,
          content_id: paidContent.id,
          mpesa_txn_id: 'SAMPLE_TXN_12345',
          amount: 500,
          status: 'PAID',
          download_token: 'sample_download_token_abc123'
        }
      })
      console.log(`✅ Created sample purchase for member`)
    }
  }

  console.log('🎉 Full seed completed! Users, content with pricing, and sample purchase created.')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding sectors:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

