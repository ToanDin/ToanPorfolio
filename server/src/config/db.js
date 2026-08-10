import mongoose from 'mongoose'

/**
 * Kết nối MongoDB, cache connection giữa các invocation
 * (quan trọng trên Vercel serverless — tránh mở kết nối mới mỗi request).
 */
let cached = globalThis._mongooseCached
if (!cached) {
  cached = globalThis._mongooseCached = { conn: null, promise: null }
}

export default async function connectDB() {
  if (cached.conn) return cached.conn

  if (!cached.promise) {
    const uri = process.env.MONGODB_URI
    if (!uri) throw new Error('Thiếu biến môi trường MONGODB_URI')
    cached.promise = mongoose.connect(uri, { bufferCommands: false })
  }

  cached.conn = await cached.promise
  return cached.conn
}
