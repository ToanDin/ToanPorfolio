import { NextResponse } from 'next/server'
import { prisma } from '@/lib/server/prisma.js'
import { notifyNewMessage } from '@/lib/server/mailer.js'
import { rateLimit, clientIp } from '@/lib/server/rate-limit.js'

export const dynamic = 'force-dynamic'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** POST /api/contact — chống spam: 5 lần / 15 phút / IP */
export async function POST(request) {
  if (!rateLimit(`contact:${clientIp(request)}`, { windowMs: 15 * 60 * 1000, max: 5 })) {
    return NextResponse.json({ message: 'Gửi quá nhiều — thử lại sau ít phút.' }, { status: 429 })
  }

  const { name, email, content } = (await request.json().catch(() => null)) ?? {}

  if (!name?.trim() || !content?.trim() || !EMAIL_RE.test(email ?? '')) {
    return NextResponse.json(
      { message: 'Vui lòng điền đầy đủ tên, email hợp lệ và nội dung.' },
      { status: 400 },
    )
  }
  if (name.trim().length > 100 || email.trim().length > 150 || content.trim().length > 2000) {
    return NextResponse.json({ message: 'Nội dung quá dài — vui lòng rút ngắn lại.' }, { status: 400 })
  }

  const message = await prisma.message.create({
    data: { name: name.trim(), email: email.trim(), content: content.trim() },
  })

  // Gửi email thông báo qua SMTP (nếu cấu hình) — lỗi email không làm hỏng request
  try {
    await notifyNewMessage(message)
  } catch (err) {
    console.error('Gửi email thất bại:', err.message)
  }

  return NextResponse.json({ ok: true }, { status: 201 })
}
