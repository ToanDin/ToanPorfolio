// Entry khi chạy local: npm run dev
import 'dotenv/config'
import app from './src/app.js'

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`✅ API đang chạy tại http://localhost:${PORT}`)
})
