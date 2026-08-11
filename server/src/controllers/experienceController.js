import mongoose from 'mongoose'
import Experience from '../models/Experience.js'

export async function listExperience(req, res) {
  const items = await Experience.find().sort({ order: 1, createdAt: -1 })
  res.json(items)
}

export async function getExperience(req, res) {
  const { slug } = req.params
  let item = await Experience.findOne({ slug })
  // Dữ liệu cũ có thể chưa có slug — thử tìm theo _id
  if (!item && mongoose.isValidObjectId(slug)) {
    item = await Experience.findById(slug)
  }
  if (!item) return res.status(404).json({ message: 'Không tìm thấy kinh nghiệm' })
  res.json(item)
}

export async function createExperience(req, res) {
  try {
    const item = await Experience.create(pickFields(req.body))
    res.status(201).json(item)
  } catch (err) {
    res.status(400).json({ message: friendlyError(err) })
  }
}

export async function updateExperience(req, res) {
  try {
    const item = await Experience.findByIdAndUpdate(req.params.id, pickFields(req.body), {
      new: true,
      runValidators: true,
    })
    if (!item) return res.status(404).json({ message: 'Không tìm thấy kinh nghiệm' })
    res.json(item)
  } catch (err) {
    res.status(400).json({ message: friendlyError(err) })
  }
}

export async function deleteExperience(req, res) {
  const item = await Experience.findByIdAndDelete(req.params.id)
  if (!item) return res.status(404).json({ message: 'Không tìm thấy kinh nghiệm' })
  res.json({ ok: true })
}

/** Chỉ nhận đúng các field cho phép */
function pickFields(body) {
  const allowed = ['company', 'slug', 'shortDesc', 'role', 'period', 'bullets', 'order']
  const out = {}
  for (const key of allowed) {
    if (body[key] !== undefined) out[key] = body[key]
  }
  return out
}

function friendlyError(err) {
  if (err?.code === 11000) return 'Slug đã tồn tại — chọn slug khác.'
  if (err?.name === 'ValidationError') {
    return Object.values(err.errors).map((e) => e.message).join('; ')
  }
  return 'Dữ liệu không hợp lệ.'
}
