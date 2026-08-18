import crypto from 'node:crypto'

/**
 * Băm & kiểm tra mật khẩu admin bằng scrypt (có sẵn trong Node, không cần bcrypt).
 * Định dạng lưu: scrypt$N$r$p$<salt-hex>$<hash-hex>
 * Tạo hash: npm run hash-password -- 'mat-khau-cua-ban'
 */
const N = 16384
const R = 8
const P = 1
const KEYLEN = 64

export function hashPassword(password) {
  const salt = crypto.randomBytes(16)
  const hash = crypto.scryptSync(String(password), salt, KEYLEN, { N, r: R, p: P })
  return `scrypt$${N}$${R}$${P}$${salt.toString('hex')}$${hash.toString('hex')}`
}

export function isPasswordHash(value) {
  return typeof value === 'string' && value.startsWith('scrypt$')
}

/** So sánh an toàn theo thời gian, không lộ độ dài chuỗi */
export function safeEqual(a, b) {
  const ha = crypto.createHash('sha256').update(String(a)).digest()
  const hb = crypto.createHash('sha256').update(String(b)).digest()
  return crypto.timingSafeEqual(ha, hb)
}

/**
 * Kiểm tra mật khẩu. `stored` là hash scrypt (khuyến nghị) hoặc — để tương thích —
 * mật khẩu thô (sẽ cảnh báo trong log; nên chuyển sang ADMIN_PASSWORD_HASH).
 */
export function verifyPassword(password, stored) {
  if (!stored) return false
  if (!isPasswordHash(stored)) {
    if (process.env.NODE_ENV === 'production') {
      console.warn('[auth] ADMIN_PASSWORD đang lưu dạng thô — hãy dùng ADMIN_PASSWORD_HASH (npm run hash-password).')
    }
    return safeEqual(password, stored)
  }
  const [, n, r, p, saltHex, hashHex] = stored.split('$')
  const expected = Buffer.from(hashHex, 'hex')
  const actual = crypto.scryptSync(String(password), Buffer.from(saltHex, 'hex'), expected.length, {
    N: Number(n),
    r: Number(r),
    p: Number(p),
  })
  return crypto.timingSafeEqual(actual, expected)
}
