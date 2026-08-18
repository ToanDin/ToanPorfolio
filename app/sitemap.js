import { SITE_URL } from '@/lib/site.js'
import { getProjects, getExperienceList } from '@/lib/server/data.js'

export const revalidate = 3600

export default async function sitemap() {
  const [projects, experience] = await Promise.all([getProjects(), getExperienceList()])
  const now = new Date()

  return [
    { url: SITE_URL, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    ...projects
      .filter((p) => p.slug)
      .map((p) => ({
        url: `${SITE_URL}/projects/${p.slug}`,
        lastModified: p.updatedAt ? new Date(p.updatedAt) : now,
        changeFrequency: 'monthly',
        priority: 0.8,
      })),
    ...experience
      .filter((e) => e.slug || e.id)
      .map((e) => ({
        url: `${SITE_URL}/experience/${e.slug || e.id}`,
        lastModified: e.updatedAt ? new Date(e.updatedAt) : now,
        changeFrequency: 'monthly',
        priority: 0.6,
      })),
  ]
}
