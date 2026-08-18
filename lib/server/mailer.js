import nodemailer from 'nodemailer'

/** Loại ký tự xuống dòng để không thể chèn header email */
const oneLine = (s) => String(s ?? '').replace(/[\r\n]+/g, ' ').trim()

/**
 * Gửi email báo có liên hệ mới. Nếu chưa cấu hình SMTP thì bỏ qua êm
 * (message vẫn được lưu DB, xem trong trang admin).
 */
export async function notifyNewMessage({ name, email, content }) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_TO } = process.env
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !CONTACT_TO) return

  const port = Number(SMTP_PORT) || 465
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  })

  const safeName = oneLine(name).slice(0, 100)
  const safeEmail = oneLine(email)

  await transporter.sendMail({
    from: `"Portfolio" <${SMTP_USER}>`,
    to: CONTACT_TO,
    replyTo: safeEmail,
    subject: `[Portfolio] Tin nhắn mới từ ${safeName}`,
    text: `Tên: ${safeName}\nEmail: ${safeEmail}\n\n${content}`,
  })
}
