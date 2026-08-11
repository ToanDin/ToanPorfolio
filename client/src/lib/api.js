import axios from 'axios'

// Production: VITE_API_URL = https://<backend>.vercel.app
// Dev local: để trống — Vite proxy /api sang localhost:5000
const BASE = import.meta.env.VITE_API_URL || ''

export const api = axios.create({
  baseURL: `${BASE}/api`,
  timeout: 15000,
})

// Tự gắn JWT (nếu có) cho các request admin
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ---- Public ----
export const fetchProjects = () => api.get('/projects').then((r) => r.data)
export const fetchProject = (slug) => api.get(`/projects/${slug}`).then((r) => r.data)
export const sendContact = (payload) => api.post('/contact', payload).then((r) => r.data)

// ---- Admin ----
export const adminLogin = (payload) => api.post('/auth/login', payload).then((r) => r.data)
export const createProject = (payload) => api.post('/projects', payload).then((r) => r.data)
export const updateProject = (id, payload) => api.put(`/projects/${id}`, payload).then((r) => r.data)
export const deleteProject = (id) => api.delete(`/projects/${id}`).then((r) => r.data)
export const fetchMessages = () => api.get('/messages').then((r) => r.data)

// ---- Experience ----
export const fetchExperience = () => api.get('/experience').then((r) => r.data)
export const fetchExperienceItem = (slug) => api.get(`/experience/${slug}`).then((r) => r.data)
export const createExperience = (payload) => api.post('/experience', payload).then((r) => r.data)
export const updateExperience = (id, payload) => api.put(`/experience/${id}`, payload).then((r) => r.data)
export const deleteExperience = (id) => api.delete(`/experience/${id}`).then((r) => r.data)
