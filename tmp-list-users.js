import prisma from "./lib/prisma.js"

async function main() {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, role: true, password: { select: { _isNull: true } } }
  })
  console.table(users.map(u => ({
    id: u.id,
    email: u.email,
    role: u.role,
    hasPassword: u.password === null ? "NULL" : "SET"
  })))
}

main().catch(console.error).finally(() => process.exit(0))
