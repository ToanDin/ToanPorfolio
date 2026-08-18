import { NextResponse } from 'next/server'
import { getAdmin, unauthorized } from '@/lib/server/auth.js'

export const dynamic = 'force-dynamic'

/** GET /api/auth/me — kiểm tra phiên admin còn hiệu lực */
export async function GET(request) {
  const admin = await getAdmin(request)
  if (!admin) return unauthorized()
  return NextResponse.json({ email: admin.sub, exp: admin.exp })
}
