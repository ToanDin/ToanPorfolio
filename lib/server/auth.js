import { NextResponse } from 'next/server'
import { verifyJwt } from './jwt.js'

export const AUTH_COOKIE = 'admin_session'
export const SESSION_TTL_SEC = 60 * 60 * 24 // 1 ngày

/** Thuộc tính cookie phiên admin: httpOnly + Secure (prod) + SameSite=Strict */
export function sessionCookieOptions(maxAge = SESSION_TTL_SEC) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge,
  }
}

/**
 * Chống CSRF cho request thay đổi dữ liệu: Origin (hoặc Referer) phải trùng host.
 * SameSite=Strict đã chặn phần lớn, đây là lớp phòng thủ thứ hai.
 */
function sameOrigin(request) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) return true
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host')
  const origin = request.headers.get('origin') ?? request.headers.get('referer')
  if (!host || !origin) return false
  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
}

/**
 * Xác thực admin cho Route Handlers — đọc JWT từ cookie httpOnly.
 * Trả về payload nếu hợp lệ, ngược lại null.
 */
export async function getAdmin(request) {
  const token = request.cookies.get(AUTH_COOKIE)?.value
  if (!token || !process.env.JWT_SECRET) return null
  if (!sameOrigin(request)) return null
  const payload = await verifyJwt(token, process.env.JWT_SECRET)
  return payload?.role === 'admin' ? payload : null
}

export const unauthorized = () =>
  NextResponse.json({ message: 'Chưa đăng nhập hoặc phiên đã hết hạn' }, { status: 401 })
