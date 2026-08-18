import { NextResponse } from 'next/server'
import { prisma } from '@/lib/server/prisma.js'
import { notifyNewMessage } from '@/lib/server/mailer.js'
import { rateLimit, clientIp } from '@/lib/server/rate-limit.js'

export const dynamic = 'force-dynamic'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_FILL_MS = 2000 // form điền dưới 2 giây → gần như chắc chắn là bot

/** POST /api/contact — chống spam: 5 lần / 15 phút / IP + honeypot + thời gian điền */
export async function POST(request) {
  const allowed = await rateLimit(`contact:${clientIp(request)}`, { windowMs: 15 * 60 * 1000, max: 5 })
  if (!allowed) {
    return NextResponse.json({ message: 'Gửi quá nhiều — thử lại sau ít phút.' }, { status: 429 })
  }

  const body = (await request.json().catch(() => null)) ?? {}
  const { name, email, content, website, elapsedMs } = body

  // Honeypot: trường "website" ẩn với người thật; bot điền → giả vờ thành công
  if (website) return NextResponse.json({ ok: true }, { status: 201 })
  // Thời gian điền form do client tự đo (không phụ thuộc lệch giờ); bot điền tức thì → bỏ qua
  if (typeof elapsedMs === 'number' && elapsedMs >= 0 && elapsedMs < MIN_FILL_MS) {
    return NextResponse.json({ ok: true }, { status: 201 })
  }

  if (
    typeof name !== 'string' || typeof content !== 'string' || typeof email !== 'string' ||
    !name.trim() || !content.trim() || !EMAIL_RE.test(email.trim())
  ) {
    return NextResponse.json(
      { message: 'Vui lòng điền đầy đủ tên, email hợp lệ và nội dung.' },
      { status: 400 },
    )
  }
  if (name.trim().length > 100 || email.trim().length > 150 || content.trim().length > 2000) {
    return NextResponse.json({ message: 'Nội dung quá dài — vui lòng rút ngắn lại.' }, { status: 400 })
  }

  let message
  try {
    message = await prisma.message.create({
      data: { name: name.trim(), email: email.trim(), content: content.trim() },
    })
  } catch (err) {
    console.error('[api/contact] Lưu DB thất bại:', err.message)
    return NextResponse.json({ message: 'Không lưu được tin nhắn — thử lại sau.' }, { status: 500 })
  }

  // Gửi email thông báo qua SMTP (nếu cấu hình) — lỗi email không làm hỏng request
  try {
    await notifyNewMessage(message)
  } catch (err) {
    console.error('[api/contact] Gửi email thất bại:', err.message)
  }

  return NextResponse.json({ ok: true }, { status: 201 })
}
