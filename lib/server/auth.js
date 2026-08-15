import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server'

/**
 * Xác thực admin cho Route Handlers — yêu cầu header:
 *   Authorization: Bearer <token>
 * Trả về payload nếu hợp lệ, ngược lại null.
 */
export function getAdmin(request) {
  const header = request.headers.get('authorization') ?? ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token || !process.env.JWT_SECRET) return null
  try {
    return jwt.verify(token, process.env.JWT_SECRET)
  } catch {
    return null
  }
}

export const unauthorized = () =>
  NextResponse.json({ message: 'Chưa đăng nhập hoặc token đã hết hạn' }, { status: 401 })
