/**
 * Chuyển object dạng cũ (Mongo: shortDesc/role/period/bullets lồng { vi, en })
 * thành hàng phẳng của bảng experiences. Dùng cho seed và script migrate.
 */
export function toExperienceRow(doc = {}) {
  const pair = (v) => (v && typeof v === 'object' ? v : {})
  const s = pair(doc.shortDesc)
  const r = pair(doc.role)
  const p = pair(doc.period)
  const b = pair(doc.bullets)

  return {
    company: doc.company ?? '',
    slug: doc.slug || null,
    shortDescVi: s.vi ?? '',
    shortDescEn: s.en ?? '',
    roleVi: r.vi ?? '',
    roleEn: r.en ?? '',
    periodVi: p.vi ?? '',
    periodEn: p.en ?? '',
    bulletsVi: Array.isArray(b.vi) ? b.vi : [],
    bulletsEn: Array.isArray(b.en) ? b.en : [],
    order: Number.isFinite(Number(doc.order)) ? Math.trunc(Number(doc.order)) : 0,
  }
}

/**
 * Gộp các cột phẳng *_vi / *_en của bảng experiences thành object { vi, en }
 * để giữ nguyên hợp đồng API mà frontend (lib/i18n) đang dùng.
 */
export function serializeExperience(row) {
  if (!row) return row
  const {
    shortDescVi, shortDescEn,
    roleVi, roleEn,
    periodVi, periodEn,
    bulletsVi, bulletsEn,
    ...rest
  } = row

  return {
    ...rest,
    shortDesc: { vi: shortDescVi, en: shortDescEn },
    role: { vi: roleVi, en: roleEn },
    period: { vi: periodVi, en: periodEn },
    bullets: { vi: bulletsVi, en: bulletsEn },
  }
}
