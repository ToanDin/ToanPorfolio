import Message from '../models/Message.js'
import { notifyNewMessage } from '../utils/mailer.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function submitContact(req, res) {
  const { name, email, content } = req.body ?? {}

  if (!name?.trim() || !content?.trim() || !EMAIL_RE.test(email ?? '')) {
    return res.status(400).json({ message: 'Vui lòng điền đầy đủ tên, email hợp lệ và nội dung.' })
  }

  const message = await Message.create({
    name: name.trim(),
    email: email.trim(),
    content: content.trim(),
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
  const messages = await Message.find().sort({ createdAt: -1 })
  res.json(messages)
}
