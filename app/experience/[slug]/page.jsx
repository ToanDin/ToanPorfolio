import { prisma } from '@/lib/server/prisma.js'
import { serializeExperience } from '@/lib/server/serialize.js'
import { isUuid } from '@/lib/server/validate.js'
import { experience as fallbackExperience } from '@/data/profile.js'
import ExperienceDetailView from '@/components/detail/ExperienceDetailView.jsx'
import { pick } from '@/lib/bilingual.js'

export const dynamic = 'force-dynamic'

/** Đọc experience từ DB trên server (theo slug, fallback theo id) */
async function getItem(key) {
  try {
    let item = await prisma.experience.findUnique({ where: { slug: key } })
    if (!item && isUuid(key)) {
      item = await prisma.experience.findUnique({ where: { id: key } })
    }
    if (item) return serializeExperience(item)
  } catch (err) {
    console.error('Lỗi đọc DB:', err.message)
  }
  return fallbackExperience.find((e) => e.slug === key) ?? null
}

export async function generateMetadata({ params }) {
  const item = await getItem(params.slug)
  if (!item) return { title: 'Không tìm thấy kinh nghiệm' }
  const role = pick(item.role, 'vi')
  return {
    title: `${item.company} | TOAN DINH`,
    description: `${role} — ${pick(item.period, 'vi')}`,
    openGraph: { title: item.company, description: role, type: 'article' },
  }
}

export default async function ExperienceDetailPage({ params }) {
  const item = await getItem(params.slug)
  return <ExperienceDetailView item={item} />
}
