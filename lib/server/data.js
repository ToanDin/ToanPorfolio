import { cache } from 'react'
import { prisma } from './prisma.js'
import { serializeExperience } from './serialize.js'
import { isUuid } from './validate.js'
import { fallbackProjects } from '@/data/fallback.js'
import { experience as fallbackExperience } from '@/data/profile.js'

/**
 * Hàm đọc dữ liệu dùng chung cho Server Components.
 * - Bọc trong React `cache()` → generateMetadata + page dùng chung 1 query/request.
 * - DB lỗi/chưa seed → rơi về dữ liệu mẫu để trang vẫn có nội dung (có log để biết).
 * - Trả về object thuần (Date → ISO string) để truyền xuống Client Component.
 */
const ORDER_BY = [{ order: 'asc' }, { createdAt: 'desc' }]

const plain = (row) => JSON.parse(JSON.stringify(row))

function logDbError(where, err) {
  console.error(`[data] ${where}: lỗi đọc DB (dùng dữ liệu dự phòng) —`, err?.message)
}

export const getProjects = cache(async () => {
  try {
    const rows = await prisma.project.findMany({ orderBy: ORDER_BY })
    return rows.length ? plain(rows) : fallbackProjects
  } catch (err) {
    logDbError('getProjects', err)
    return fallbackProjects
  }
})

export const getProject = cache(async (slug) => {
  try {
    const row = await prisma.project.findUnique({ where: { slug } })
    if (row) return plain(row)
  } catch (err) {
    logDbError('getProject', err)
  }
  return fallbackProjects.find((p) => p.slug === slug) ?? null
})

export const getExperienceList = cache(async () => {
  try {
    const rows = await prisma.experience.findMany({ orderBy: ORDER_BY })
    return rows.length ? plain(rows.map(serializeExperience)) : fallbackExperience
  } catch (err) {
    logDbError('getExperienceList', err)
    return fallbackExperience
  }
})

export const getExperienceItem = cache(async (key) => {
  try {
    let row = await prisma.experience.findUnique({ where: { slug: key } })
    if (!row && isUuid(key)) row = await prisma.experience.findUnique({ where: { id: key } })
    if (row) return plain(serializeExperience(row))
  } catch (err) {
    logDbError('getExperienceItem', err)
  }
  return fallbackExperience.find((e) => e.slug === key) ?? null
})
