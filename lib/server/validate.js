/**
 * Lớp validate thay cho Mongoose validators (Prisma không validate ở tầng ứng dụng).
 * Ném ValidationError để controller bắt và trả 400 kèm thông báo tiếng Việt.
 */
export class ValidationError extends Error {
  constructor(messages) {
    super(Array.isArray(messages) ? messages.join('; ') : messages)
    this.name = 'ValidationError'
    this.messages = Array.isArray(messages) ? messages : [messages]
  }
}

export const SLUG_RE = /^[a-z0-9-]+$/

/** Chuỗi bắt buộc, tự trim, giới hạn độ dài */
export function str(value, { field, required = false, max, fallback = '' }) {
  if (value === undefined || value === null) {
    if (required) throw new ValidationError(`Thiếu trường "${field}"`)
    return fallback
  }
  if (typeof value !== 'string') throw new ValidationError(`"${field}" phải là chuỗi`)
  const out = value.trim()
  if (required && !out) throw new ValidationError(`"${field}" không được để trống`)
  if (max && out.length > max) {
    throw new ValidationError(`"${field}" tối đa ${max} ký tự (đang ${out.length})`)
  }
  return out
}

/** Mảng chuỗi, loại bỏ phần tử rỗng */
export function strArray(value, { field, fallback = [] }) {
  if (value === undefined || value === null) return fallback
  if (!Array.isArray(value)) throw new ValidationError(`"${field}" phải là mảng`)
  return value
    .map((v) => (typeof v === 'string' ? v.trim() : String(v ?? '').trim()))
    .filter(Boolean)
}

export function bool(value, { fallback = false } = {}) {
  if (value === undefined || value === null) return fallback
  return value === true || value === 'true'
}

export function int(value, { field, fallback = 0 }) {
  if (value === undefined || value === null || value === '') return fallback
  const n = Number(value)
  if (!Number.isFinite(n)) throw new ValidationError(`"${field}" phải là số`)
  return Math.trunc(n)
}

export function slug(value, { field = 'slug', required = false, allowEmpty = false }) {
  const out = str(value, { field, required, max: 200 })
  if (!out) return allowEmpty ? null : out
  if (!SLUG_RE.test(out)) {
    throw new ValidationError(`"${field}" chỉ được chứa chữ thường, số và dấu gạch ngang`)
  }
  return out
}

/** URL http(s) hợp lệ (chặn javascript:, data: ...) — rỗng cho phép */
export function url(value, { field, max = 1000 }) {
  const out = str(value, { field, max })
  if (!out) return ''
  // Cho phép đường dẫn nội bộ trong /public (vd: /projects/vietfit.webp)
  if (/^\/(?!\/)[^\s]*$/.test(out)) return out
  try {
    const u = new URL(out)
    if (u.protocol !== 'http:' && u.protocol !== 'https:') throw new Error()
  } catch {
    throw new ValidationError(`"${field}" phải là URL http(s) hợp lệ`)
  }
  return out
}

/** Mảng URL http(s) */
export function urlArray(value, { field }) {
  return strArray(value, { field }).map((v, i) => url(v, { field: `${field}[${i}]` }))
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
export const isUuid = (v) => typeof v === 'string' && UUID_RE.test(v)

/** Chuyển lỗi Prisma / ValidationError thành thông báo thân thiện */
export function friendlyError(err) {
  if (err instanceof ValidationError) return err.message
  if (err?.code === 'P2002') return 'Slug đã tồn tại — chọn slug khác.'
  if (err?.code === 'P2025') return 'Không tìm thấy bản ghi.'
  if (err?.code === 'P2023' || err?.code === 'P2000') return 'Dữ liệu không hợp lệ.'
  return 'Dữ liệu không hợp lệ.'
}
