import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import requireAuth from '../middleware/auth.js'
import {
  listProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/projectController.js'
import { login } from '../controllers/authController.js'
import { submitContact, listMessages } from '../controllers/contactController.js'
import {
  listExperience,
  getExperience,
  createExperience,
  updateExperience,
  deleteExperience,
} from '../controllers/experienceController.js'

const router = Router()

// Chống spam form liên hệ & brute-force login
const contactLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5, standardHeaders: true })
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, standardHeaders: true })

// Public
router.get('/projects', listProjects)
router.get('/projects/:slug', getProject)
router.get('/experience', listExperience)
router.get('/experience/:slug', getExperience)
router.post('/contact', contactLimiter, submitContact)
router.post('/auth/login', loginLimiter, login)

// Admin (JWT)
router.post('/projects', requireAuth, createProject)
router.put('/projects/:id', requireAuth, updateProject)
router.delete('/projects/:id', requireAuth, deleteProject)
router.get('/messages', requireAuth, listMessages)
router.post('/experience', requireAuth, createExperience)
router.put('/experience/:id', requireAuth, updateExperience)
router.delete('/experience/:id', requireAuth, deleteExperience)

export default router
