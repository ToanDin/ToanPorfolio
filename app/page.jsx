import HomeClient from '@/components/HomeClient.jsx'
import { getProjects, getExperienceList } from '@/lib/server/data.js'

// ISR: trang chủ được render sẵn trên server (SEO: dự án/kinh nghiệm có trong HTML),
// làm mới mỗi 60s hoặc ngay khi admin sửa (revalidatePath trong API).
export const revalidate = 60

export default async function Home() {
  const [projects, experience] = await Promise.all([getProjects(), getExperienceList()])
  return <HomeClient projects={projects} experience={experience} />
}
