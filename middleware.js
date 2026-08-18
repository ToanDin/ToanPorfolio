import { NextResponse } from 'next/server'
import { verifyJwt } from '@/lib/server/jwt.js'
import { AUTH_COOKIE } from '@/lib/server/auth.js'

/**
 * Bảo vệ trang admin ngay tại edge:
 * - /admin/dashboard (và mọi trang con) → chưa đăng nhập thì chuyển về /admin
 * - /admin (trang login) → đã đăng nhập thì chuyển thẳng vào dashboard
 * API vẫn tự xác thực riêng (lib/server/auth.js).
 */
export async function middleware(request) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get(AUTH_COOKIE)?.value
  const admin = token ? await verifyJwt(token, process.env.JWT_SECRET) : null
  const loggedIn = admin?.role === 'admin'

  if (pathname.startsWith('/admin/')) {
    if (!loggedIn) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin'
      url.search = ''
      const res = NextResponse.redirect(url)
      if (token) res.cookies.delete(AUTH_COOKIE) // token hỏng/hết hạn → dọn cookie
      return res
    }
    return NextResponse.next()
  }

  if (pathname === '/admin' && loggedIn) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/dashboard'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
}
