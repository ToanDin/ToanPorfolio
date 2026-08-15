import { prisma } from '@/lib/server/prisma.js'
import { fallbackProjects } from '@/data/fallback.js'
import ProjectDetailView from '@/components/detail/ProjectDetailView.jsx'

export const dynamic = 'force-dynamic'

/** Đọc project từ DB ngay trên server; DB lỗi/chưa seed thì rơi về dữ liệu mẫu */
async function getProject(slug) {
  try {
    const project = await prisma.project.findUnique({ where: { slug } })
    if (project) return project
  } catch (err) {
    console.error('Lỗi đọc DB:', err.message)
  }
  return fallbackProjects.find((p) => p.slug === slug) ?? null
}

/** SEO: title/description/OG riêng cho từng dự án — lợi ích chính của SSR */
export async function generateMetadata({ params }) {
  const project = await getProject(params.slug)
  if (!project) return { title: 'Không tìm thấy dự án' }
  return {
    title: `${project.title} | TOAN DINH`,
    description: project.shortDesc,
    openGraph: {
      title: project.title,
      description: project.shortDesc,
      type: 'article',
      ...(project.thumbnail ? { images: [project.thumbnail] } : {}),
    },
  }
}

export default async function ProjectDetailPage({ params }) {
  const project = await getProject(params.slug)
  return <ProjectDetailView project={project} />
}
