// Chạy 1 lần để nạp dữ liệu mẫu: npm run seed
import 'dotenv/config'
import mongoose from 'mongoose'
import connectDB from './config/db.js'
import Project from './models/Project.js'

const sample = [
  {
    title: 'VietFit',
    slug: 'vietfit',
    shortDesc: 'PWA theo dõi calo & dinh dưỡng cho người Việt, tích hợp AI nhận diện món ăn.',
    description:
      'VietFit giúp người Việt theo dõi calo và dinh dưỡng hằng ngày với cơ sở dữ liệu món ăn Việt Nam.\n' +
      'Ứng dụng tích hợp Gemini AI để nhận diện món ăn, đăng nhập bằng Firebase Auth và đồng bộ dữ liệu qua Firestore.\n' +
      'Backend Node.js/Express đóng vai trò proxy bảo mật cho Gemini API, deploy trên Vercel.',
    techStack: ['React', 'Vite', 'TailwindCSS', 'Firebase', 'Node.js', 'Express', 'Gemini AI'],
    liveUrl: 'https://viet-fit-bjsn.vercel.app',
    featured: true,
    order: 1,
  },
  {
    title: 'Portfolio 3D',
    slug: 'portfolio-3d',
    shortDesc: 'Chính trang web này — React Three Fiber, GSAP scroll animation, backend Node.js.',
    description:
      'Portfolio cá nhân với hiệu ứng 3D: nền galaxy particles phản ứng theo chuột, vật thể hero biến đổi theo scroll.\n' +
      'Dữ liệu dự án quản lý qua REST API Node.js + MongoDB với trang admin riêng.',
    techStack: ['React', 'Three.js', 'GSAP', 'Node.js', 'Express', 'MongoDB'],
    featured: false,
    order: 2,
  },
]

async function run() {
  await connectDB()
  for (const p of sample) {
    await Project.updateOne({ slug: p.slug }, { $setOnInsert: p }, { upsert: true })
    console.log(`✓ ${p.title}`)
  }
  await mongoose.disconnect()
  console.log('Seed xong!')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
