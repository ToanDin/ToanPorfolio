import nodemailer from 'nodemailer'

/**
 * Gửi email báo có liên hệ mới. Nếu chưa cấu hình SMTP thì bỏ qua êm
 * (message vẫn được lưu DB, xem trong trang admin).
 */
export async function notifyNewMessage({ name, email, content }) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_TO } = process.env
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !CONTACT_TO) return

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 465,
    secure: (Number(SMTP_PORT) || 465) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  })

  await transporter.sendMail({
    from: `"Portfolio" <${SMTP_USER}>`,
    to: CONTACT_TO,
    replyTo: email,
    subject: `[Portfolio] Tin nhắn mới từ ${name}`,
    text: `Tên: ${name}\nEmail: ${email}\n\n${content}`,
  })
}
