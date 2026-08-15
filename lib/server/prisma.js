import { PrismaClient } from '@prisma/client'

/**
 * PrismaClient dùng chung, cache trên globalThis.
 * - Dev: tránh tạo client mới mỗi lần hot-reload.
 * - Vercel serverless: tái dùng client giữa các invocation, không cạn pool
 *   (POSTGRES_PRISMA_URL đi qua connection pooler).
 */
const globalForPrisma = globalThis

export const prisma =
  globalForPrisma._prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'production' ? ['error'] : ['error', 'warn'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma._prisma = prisma
}
