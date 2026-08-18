import { NextResponse } from 'next/server'
import { rateLimit, clientIp } from '@/lib/server/rate-limit.js'
import { signJwt } from '@/lib/server/jwt.js'
import { safeEqual, verifyPassword } from '@/lib/server/password.js'
import { AUTH_COOKIE, SESSION_TTL_SEC, sessionCookieOptions } from '@/lib/server/auth.js'

export const dynamic = 'force-dynamic'

/**
 * POST /api/auth/login — chống brute-force: 10 lần / 15 phút / IP.
 * Thành công → đặt cookie httpOnly `admin_session` (không trả token cho JS).
 */
export async function POST(request) {
  const allowed = await rateLimit(`login:${clientIp(request)}`, { windowMs: 15 * 60 * 1000, max: 10 })
  if (!allowed) {
    return NextResponse.json({ message: 'Thử lại sau — quá nhiều lần đăng nhập.' }, { status: 429 })
  }

  const { email, password } = (await request.json().catch(() => null)) ?? {}
  const { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_PASSWORD_HASH, JWT_SECRET } = process.env
  const stored = ADMIN_PASSWORD_HASH || ADMIN_PASSWORD

  if (!ADMIN_EMAIL || !stored || !JWT_SECRET) {
    return NextResponse.json(
      { message: 'Server chưa cấu hình ADMIN_EMAIL / ADMIN_PASSWORD_HASH / JWT_SECRET' },
      { status: 500 },
    )
  }
  if (typeof email !== 'string' || typeof password !== 'string') {
    return NextResponse.json({ message: 'Sai email hoặc mật khẩu' }, { status: 401 })
  }

  const ok = safeEqual(email.trim().toLowerCase(), ADMIN_EMAIL.trim().toLowerCase()) && verifyPassword(password, stored)
  if (!ok) return NextResponse.json({ message: 'Sai email hoặc mật khẩu' }, { status: 401 })

  const token = await signJwt({ role: 'admin', sub: ADMIN_EMAIL }, JWT_SECRET, { expiresInSec: SESSION_TTL_SEC })
  const res = NextResponse.json({ ok: true })
  res.cookies.set(AUTH_COOKIE, token, sessionCookieOptions())
  return res
}
