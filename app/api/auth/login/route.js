import crypto from 'node:crypto'
import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server'
import { rateLimit, clientIp } from '@/lib/server/rate-limit.js'

export const dynamic = 'force-dynamic'

/** So sánh chuỗi an toàn (chống timing attack) */
function safeEqual(a, b) {
  const ba = Buffer.from(String(a))
  const bb = Buffer.from(String(b))
  if (ba.length !== bb.length) return false
  return crypto.timingSafeEqual(ba, bb)
}

/** POST /api/auth/login — chống brute-force: 10 lần / 15 phút / IP */
export async function POST(request) {
  if (!rateLimit(`login:${clientIp(request)}`, { windowMs: 15 * 60 * 1000, max: 10 })) {
    return NextResponse.json({ message: 'Thử lại sau — quá nhiều lần đăng nhập.' }, { status: 429 })
  }

  const { email, password } = (await request.json().catch(() => null)) ?? {}
  const { ADMIN_EMAIL, ADMIN_PASSWORD, JWT_SECRET } = process.env

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD || !JWT_SECRET) {
    return NextResponse.json(
      { message: 'Server chưa cấu hình ADMIN_EMAIL / ADMIN_PASSWORD / JWT_SECRET' },
      { status: 500 },
    )
  }

  const ok = safeEqual(email ?? '', ADMIN_EMAIL) && safeEqual(password ?? '', ADMIN_PASSWORD)
  if (!ok) return NextResponse.json({ message: 'Sai email hoặc mật khẩu' }, { status: 401 })

  const token = jwt.sign({ role: 'admin', email }, JWT_SECRET, { expiresIn: '1d' })
  return NextResponse.json({ token })
}
