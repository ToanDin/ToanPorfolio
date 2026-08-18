import { notFound } from 'next/navigation'
import { getProject, getProjects } from '@/lib/server/data.js'
import ProjectDetailView from '@/components/detail/ProjectDetailView.jsx'

// ISR: render sẵn, làm mới mỗi 60s hoặc khi admin sửa (revalidatePath).
export const revalidate = 60
export const dynamicParams = true

/** Pre-render các slug đang có lúc build (DB lỗi → mảng rỗng, render on-demand) */
export async function generateStaticParams() {
  const projects = await getProjects()
  return projects.filter((p) => p.slug).map((p) => ({ slug: p.slug }))
}

/** SEO: title/description/OG riêng cho từng dự án — getProject được cache() nên chỉ query 1 lần */
export async function generateMetadata({ params }) {
  const project = await getProject(params.slug)
  if (!project) return { title: 'Không tìm thấy dự án', robots: { index: false } }
  return {
    title: `${project.title} | TOAN DINH`,
    description: project.shortDesc,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title: project.title,
      description: project.shortDesc,
      type: 'article',
      url: `/projects/${project.slug}`,
      ...(project.thumbnail ? { images: [project.thumbnail] } : {}),
    },
  }
}

export default async function ProjectDetailPage({ params }) {
  const project = await getProject(params.slug)
  if (!project) notFound() // HTTP 404 thật — không để Google index slug không tồn tại
  return <ProjectDetailView project={project} />
}
