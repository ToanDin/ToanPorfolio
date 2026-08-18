import axios from 'axios'

// API cùng origin với frontend (Route Handlers của Next).
// Phiên admin nằm trong cookie httpOnly — trình duyệt tự gửi kèm, JS không đọc được.
export const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
})

// ---- Public ----
export const fetchProjects = () => api.get('/projects').then((r) => r.data)
export const fetchProject = (slug) => api.get(`/projects/${slug}`).then((r) => r.data)
export const sendContact = (payload) => api.post('/contact', payload).then((r) => r.data)

// ---- Auth ----
export const adminLogin = (payload) => api.post('/auth/login', payload).then((r) => r.data)
export const adminLogout = () => api.post('/auth/logout').then((r) => r.data)
export const adminMe = () => api.get('/auth/me').then((r) => r.data)

// ---- Projects (admin) ----
export const createProject = (payload) => api.post('/projects', payload).then((r) => r.data)
export const updateProject = (id, payload) => api.put(`/projects/${id}`, payload).then((r) => r.data)
export const deleteProject = (id) => api.delete(`/projects/${id}`).then((r) => r.data)

// ---- Messages (admin) ----
export const fetchMessages = (params) => api.get('/messages', { params }).then((r) => r.data)
export const markMessageRead = (id, read = true) => api.patch(`/messages/${id}`, { read }).then((r) => r.data)
export const deleteMessage = (id) => api.delete(`/messages/${id}`).then((r) => r.data)

// ---- Experience ----
export const fetchExperience = () => api.get('/experience').then((r) => r.data)
export const fetchExperienceItem = (slug) => api.get(`/experience/${slug}`).then((r) => r.data)
export const createExperience = (payload) => api.post('/experience', payload).then((r) => r.data)
export const updateExperience = (id, payload) => api.put(`/experience/${id}`, payload).then((r) => r.data)
export const deleteExperience = (id) => api.delete(`/experience/${id}`).then((r) => r.data)
