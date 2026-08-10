import Project from '../models/Project.js'

export async function listProjects(req, res) {
  const filter = {}
  if (req.query.featured === 'true') filter.featured = true
  const projects = await Project.find(filter).sort({ order: 1, createdAt: -1 })
  res.json(projects)
}

export async function getProject(req, res) {
  const project = await Project.findOne({ slug: req.params.slug })
  if (!project) return res.status(404).json({ message: 'Không tìm thấy dự án' })
  res.json(project)
}

export async function createProject(req, res) {
  try {
    const project = await Project.create(pickFields(req.body))
    res.status(201).json(project)
  } catch (err) {
    res.status(400).json({ message: friendlyError(err) })
  }
}

export async function updateProject(req, res) {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, pickFields(req.body), {
      new: true,
      runValidators: true,
    })
    if (!project) return res.status(404).json({ message: 'Không tìm thấy dự án' })
    res.json(project)
  } catch (err) {
    res.status(400).json({ message: friendlyError(err) })
  }
}

export async function deleteProject(req, res) {
  const project = await Project.findByIdAndDelete(req.params.id)
  if (!project) return res.status(404).json({ message: 'Không tìm thấy dự án' })
  res.json({ ok: true })
}

/** Chỉ nhận đúng các field cho phép — tránh client nhét field lạ vào DB */
function pickFields(body) {
  const allowed = [
    'title', 'slug', 'shortDesc', 'description', 'techStack',
    'thumbnail', 'images', 'liveUrl', 'repoUrl', 'featured', 'order',
  ]
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
