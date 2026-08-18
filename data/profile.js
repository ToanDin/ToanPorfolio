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
     "Chào bạn, mình là Toàn — một kỹ sư phần mềm đến từ TP.HCM, tốt nghiệp ngành Kỹ thuật Phần mềm tại Đại học Thủ Dầu Một. Mình chuyên phát triển các ứng dụng web full-stack sử dụng React, Next.js, Node.js và PostgreSQL.",
"Điều cuốn hút mình ở công việc này chính là toàn bộ hành trình tạo ra một sản phẩm: từ việc thấu hiểu nhu cầu thực tế của người dùng, thiết kế giao diện tinh tế, cho đến việc tối ưu hóa để sản phẩm vận hành nhanh chóng, ổn định và tạo được niềm tin nơi người dùng.",
"Mình đặc biệt quan tâm đến hiệu năng và trải nghiệm người dùng — chú trọng vào những chi tiết nhỏ như phản hồi tức thì hay các tương tác mượt mà để mang lại cảm giác dễ chịu khi sử dụng phần mềm. Trước khi chuyển sang làm lập trình viên toàn thời gian, mình từng là Thực tập sinh Phân tích Nghiệp vụ (Business Analyst), tư vấn giải pháp website cho các doanh nghiệp nhỏ và trực tiếp triển khai trọn gói ba dự án trong số đó. Kinh nghiệm này đã rèn luyện cho mình kỹ năng lắng nghe kỹ lưỡng, giao tiếp rõ ràng và tư duy về khía cạnh kinh doanh đằng sau những dòng code — những kỹ năng mà mình vẫn luôn áp dụng mỗi ngày trong công việc hiện tại.",
"Hiện tại, mình đang là Thực tập sinh Kỹ sư Phần mềm tại MarketDash. Ngoài giờ làm việc, mình thường phát triển các dự án cá nhân để thử nghiệm những ý tưởng mới liên quan đến AI, tối ưu hiệu năng và thiết kế giao diện đẹp mắt. Mình luôn sẵn sàng đón nhận những thử thách mới và kết nối với những người thú vị — đừng ngần ngại liên hệ với mình nhé."
    ],
  },
  en: {
    role: 'Fullstack Developer',
    tagline: 'I build web products that are beautiful, fast and useful.',
    about: [
      "Hi, Im Toàn — a software engineer from Ho Chi Minh City with a Bachelor's degree in Software Engineering from Thu Dau Mot Universityy.I build full-stack web applications with React, Next.js, Node.js, and PostgreSQL.",
      "What draws me to this work is the whole journey of a product: understanding what someone actually needs, designing something clean, and then making it fast and reliable enough that people trust it.",
      "I'm particularly interested in performance and user experience — the small details like instant feedback and smooth interactions that make software feel good to use. Before writing code full-time, I worked as a Business Analyst Intern, consulting small businesses on their websites and delivering three of them end-to-end. That experience taught me to listen carefully, communicate clearly, and think about the business behind the code — skills I still rely on every day as a developer.", 
      "Right now I'm a Software Engineer Intern at MarketDash, and in my free time I build my own projects to explore ideas around AI, performance, and beautiful interfaces. I'm always open to new challenges and interesting people — feel free to reach out."
    ],
  },
}

export const skills = [
  {
    key: 'frontend',
    items: ['React', 'Next.js', 'TailwindCSS', 'Three.js / R3F', 'GSAP', 'HTML/CSS/JS'],
  },
  {
    key: 'backend',
    items: ['Node.js', 'PostgreSQL', 'Prisma', 'Firebase', 'REST API', 'JWT Auth'],
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
