import { notFound } from 'next/navigation'
import { getExperienceItem, getExperienceList } from '@/lib/server/data.js'
import ExperienceDetailView from '@/components/detail/ExperienceDetailView.jsx'
import { pick } from '@/lib/bilingual.js'

export const revalidate = 60
export const dynamicParams = true

export async function generateStaticParams() {
  const items = await getExperienceList()
  return items.map((e) => ({ slug: e.slug || e.id })).filter((p) => p.slug)
}

export async function generateMetadata({ params }) {
  const item = await getExperienceItem(params.slug)
  if (!item) return { title: 'Không tìm thấy kinh nghiệm', robots: { index: false } }
  const role = pick(item.role, 'vi')
  const path = `/experience/${item.slug || item.id}`
  return {
    title: `${item.company} | TOAN DINH`,
    description: `${role} — ${pick(item.period, 'vi')}`,
    alternates: { canonical: path },
    openGraph: { title: item.company, description: role, type: 'article', url: path },
  }
}

export default async function ExperienceDetailPage({ params }) {
  const item = await getExperienceItem(params.slug)
  if (!item) notFound()
  return <ExperienceDetailView item={item} />
}
