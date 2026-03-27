import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const sector = searchParams.get('sector')
    const isActive = searchParams.get('active') === 'true'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const skip = (page - 1) * limit

    // Using Prisma Client for GET is cleaner than Raw SQL if your schema is generated
    const where: any = {
      is_active: isActive,
    }

    if (sector) {
      where.sector = {
        contains: sector,
        mode: 'insensitive',
      }
    }

    const [documents, total] = await Promise.all([
      prisma.v_documents_admin.findMany({
        where,
        skip,
        take: limit,
        orderBy: { title: 'asc' },
      }),
      prisma.v_documents_admin.count({ where }),
    ])

    return NextResponse.json({ documents, total, page, limit })
  } catch (error) {
    console.error('Documents query error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// Use PATCH for updates. It targets the TABLE, not the VIEW.
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id, is_active, is_published } = await req.json()

    // Targeted update on the actual table (likely kam_content or document)
    // Adjust the model name below to match your schema.prisma exactly
    const updated = await prisma.kam_content.update({
      where: { id: Number(id) },
      data: { 
        ...(is_active !== undefined && { is_active }),
        ...(is_published !== undefined && { is_published }),
        updated_at: new Date()
      },
    })

    return NextResponse.json({ success: true, updated })
  } catch (error) {
    console.error('Update error:', error)
    return NextResponse.json({ error: 'Update failed. Ensure you are targeting the table, not the view.' }, { status: 500 })
  }
}