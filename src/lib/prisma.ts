import { PrismaClient } from '../generated/prisma/index'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['error'] // mematikan semua logging Prisma
})

if (process.env.NODE_ENV !== 'development') globalForPrisma.prisma = prisma
