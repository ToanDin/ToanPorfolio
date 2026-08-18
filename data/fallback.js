// Dữ liệu dự phòng khi backend chưa chạy / API lỗi — trang vẫn có nội dung để xem.
// Khi backend hoạt động, dữ liệu thật từ PostgreSQL sẽ thay thế danh sách này.

export const fallbackProjects = [
  {
    id: 'fallback-1',
    title: 'VietFit',
    slug: 'vietfit',
    shortDesc: 'PWA theo dõi calo & dinh dưỡng cho người Việt, tích hợp AI nhận diện món ăn.',
    description:
      'VietFit giúp người Việt theo dõi calo và dinh dưỡng hằng ngày với cơ sở dữ liệu món ăn Việt Nam. ' +
      'Ứng dụng tích hợp Gemini AI để nhận diện món ăn, đăng nhập bằng Firebase Auth và đồng bộ dữ liệu qua Firestore.',
    techStack: ['React', 'Vite', 'TailwindCSS', 'Firebase', 'Node.js', 'Gemini AI'],
    thumbnail: '',
    images: [],
    liveUrl: 'https://viet-fit-bjsn.vercel.app',
    repoUrl: '',
    featured: true,
    order: 1,
  },
  {
    id: 'fallback-2',
    title: 'Portfolio 3D',
    slug: 'portfolio-3d',
    shortDesc: 'Chính trang web này — React Three Fiber, GSAP scroll animation, backend Node.js.',
    description:
      'Portfolio cá nhân với hiệu ứng 3D: nền galaxy particles phản ứng theo chuột, vật thể hero biến đổi theo scroll. ' +
      'Dữ liệu dự án quản lý qua REST API Node.js + PostgreSQL (Prisma) với trang admin riêng.',
    techStack: ['React', 'Three.js', 'GSAP', 'Node.js', 'Express', 'PostgreSQL', 'Prisma'],
    thumbnail: '',
    images: [],
    liveUrl: 'https://toanporfolio-xi.vercel.app/',
    repoUrl: '',
    featured: false,
    order: 2,
  },
]
