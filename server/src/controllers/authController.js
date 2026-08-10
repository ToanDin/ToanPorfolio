import crypto from 'node:crypto'
import jwt from 'jsonwebtoken'

/** So sánh chuỗi an toàn (chống timing attack) */
function safeEqual(a, b) {
  const ba = Buffer.from(String(a))
  const bb = Buffer.from(String(b))
  if (ba.length !== bb.length) return false
  return crypto.timingSafeEqual(ba, bb)
}

export async function login(req, res) {
  const { email, password } = req.body ?? {}
  const { ADMIN_EMAIL, ADMIN_PASSWORD, JWT_SECRET } = process.env

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD || !JWT_SECRET) {
    return res.status(500).json({ message: 'Server chưa cấu hình ADMIN_EMAIL / ADMIN_PASSWORD / JWT_SECRET' })
  }

  const ok = safeEqual(email ?? '', ADMIN_EMAIL) && safeEqual(password ?? '', ADMIN_PASSWORD)
  if (!ok) return res.status(401).json({ message: 'Sai email hoặc mật khẩu' })

  const token = jwt.sign({ role: 'admin', email }, JWT_SECRET, { expiresIn: '1d' })
  res.json({ token })
}
