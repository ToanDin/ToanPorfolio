import express from 'express'
import cors from 'cors'
import connectDB from './config/db.js'
import routes from './routes/index.js'

const app = express()

// Vercel/proxy đứng trước — cần cho express-rate-limit đọc đúng IP
app.set('trust proxy', 1)

// CORS: dev cho phép tất cả; production chỉ cho phép CLIENT_ORIGIN
const origins = (process.env.CLIENT_ORIGIN ?? '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)
app.use(cors({ origin: origins.length ? origins : true }))

app.use(express.json({ limit: '1mb' }))

// Đảm bảo DB đã kết nối trước khi vào route (serverless-friendly)
app.use(async (req, res, next) => {
  try {
    await connectDB()
    next()
  } catch (err) {
    console.error('Lỗi kết nối PostgreSQL:', err.message)
    res.status(500).json({ message: 'Không kết nối được database' })
  }
})

app.get('/', (req, res) => res.json({ ok: true, name: 'portfolio-api' }))
app.use('/api', routes)

// 404 + error handler
app.use((req, res) => res.status(404).json({ message: 'Không tìm thấy endpoint' }))
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ message: 'Lỗi server' })
})

export default app
