// ============================================================
// THÔNG TIN CÁ NHÂN — sửa file này để thay toàn bộ nội dung chữ
// ============================================================

export const profile = {
  name: 'Đinh Châu Toàn',
  email: 'dinhtoan.dev@gmail.com',
  socials: {
    github: 'https://github.com/ToanDin',
    linkedin: 'https://www.linkedin.com/in/to%C3%A0n-%C4%91inh-9a083836a/',
    facebook: 'https://www.facebook.com/toan.inh.600263',
  },
}

// Nội dung theo ngôn ngữ — components tự chọn theo lang hiện tại
export const content = {
  vi: {
    role: 'Fullstack Developer',
    tagline: 'Tôi xây những sản phẩm web đẹp, nhanh và hữu ích.',
    about: [
      'Mình bắt đầu hành trình lập trình với web frontend, rồi dần mở rộng sang backend để có thể tự tay xây một sản phẩm hoàn chỉnh từ ý tưởng đến deploy.',
      'Dự án tâm đắc nhất của mình là VietFit — một PWA theo dõi calo và dinh dưỡng dành riêng cho người Việt, tích hợp AI để nhận diện món ăn.',
      'Ngoài code, mình thích tìm hiểu về product design và trải nghiệm người dùng — vì một sản phẩm tốt không chỉ chạy đúng mà còn phải dùng sướng.',
    ],
  },
  en: {
    role: 'Fullstack Developer',
    tagline: 'I build web products that are beautiful, fast and useful.',
    about: [
      'I started my programming journey with web frontend, then gradually expanded to backend so I could build a complete product on my own — from idea to deployment.',
      'The project I am most proud of is VietFit — a calorie & nutrition tracking PWA made for Vietnamese users, with AI-powered food recognition.',
      'Beyond code, I enjoy learning about product design and user experience — a good product should not only work correctly, it should feel great to use.',
    ],
  },
}

export const skills = [
  {
    key: 'frontend',
    items: ['React', 'Vite', 'TailwindCSS', 'Three.js / R3F', 'GSAP', 'HTML/CSS/JS'],
  },
  {
    key: 'backend',
    items: ['Node.js', 'Express', 'MongoDB', 'Firebase', 'REST API', 'JWT Auth'],
  },
  {
    key: 'tools',
    items: ['Git / GitHub', 'Vercel', 'Postman', 'Figma', 'Gemini AI API'],
  },
]

export const experience = [
  {
    company: 'NINA Trading & Services Co., Ltd.',
    slug: 'nina-trading-services',
    role: { vi: 'Thực tập sinh Business Analyst', en: 'Business Analyst Intern' },
    period: { vi: '06/2025 – 11/2025', en: 'Jun 2025 – Nov 2025' },
    bullets: {
      vi: [
        'Tư vấn giải pháp website cho 5+ doanh nghiệp nhỏ: phân tích yêu cầu khách hàng, đề xuất tính năng, bố cục giao diện, hosting và tên miền — chuyển đổi 3/8 buổi tư vấn thành hợp đồng ký kết.',
        'Hỗ trợ phát triển khách hàng: trao đổi với khách hàng tiềm năng và hiện hữu qua điện thoại, Zalo và họp online để thu thập yêu cầu, trình bày đề xuất — duy trì tỷ lệ phản hồi 80% cho các yêu cầu cập nhật tính năng, sửa lỗi.',
        'Rút ngắn thời gian bàn giao dự án trung bình từ 10 ngày xuống 5 ngày nhờ chuẩn bị báo giá, đề xuất cấu trúc site, phối hợp với đội thiết kế và đào tạo khách hàng sau bàn giao — giảm một nửa số yêu cầu hỗ trợ.',
        'Bàn giao thành công 3 website hoàn chỉnh (Cafe Ráp Kèo – F&B/Bất động sản, QMVMART – Thương mại điện tử, Lê Đình Group – Xây dựng) trong 8 tuần; khách hàng vận hành độc lập ngay sau bàn giao, kèm source code, tài liệu hướng dẫn và chính sách bảo hành.',
        'Chuẩn hóa quy trình đánh giá website từ tự phát sang báo cáo định lượng: tự học và triển khai đồng thời 3 công cụ audit chuyên nghiệp — OWASP ZAP (bảo mật), Google PageSpeed Insights (hiệu năng), Google Keyword Planner (SEO) — trong môi trường doanh nghiệp thực tế.',
      ],
      en: [
        'Consulted 5+ small businesses on website solutions by analyzing customer requirements and recommending features, UI layouts, hosting, and domain options — converting 3 of 8 consultations into signed contracts.',
        'Supported client acquisition by engaging prospective and existing clients across phone, Zalo, and online meetings to gather requirements and present proposals — maintaining an 80% response rate for feature updates and fixes.',
        'Shortened average project handoff from 10 days to 5 by preparing quotations, proposing site structures, coordinating with the design team, and running post-delivery client training — cutting support requests by half.',
        'Successfully delivered 3 complete websites (Cafe Ráp Kèo – F&B/Real Estate, QMVMART – E-commerce, Lê Đình Group – Construction) within 8 weeks; clients operated independently immediately post-handover, with source code, user documentation, and warranty policy included.',
        'Upgraded website assessment from ad-hoc reviews to fully quantified reporting by self-learning and deploying 3 professional audit tools simultaneously — OWASP ZAP (security), Google PageSpeed Insights (performance), Google Keyword Planner (SEO) — in a real enterprise environment.',
      ],
    },
  },
]
