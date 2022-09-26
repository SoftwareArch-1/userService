import { PrismaClient } from '@prisma/client'

export const prismaClient = new PrismaClient({ errorFormat: 'minimal' })

async function main() {
  // ... you will write your Prisma Client queries here
}

main()
  .then(async () => {
    await prismaClient.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prismaClient.$disconnect()
    process.exit(1)
  })
