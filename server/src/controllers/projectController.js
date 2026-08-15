import { prisma } from '../config/db.js'
import { str, strArray, bool, int, slug, isUuid, friendlyError } from '../utils/validate.js'

const ORDER_BY = [{ order: 'asc' }, { createdAt: 'desc' }]

export async function listProjects(req, res) {
  const where = req.query.featured === 'true' ? { featured: true } : {}
  const projects = await prisma.project.findMany({ where, orderBy: ORDER_BY })
  res.json(projects)
}

export async function getProject(req, res) {
  const project = await prisma.project.findUnique({ where: { slug: req.params.slug } })
  if (!project) return res.status(404).json({ message: 'Không tìm thấy dự án' })
  res.json(project)
}

export async function createProject(req, res) {
  try {
    const project = await prisma.project.create({ data: pickFields(req.body, { create: true }) })
    res.status(201).json(project)
  } catch (err) {
    res.status(400).json({ message: friendlyError(err) })
  }
}

export async function updateProject(req, res) {
  if (!isUuid(req.params.id)) return res.status(404).json({ message: 'Không tìm thấy dự án' })
  try {
    const project = await prisma.project.update({
      where: { id: req.params.id },
      data: pickFields(req.body, { create: false }),
    })
    res.json(project)
  } catch (err) {
    if (err?.code === 'P2025') return res.status(404).json({ message: 'Không tìm thấy dự án' })
    res.status(400).json({ message: friendlyError(err) })
  }
}

export async function deleteProject(req, res) {
  if (!isUuid(req.params.id)) return res.status(404).json({ message: 'Không tìm thấy dự án' })
  try {
    await prisma.project.delete({ where: { id: req.params.id } })
    res.json({ ok: true })
  } catch (err) {
    if (err?.code === 'P2025') return res.status(404).json({ message: 'Không tìm thấy dự án' })
    res.status(400).json({ message: friendlyError(err) })
  }
}

/**
 * Chỉ nhận đúng các field cho phép — tránh client nhét field lạ vào DB.
 * create = true: áp dụng ràng buộc bắt buộc (title/slug/shortDesc).
 * create = false: chỉ map những field client thực sự gửi lên (partial update).
 */
function pickFields(body = {}, { create }) {
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
  if (create || has('thumbnail')) out.thumbnail = str(body.thumbnail, { field: 'thumbnail', max: 1000 })
  if (create || has('images')) out.images = strArray(body.images, { field: 'images' })
  if (create || has('liveUrl')) out.liveUrl = str(body.liveUrl, { field: 'liveUrl', max: 1000 })
  if (create || has('repoUrl')) out.repoUrl = str(body.repoUrl, { field: 'repoUrl', max: 1000 })
  if (create || has('featured')) out.featured = bool(body.featured)
  if (create || has('order')) out.order = int(body.order, { field: 'order' })

  return out
}
