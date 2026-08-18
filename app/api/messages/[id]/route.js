import { NextResponse } from 'next/server'
import { prisma } from '@/lib/server/prisma.js'
import { getAdmin, unauthorized } from '@/lib/server/auth.js'
import { isUuid } from '@/lib/server/validate.js'

export const dynamic = 'force-dynamic'

const notFound = () => NextResponse.json({ message: 'Không tìm thấy tin nhắn' }, { status: 404 })

/** PATCH /api/messages/:id — admin, đánh dấu đã đọc / chưa đọc */
export async function PATCH(request, { params }) {
  if (!(await getAdmin(request))) return unauthorized()
  if (!isUuid(params.id)) return notFound()
  try {
    const body = (await request.json().catch(() => null)) ?? {}
    const read = body.read !== false
    const message = await prisma.message.update({ where: { id: params.id }, data: { read } })
    return NextResponse.json(message)
  } catch (err) {
    if (err?.code === 'P2025') return notFound()
    console.error('[api/messages] PATCH:', err.message)
    return NextResponse.json({ message: 'Cập nhật thất bại' }, { status: 500 })
  }
}

/** DELETE /api/messages/:id — admin */
export async function DELETE(request, { params }) {
  if (!(await getAdmin(request))) return unauthorized()
  if (!isUuid(params.id)) return notFound()
  try {
    await prisma.message.delete({ where: { id: params.id } })
    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err?.code === 'P2025') return notFound()
    console.error('[api/messages] DELETE:', err.message)
    return NextResponse.json({ message: 'Xóa thất bại' }, { status: 500 })
  }
}
