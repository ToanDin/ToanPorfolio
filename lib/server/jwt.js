/**
 * JWT HS256 tối giản dùng Web Crypto — chạy được cả Node (Route Handlers)
 * lẫn Edge runtime (middleware.js), không cần thư viện ngoài.
 * Chỉ chấp nhận alg=HS256, luôn kiểm tra exp/iat.
 */

const enc = new TextEncoder()
const dec = new TextDecoder()

function b64url(input) {
  const bytes = typeof input === 'string' ? enc.encode(input) : new Uint8Array(input)
  let bin = ''
  for (const b of bytes) bin += String.fromCharCode(b)
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function b64urlDecode(str) {
  const pad = str.length % 4 === 0 ? '' : '='.repeat(4 - (str.length % 4))
  const bin = atob(str.replace(/-/g, '+').replace(/_/g, '/') + pad)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return bytes
}

async function importKey(secret) {
  return crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  )
}

/** Tạo token. expiresInSec mặc định 1 ngày. */
export async function signJwt(payload, secret, { expiresInSec = 60 * 60 * 24 } = {}) {
  const now = Math.floor(Date.now() / 1000)
  const header = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const body = b64url(JSON.stringify({ ...payload, iat: now, exp: now + expiresInSec }))
  const data = `${header}.${body}`
  const key = await importKey(secret)
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(data))
  return `${data}.${b64url(sig)}`
}

/** Trả về payload nếu hợp lệ & chưa hết hạn, ngược lại null. */
export async function verifyJwt(token, secret) {
  try {
    if (typeof token !== 'string' || !secret) return null
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const [h, b, s] = parts

    const header = JSON.parse(dec.decode(b64urlDecode(h)))
    if (header?.alg !== 'HS256') return null

    const key = await importKey(secret)
    const ok = await crypto.subtle.verify('HMAC', key, b64urlDecode(s), enc.encode(`${h}.${b}`))
    if (!ok) return null

    const payload = JSON.parse(dec.decode(b64urlDecode(b)))
    const now = Math.floor(Date.now() / 1000)
    if (typeof payload.exp !== 'number' || payload.exp <= now) return null
    if (typeof payload.iat === 'number' && payload.iat > now + 60) return null
    return payload
  } catch {
    return null
  }
}
