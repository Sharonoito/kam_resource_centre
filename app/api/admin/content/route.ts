import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import fs from 'node:fs'
import path from 'node:path'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // Safety check for session and user
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Cast to access custom properties like role and id
    const user = session.user as any;

    if (user.role !== 'SUPERADMIN') {
      return NextResponse.json({ error: 'Forbidden: Admins only' }, { status: 403 })
    }

    const data = await req.formData()
    const title = data.get('title') as string
    const description = data.get('description') as string
    const sectorSlug = data.get('sectorSlug') as string
    const contentType = data.get('contentType') as string
    const file = data.get('file') as File

    if (!title || !sectorSlug || !file) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // 1. Get sector (Uses camelCase 'slug' because that's in your schema)
    const sector = await prisma.kam_sector.findUnique({
      where: { slug: sectorSlug }
    })
    
    if (!sector) {
      return NextResponse.json({ error: 'Sector not found' }, { status: 404 })
    }

    // 2. Generate slug and file path
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filename = `${slug}-${Date.now()}.pdf`
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    const filepath = path.join(uploadDir, filename)
    fs.writeFileSync(filepath, buffer)

    // 3. Create content (Matching your schema names)
    const content = await prisma.kam_content.create({
      data: {
        title,
        slug: `${slug}-${Date.now()}`,
        description,
        content_type: contentType as any, // Enum mapping
        visibility: 'PUBLIC',
        sector_id: sector.id,      // FIXED: was sectorId
        pdf_url: `/uploads/${filename}`, // FIXED: was pdfUrl
        is_active: true,           // FIXED: was isActive
      }
    })

// 4. Log the action
    // We cast prisma to 'any' to bypass the stale type definitions
    await (prisma as any).adminLog.create({
      data: {
        user_id: user.id,
        action: 'CREATE_CONTENT',
        resource: content.slug,
      }
    })
    return NextResponse.json({ success: true, content })

  } catch (error) {
    console.error("UPLOAD_ERROR:", error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}