import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import Papa from 'papaparse'
// Import the Enum type from Prisma so we can cast correctly
import { ContentType, ContentVisibility } from '@prisma/client'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const user = session?.user as any

    if (!user?.role || user.role !== 'SUPERADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await req.formData()
    const file = data.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const content = buffer.toString('utf8')
    
    // Parse CSV
    const parsed = Papa.parse(content, { header: true, skipEmptyLines: true })
    const rows = parsed.data as any[]

    const created = []

    for (const row of rows) {
      // Basic validation: skip rows without essential info
      if (!row.title || !row.sector_slug) continue

      const sector = await prisma.kam_sector.findUnique({
        where: { slug: row.sector_slug }
      })
      
      if (!sector) {
        console.warn(`Sector slug "${row.sector_slug}" not found. Skipping row.`);
        continue
      }

      const slug = row.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

      const contentData = await prisma.kam_content.create({
        data: {
          title: row.title,
          slug: `${slug}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`, // Added random to ensure bulk uniqueness
          description: row.description || '',
          content_type: (row.content_type as ContentType) || 'PDF', // FIX 1: Casting to Enum
          visibility: (row.visibility as ContentVisibility) || 'PUBLIC',
          sector_id: sector.id,          // FIX 2: Matching schema snake_case
          pdf_url: row.file_name ? `/uploads/${row.file_name}` : null, // FIX 3: Matching schema
          tags: row.tags || '',
          is_active: true,               // FIX 4: Matching schema
        }
      })

      created.push(contentData)
    }

    // Log bulk
    // Note: If you still get a red line on adminLog, run 'npx prisma generate'
    await (prisma as any).adminLog.create({
      data: {
        user_id: user.id,              // FIX 5: user_id and id access
        action: 'UPLOAD_BULK',
        resource: `${created.length} items`,
        details: { count: created.length }
      }
    })

    return NextResponse.json({ success: true, created: created.length })

  } catch (error) {
    console.error("BULK_UPLOAD_ERROR:", error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}