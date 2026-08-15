import { prisma } from '../config/db.js'
import { serializeExperience } from '../utils/serialize.js'
import { str, strArray, int, slug, isUuid, friendlyError } from '../utils/validate.js'

const ORDER_BY = [{ order: 'asc' }, { createdAt: 'desc' }]

export async function listExperience(req, res) {
  const items = await prisma.experience.findMany({ orderBy: ORDER_BY })
  res.json(items.map(serializeExperience))
}

export async function getExperience(req, res) {
  const { slug: key } = req.params
  let item = await prisma.experience.findUnique({ where: { slug: key } })
  // Bản ghi cũ có thể chưa có slug — thử tìm theo id
  if (!item && isUuid(key)) {
    item = await prisma.experience.findUnique({ where: { id: key } })
  }
  if (!item) return res.status(404).json({ message: 'Không tìm thấy kinh nghiệm' })
  res.json(serializeExperience(item))
}

export async function createExperience(req, res) {
  try {
    const item = await prisma.experience.create({ data: pickFields(req.body, { create: true }) })
    res.status(201).json(serializeExperience(item))
  } catch (err) {
    res.status(400).json({ message: friendlyError(err) })
  }
}

export async function updateExperience(req, res) {
  if (!isUuid(req.params.id)) return res.status(404).json({ message: 'Không tìm thấy kinh nghiệm' })
  try {
    const item = await prisma.experience.update({
      where: { id: req.params.id },
      data: pickFields(req.body, { create: false }),
    })
    res.json(serializeExperience(item))
  } catch (err) {
    if (err?.code === 'P2025') return res.status(404).json({ message: 'Không tìm thấy kinh nghiệm' })
    res.status(400).json({ message: friendlyError(err) })
  }
}

export async function deleteExperience(req, res) {
  if (!isUuid(req.params.id)) return res.status(404).json({ message: 'Không tìm thấy kinh nghiệm' })
  try {
    await prisma.experience.delete({ where: { id: req.params.id } })
    res.json({ ok: true })
  } catch (err) {
    if (err?.code === 'P2025') return res.status(404).json({ message: 'Không tìm thấy kinh nghiệm' })
    res.status(400).json({ message: friendlyError(err) })
  }
}

/** Chỉ nhận đúng các field cho phép; tách object { vi, en } thành cột phẳng */
function pickFields(body = {}, { create }) {
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
