import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
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

    const filterConditions: Prisma.Sql[] = [Prisma.sql`is_active = ${isActive}`]
    if (sector) {
      filterConditions.push(Prisma.sql`sector ILIKE ${`%${sector}%`}`)
    }
    const whereClause = Prisma.sql`WHERE ${Prisma.join(filterConditions, ' AND ')}`

    const [documents, totalRows] = await Promise.all([
      prisma.$queryRaw<typeof prisma.v_documents_admin[]>`
        SELECT * FROM v_documents_admin
        ${whereClause}
        ORDER BY title ASC
        LIMIT ${limit}
        OFFSET ${skip}
      `,
      prisma.$queryRaw<[{ count: bigint }]>`
        SELECT COUNT(*) as count FROM v_documents_admin
        ${whereClause}
      `,
    ])

    const total = Number(totalRows[0]?.count ?? 0)

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