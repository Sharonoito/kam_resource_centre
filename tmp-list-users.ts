import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const users = await prisma.user.findMany({
    select: { 
      id: true, 
      email: true, 
      role: true, 
      password: true 
    }
  })
  console.table(users.map(u => ({
    id: u.id,
    email: u.email,
    role: u.role,
    hasPassword: u.password ? 'SET' : 'NULL'
  })))
}

main()
  .catch(e => console.error('Error:', e))
  .finally(async () => {
    await prisma.$disconnect()
  })
