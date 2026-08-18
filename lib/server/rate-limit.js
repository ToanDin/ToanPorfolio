/**
 * Rate limit theo IP trong một cửa sổ thời gian.
 *
 * - Nếu cấu hình UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN: dùng Redis
 *   (bộ đếm dùng chung giữa mọi serverless instance — cần thiết trên Vercel).
 * - Ngược lại: fallback Map trong bộ nhớ (chỉ hiệu quả khi chạy 1 process, ví dụ
 *   local/VPS; trên serverless mỗi instance có bộ đếm riêng nên chỉ chặn spam thô).
 */
const buckets = new Map()

function memoryLimit(key, { windowMs, max }) {
  const now = Date.now()
  const entry = buckets.get(key)

  if (!entry || now > entry.reset) {
    buckets.set(key, { count: 1, reset: now + windowMs })
    return true
  }
  entry.count += 1
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) if (now > v.reset) buckets.delete(k)
  }
  return entry.count <= max
}

async function redisLimit(key, { windowMs, max }) {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  const windowSec = Math.ceil(windowMs / 1000)
  const res = await fetch(`${url}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify([
      ['INCR', key],
      ['EXPIRE', key, windowSec, 'NX'],
    ]),
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`Upstash ${res.status}`)
  const [incr] = await res.json()
  return Number(incr?.result ?? 0) <= max
}

/** Trả về true nếu còn trong hạn mức, false nếu vượt. Lỗi Redis → fallback bộ nhớ. */
export async function rateLimit(key, opts) {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    try {
      return await redisLimit(`rl:${key}`, opts)
    } catch (err) {
      console.error('[rate-limit] Redis lỗi, dùng bộ nhớ tạm:', err.message)
    }
  }
  return memoryLimit(key, opts)
}

/**
 * Lấy IP client. KHÔNG tin x-forwarded-for do client tự gửi được;
 * ưu tiên header do proxy tin cậy (Vercel) đặt.
 */
export function clientIp(request) {
  return (
    request.ip ||
    request.headers.get('x-real-ip') ||
    request.headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('cf-connecting-ip') ||
    'unknown'
  )
}
