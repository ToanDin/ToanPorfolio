/**
 * Rate limit in-memory (như express-rate-limit trước đây): giới hạn theo
 * IP trong một cửa sổ thời gian. Trên serverless, bộ đếm nằm trong từng
 * function instance — đủ để chặn spam thô, giống hệt hành vi bản Express cũ.
 */
const buckets = new Map()

export function rateLimit(key, { windowMs, max }) {
  const now = Date.now()
  const entry = buckets.get(key)

  if (!entry || now > entry.reset) {
    buckets.set(key, { count: 1, reset: now + windowMs })
    return true
  }

  entry.count += 1
  // Dọn rác thi thoảng để Map không phình vô hạn
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) if (now > v.reset) buckets.delete(k)
  }
  return entry.count <= max
}

/** Lấy IP client sau proxy của Vercel */
export function clientIp(request) {
  const fwd = request.headers.get('x-forwarded-for')
  return fwd ? fwd.split(',')[0].trim() : 'unknown'
}
