# Portfolio 3D — Next.js + Three.js + PostgreSQL

Portfolio cá nhân fullstack trên **một project Next.js duy nhất** (App Router):
hiệu ứng 3D (galaxy particles + hero object biến đổi theo scroll), trang chi tiết
server-render cho SEO, API Route Handlers + PostgreSQL (Prisma), trang admin riêng.

```
portfolio/
├── app/                  # App Router
│   ├── page.jsx          #   Trang chủ (client — 3D, GSAP)
│   ├── projects/[slug]/  #   Chi tiết dự án (SSR + metadata riêng)
│   ├── experience/[slug]/#   Chi tiết kinh nghiệm (SSR + metadata riêng)
│   ├── admin/            #   Đăng nhập + dashboard quản trị
│   └── api/              #   REST API (projects, experience, contact, auth, messages)
├── components/           # canvas (3D), sections, ui, admin, detail
├── lib/                  # api client, i18n, theme; lib/server: prisma, auth, validate...
├── data/                 # profile.js (nội dung cá nhân), fallback.js
└── prisma/               # schema + migrations + seed
```

## 1. Chạy local lần đầu

Yêu cầu: Node.js >= 18.17 (khuyến nghị 20+).

```bash
npm install                # postinstall tự chạy `prisma generate`
copy .env.example .env     # Windows (macOS/Linux: cp .env.example .env)
```

Mở `.env` và điền:

1. `DATABASE_URL` + `DATABASE_URL_UNPOOLED` — chuỗi kết nối PostgreSQL.
   - **Vercel Postgres**: Dashboard → Storage → Create Database → tab `.env.local`,
     hoặc chạy `vercel env pull .env`.
   - **Postgres local**: `docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=portfolio postgres:16`
     rồi đặt cả 2 biến về `postgresql://postgres:postgres@localhost:5432/portfolio`.
2. `JWT_SECRET` — chuỗi ngẫu nhiên dài:
   `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
3. `ADMIN_EMAIL` / `ADMIN_PASSWORD` — tài khoản đăng nhập trang `/admin`.
4. `NEXT_PUBLIC_EMAILJS_*` — form liên hệ gửi email qua EmailJS (copy từ client/.env cũ,
   đổi tiền tố `VITE_` thành `NEXT_PUBLIC_`).
5. (Tuỳ chọn) `SMTP_*` — nhận thêm email báo qua SMTP khi có tin nhắn mới.

Tạo bảng, nạp dữ liệu mẫu rồi chạy:

```bash
npm run db:migrate         # tạo bảng từ prisma/schema.prisma
npm run seed               # nạp dữ liệu mẫu (chạy lại nhiều lần vẫn an toàn)
npm run dev                # http://localhost:3000
```

### Trang admin

Vào `http://localhost:3000/admin`, đăng nhập bằng `ADMIN_EMAIL` / `ADMIN_PASSWORD`.
Thêm/sửa/xóa dự án & kinh nghiệm, xem tin nhắn liên hệ.

## 2. Đổi nội dung thành CỦA BẠN

- `data/profile.js` — tên, tagline, giới thiệu, skills, email, social links. **Sửa file này trước tiên.**
- `app/layout.jsx` — metadata (title, description, OG) của toàn site.
- Màu chủ đạo: `tailwind.config.js` + `app/globals.css`; màu 3D trong
  `components/canvas/HeroObject.jsx`.
- Ảnh dự án: dán URL ảnh (khuyên dùng https://cloudinary.com free) vào form admin.

## 3. Deploy lên Vercel (1 project duy nhất)

1. Push code lên GitHub.
2. Vercel → Add New Project → chọn repo → Root Directory để mặc định (gốc repo).
   Vercel tự nhận diện Next.js.
3. Tab **Storage** → tạo Postgres database → Connect vào project —
   `DATABASE_URL` / `DATABASE_URL_UNPOOLED` được thêm tự động.
4. Environment Variables: thêm `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`,
   `NEXT_PUBLIC_EMAILJS_*` (và `SMTP_*` nếu dùng).
5. Deploy. Sau lần deploy đầu, tạo bảng trên DB production:
   `vercel env pull .env.production && npx prisma migrate deploy` (hoặc chạy
   `npm run db:deploy` với env production), rồi seed nếu muốn.

Không còn CORS, không còn `VITE_API_URL` — frontend và API cùng một origin.

## 4. Ghi chú kỹ thuật

- **SSR + SEO**: `/projects/[slug]` và `/experience/[slug]` đọc DB ngay trên server,
  mỗi trang có `generateMetadata` riêng (title/description/OG image).
- **3D**: `next/dynamic` với `ssr: false` cho Canvas (WebGL chỉ chạy trình duyệt);
  mobile tự giảm số hạt (1600 vs 4500), tắt antialias, hạ DPR; tôn trọng
  `prefers-reduced-motion`.
- **Theme/i18n**: script inline trong `layout.jsx` đặt `data-theme` trước khi React
  hydrate (không nháy màn hình); state khởi tạo SSR-safe rồi đồng bộ localStorage.
- **Bảo mật**: JWT hết hạn 1 ngày; rate-limit login (10 lần/15 phút) và contact
  (5 lần/15 phút) theo IP; validate đầu vào ở `lib/server/validate.js`.
- **Serverless**: PrismaClient cache trên `globalThis`, chạy qua connection pooler
  (`DATABASE_URL`); migrate dùng `DATABASE_URL_UNPOOLED`.
- **Song ngữ**: bảng `experiences` lưu cột phẳng `*_vi`/`*_en`, API gộp thành `{ vi, en }`.
- **Form liên hệ**: gửi email qua EmailJS (client) **và** lưu vào DB qua `/api/contact`
  để xem lại trong trang admin.

## 5. Ý tưởng nâng cấp sau

- Upload ảnh trực tiếp lên Cloudinary từ form admin (hiện tại dán URL).
- Thay icosahedron bằng model GLB riêng (nén Draco, < 2MB).
- Blog (MDX) + thống kê lượt xem.
- Mua domain riêng (vd `tenban.dev`) gắn vào Vercel.
