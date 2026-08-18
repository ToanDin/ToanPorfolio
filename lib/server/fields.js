import { str, strArray, bool, int, slug, url, urlArray } from './validate.js'

/**
 * Chỉ nhận đúng các field cho phép — tránh client nhét field lạ vào DB.
 * create = true: áp ràng buộc bắt buộc; create = false: partial update.
 * (Chuyển nguyên từ projectController/experienceController của bản Express.)
 */
export function pickProjectFields(body = {}, { create }) {
  const has = (k) => body[k] !== undefined
  const out = {}

  if (create || has('title')) {
    out.title = str(body.title, { field: 'title', required: true, max: 200 })
  }
  if (create || has('slug')) {
    out.slug = slug(body.slug, { field: 'slug', required: true })
  }
  if (create || has('shortDesc')) {
    out.shortDesc = str(body.shortDesc, { field: 'shortDesc', required: true, max: 300 })
  }
  if (create || has('description')) {
    out.description = str(body.description, { field: 'description', max: 10000 })
  }
  if (create || has('techStack')) out.techStack = strArray(body.techStack, { field: 'techStack' })
  if (create || has('thumbnail')) out.thumbnail = url(body.thumbnail, { field: 'thumbnail' })
  if (create || has('images')) out.images = urlArray(body.images, { field: 'images' })
  if (create || has('liveUrl')) out.liveUrl = url(body.liveUrl, { field: 'liveUrl' })
  if (create || has('repoUrl')) out.repoUrl = url(body.repoUrl, { field: 'repoUrl' })
  if (create || has('featured')) out.featured = bool(body.featured)
  if (create || has('order')) out.order = int(body.order, { field: 'order' })

  return out
}

/** Tách object { vi, en } thành cột phẳng của bảng experiences */
export function pickExperienceFields(body = {}, { create }) {
  const has = (k) => body[k] !== undefined
  const out = {}

  if (create || has('company')) {
    out.company = str(body.company, { field: 'company', required: true, max: 200 })
  }
  if (create || has('slug')) {
    out.slug = slug(body.slug, { field: 'slug', allowEmpty: true })
  }
  if (create || has('shortDesc')) {
    const v = body.shortDesc ?? {}
    out.shortDescVi = str(v.vi, { field: 'shortDesc.vi', max: 300 })
    out.shortDescEn = str(v.en, { field: 'shortDesc.en', max: 300 })
  }
  if (create || has('role')) {
    const v = body.role ?? {}
    out.roleVi = str(v.vi, { field: 'role.vi', required: true, max: 200 })
    out.roleEn = str(v.en, { field: 'role.en', max: 200 })
  }
  if (create || has('period')) {
    const v = body.period ?? {}
    out.periodVi = str(v.vi, { field: 'period.vi', required: true, max: 100 })
    out.periodEn = str(v.en, { field: 'period.en', max: 100 })
  }
  if (create || has('bullets')) {
    const v = body.bullets ?? {}
    out.bulletsVi = strArray(v.vi, { field: 'bullets.vi' })
    out.bulletsEn = strArray(v.en, { field: 'bullets.en' })
  }
  if (create || has('order')) out.order = int(body.order, { field: 'order' })

  return out
}
