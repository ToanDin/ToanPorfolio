// Chạy 1 lần để nạp dữ liệu mẫu: npm run seed
import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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
    shortDesc: 'Chính trang web này — Next.js, React Three Fiber, GSAP scroll animation.',
    description:
      'Portfolio cá nhân với hiệu ứng 3D: nền galaxy particles phản ứng theo chuột, vật thể hero biến đổi theo scroll.\n' +
      'Fullstack Next.js (App Router): trang chi tiết server-render cho SEO, API Route Handlers + PostgreSQL (Prisma), trang admin riêng.',
    techStack: ['Next.js', 'React', 'Three.js', 'GSAP', 'PostgreSQL', 'Prisma'],
    featured: false,
    order: 2,
  },
]

const sampleExperience = [
  {
    company: 'NINA Trading & Services Co., Ltd.',
    slug: 'nina-trading-services',
    shortDescVi: '',
    shortDescEn: '',
    roleVi: 'Thực tập sinh Business Analyst',
    roleEn: 'Business Analyst Intern',
    periodVi: '06/2025 – 11/2025',
    periodEn: 'Jun 2025 – Nov 2025',
    bulletsVi: [
      'Tư vấn giải pháp website cho 5+ doanh nghiệp nhỏ: phân tích yêu cầu khách hàng, đề xuất tính năng, bố cục giao diện, hosting và tên miền — chuyển đổi 3/8 buổi tư vấn thành hợp đồng ký kết.',
      'Hỗ trợ phát triển khách hàng: trao đổi với khách hàng tiềm năng và hiện hữu qua điện thoại, Zalo và họp online để thu thập yêu cầu, trình bày đề xuất — duy trì tỷ lệ phản hồi 80% cho các yêu cầu cập nhật tính năng, sửa lỗi.',
      'Rút ngắn thời gian bàn giao dự án trung bình từ 10 ngày xuống 5 ngày nhờ chuẩn bị báo giá, đề xuất cấu trúc site, phối hợp với đội thiết kế và đào tạo khách hàng sau bàn giao — giảm một nửa số yêu cầu hỗ trợ.',
      'Bàn giao thành công 3 website hoàn chỉnh (Cafe Ráp Kèo – F&B/Bất động sản, QMVMART – Thương mại điện tử, Lê Đình Group – Xây dựng) trong 8 tuần; khách hàng vận hành độc lập ngay sau bàn giao, kèm source code, tài liệu hướng dẫn và chính sách bảo hành.',
      'Chuẩn hóa quy trình đánh giá website từ tự phát sang báo cáo định lượng: tự học và triển khai đồng thời 3 công cụ audit chuyên nghiệp — OWASP ZAP (bảo mật), Google PageSpeed Insights (hiệu năng), Google Keyword Planner (SEO) — trong môi trường doanh nghiệp thực tế.',
    ],
    bulletsEn: [
      'Consulted 5+ small businesses on website solutions by analyzing customer requirements and recommending features, UI layouts, hosting, and domain options — converting 3 of 8 consultations into signed contracts.',
      'Supported client acquisition by engaging prospective and existing clients across phone, Zalo, and online meetings to gather requirements and present proposals — maintaining an 80% response rate for feature updates and fixes.',
      'Shortened average project handoff from 10 days to 5 by preparing quotations, proposing site structures, coordinating with the design team, and running post-delivery client training — cutting support requests by half.',
      'Successfully delivered 3 complete websites (Cafe Ráp Kèo – F&B/Real Estate, QMVMART – E-commerce, Lê Đình Group – Construction) within 8 weeks; clients operated independently immediately post-handover, with source code, user documentation, and warranty policy included.',
      'Upgraded website assessment from ad-hoc reviews to fully quantified reporting by self-learning and deploying 3 professional audit tools simultaneously — OWASP ZAP (security), Google PageSpeed Insights (performance), Google Keyword Planner (SEO) — in a real enterprise environment.',
    ],
    order: 1,
  },
]

async function run() {
  for (const p of sample) {
    // upsert theo slug — chạy lại nhiều lần không tạo bản ghi trùng
    await prisma.project.upsert({ where: { slug: p.slug }, update: {}, create: p })
    console.log(`✓ ${p.title}`)
  }

  for (const e of sampleExperience) {
    const existing = await prisma.experience.findFirst({ where: { company: e.company } })
    if (existing) {
      await prisma.experience.update({ where: { id: existing.id }, data: { slug: e.slug } })
    } else {
      await prisma.experience.create({ data: e })
    }
    console.log(`✓ ${e.company}`)
  }

  console.log('Seed xong!')
}

run()
  .catch((err) => {
    console.error(err)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
