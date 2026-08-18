import { revalidatePath } from 'next/cache'

/**
 * Sau khi admin thêm/sửa/xoá, làm mới cache ISR của trang chủ và trang chi tiết
 * liên quan để thay đổi hiện ngay (thay vì đợi hết `revalidate`).
 */
export function revalidateContent(projectSlug, experienceKey) {
  try {
    revalidatePath('/')
    revalidatePath('/sitemap.xml')
    if (projectSlug) revalidatePath(`/projects/${projectSlug}`)
    if (experienceKey) revalidatePath(`/experience/${experienceKey}`)
  } catch (err) {
    console.error('[revalidate]', err.message)
  }
}
