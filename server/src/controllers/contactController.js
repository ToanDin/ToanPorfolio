import { prisma } from '../config/db.js'
import { notifyNewMessage } from '../utils/mailer.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function submitContact(req, res) {
  const { name, email, content } = req.body ?? {}

  if (!name?.trim() || !content?.trim() || !EMAIL_RE.test(email ?? '')) {
    return res.status(400).json({ message: 'Vui lòng điền đầy đủ tên, email hợp lệ và nội dung.' })
  }
  if (name.trim().length > 100 || email.trim().length > 150 || content.trim().length > 2000) {
    return res.status(400).json({ message: 'Nội dung quá dài — vui lòng rút ngắn lại.' })
  }

  const message = await prisma.message.create({
    data: {
      name: name.trim(),
      email: email.trim(),
      content: content.trim(),
    },
  })

  // Gửi email thông báo — lỗi email không làm hỏng request
  try {
    await notifyNewMessage(message)
  } catch (err) {
    console.error('Gửi email thất bại:', err.message)
  }

  res.status(201).json({ ok: true })
}

export async function listMessages(req, res) {
  const messages = await prisma.message.findMany({ orderBy: { createdAt: 'desc' } })
  res.json(messages)
}
