import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const plainPassword = 'password123'
  const hash = await bcrypt.hash(plainPassword, 10)

  const targetUser = await prisma.user.findFirst({
    where: {
      role: { in: ['KAM_MEMBER', 'PUBLIC', 'ADMIN'] }
    },
    select: { id: true, email: true }
  })

  if (!targetUser) {
    console.log('No test user found. Check Prisma Studio for roles.')
    return
  }

  await prisma.user.update({
    where: { id: targetUser.id },
    data: { password: hash }
  })

  console.log(`✅ SUCCESS: Set password "${plainPassword}" (hashed) for user: ${targetUser.email}`)
  console.log(`📧 Login at /auth/signin with:`)
  console.log(`   Email: ${targetUser.email}`)
  console.log(`   Password: ${plainPassword}`)
  console.log('\n🔄 Restart dev server if needed: Ctrl+C then npm run dev')
  console.log('\nFor Google, ensure GOOGLE_CLIENT_ID/SECRET in .env')
}

main()
  .catch(e => console.error('❌ Error:', e))
  .finally(async () => await prisma.$disconnect())
