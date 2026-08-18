/**
 * URL công khai của site — dùng cho metadataBase, sitemap, robots, canonical.
 * Đặt NEXT_PUBLIC_SITE_URL trong env (vd https://toandinh.dev). Trên Vercel nếu chưa
 * đặt sẽ tự lấy VERCEL_PROJECT_PRODUCTION_URL / VERCEL_URL.
 */
function resolveSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL
  if (explicit) return explicit.replace(/\/+$/, '')
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL
  if (vercel) return `https://${vercel}`
  return 'http://localhost:3000'
}

export const SITE_URL = resolveSiteUrl()
