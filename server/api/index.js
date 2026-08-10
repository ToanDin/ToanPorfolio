// Entry cho Vercel serverless — mọi request được rewrite về đây (xem vercel.json)
import 'dotenv/config'
import app from '../src/app.js'

export default app
