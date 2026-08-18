import { NextResponse } from 'next/server'
import { prisma } from '@/lib/server/prisma.js'
import { getAdmin, unauthorized } from '@/lib/server/auth.js'

export const dynamic = 'force-dynamic'

const MAX_TAKE = 200

/**
 * GET /api/messages?take=100&cursor=<id>&unread=true — admin, mới nhất trước.
 * Có giới hạn số lượng để bảng messages lớn không kéo sập dashboard.
 */
export async function GET(request) {
  if (!(await getAdmin(request))) return unauthorized()
  const { searchParams } = new URL(request.url)
  const take = Math.min(Math.max(Number(searchParams.get('take')) || 100, 1), MAX_TAKE)
  const cursor = searchParams.get('cursor')
  const unreadOnly = searchParams.get('unread') === 'true'

  try {
    const messages = await prisma.message.findMany({
      where: unreadOnly ? { read: false } : {},
      orderBy: { createdAt: 'desc' },
      take,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    })
    return NextResponse.json(messages)
  } catch (err) {
    console.error('[api/messages] GET:', err.message)
    return NextResponse.json({ message: 'Không đọc được dữ liệu' }, { status: 500 })
  }
}
