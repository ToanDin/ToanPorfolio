import { PrismaClient } from '@prisma/client'

/**
 * PrismaClient dùng chung, cache giữa các invocation.
 * Quan trọng trên Vercel serverless: mỗi lần hot-reload / mỗi function instance
 * mà tạo client mới sẽ làm cạn connection pool của Postgres.
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

/** Đảm bảo đã kết nối được Postgres (gọi ở middleware của app). */
let connectPromise = null
export default function connectDB() {
  if (!process.env.POSTGRES_PRISMA_URL) {
    return Promise.reject(new Error('Thiếu biến môi trường POSTGRES_PRISMA_URL'))
  }
  connectPromise ??= prisma.$connect().catch((err) => {
    connectPromise = null // cho phép thử lại ở request sau
    throw err
  })
  return connectPromise
}
