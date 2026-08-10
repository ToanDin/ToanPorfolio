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
