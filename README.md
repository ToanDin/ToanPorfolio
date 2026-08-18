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

Yêu cầu: Node.js >= 20 (Web Crypto toàn cục dùng cho JWT; Node 18 đã hết hạn hỗ trợ).

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
3. `ADMIN_EMAIL` / `ADMIN_PASSWORD_HASH` — tài khoản đăng nhập trang `/admin`.
   Tạo hash: `npm run hash-password -- 'mat-khau-cua-ban'` rồi dán kết quả vào `.env`
   (mật khẩu không lưu dạng thô ở bất kỳ đâu). `ADMIN_PASSWORD` thô vẫn được chấp nhận
   để tương thích, nhưng sẽ cảnh báo trong log production.
4. `NEXT_PUBLIC_SITE_URL` — URL công khai (dùng cho sitemap/canonical/OG). Trên Vercel có thể bỏ trống.
5. (Khuyến nghị khi deploy serverless) `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` —
   rate-limit dùng chung giữa các instance (Upstash Redis free). Không có → dùng bộ đếm trong bộ nhớ.
6. (Tuỳ chọn) `NEXT_PUBLIC_EMAILJS_*` — form liên hệ gửi thêm email qua EmailJS.
   Nhớ bật **Allowed domains** trong EmailJS vì public key nằm trong bundle.
7. (Tuỳ chọn) `SMTP_*` — nhận thêm email báo qua SMTP khi có tin nhắn mới.

Tạo bảng, nạp dữ liệu mẫu rồi chạy:

```bash
npm run db:migrate         # tạo bảng từ prisma/schema.prisma
npm run seed               # nạp dữ liệu mẫu (chạy lại nhiều lần vẫn an toàn)
npm run dev                # http://localhost:3000
```

### Trang admin

Vào `http://localhost:3000/admin`, đăng nhập bằng `ADMIN_EMAIL` + mật khẩu đã băm.
Thêm/sửa/xóa dự án & kinh nghiệm, xem/đánh dấu đã đọc/xóa tin nhắn liên hệ.
Phiên đăng nhập là cookie `httpOnly` (1 ngày); `middleware.js` chặn `/admin/dashboard`
ngay tại edge nếu chưa đăng nhập.

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
4. Environment Variables: thêm `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`,
   `NEXT_PUBLIC_SITE_URL`, `UPSTASH_REDIS_REST_*` (khuyến nghị), `NEXT_PUBLIC_EMAILJS_*`
   và `SMTP_*` nếu dùng.
5. Migration **không** chạy trong `npm run build` (để preview build không đụng DB và
   không fail khi DB chập chờn). Chọn một trong hai:
   - Chạy tay sau mỗi lần đổi schema: `vercel env pull .env.production && npm run db:deploy`
   - Hoặc trong Vercel → Settings → Build Command đặt `npm run vercel-build`
     (= `prisma migrate deploy && next build`) **chỉ cho Production**.
6. Deploy, rồi seed nếu muốn (`npm run seed` với env production).

Không còn CORS, không còn `VITE_API_URL` — frontend và API cùng một origin.

## 4. Ghi chú kỹ thuật

- **SSR + SEO**: trang chủ, `/projects/[slug]` và `/experience/[slug]` đọc DB ngay trên
  server (`lib/server/data.js`, bọc React `cache()`), mỗi trang có `generateMetadata`
  riêng (title/description/OG image, canonical).
- **3D**: `next/dynamic` với `ssr: false` cho Canvas (WebGL chỉ chạy trình duyệt);
  mobile tự giảm số hạt (1600 vs 4500), tắt antialias, hạ DPR; tôn trọng
  `prefers-reduced-motion`.
- **Theme/i18n**: script inline trong `layout.jsx` đặt `data-theme` trước khi React
  hydrate (không nháy màn hình); state khởi tạo SSR-safe rồi đồng bộ localStorage.
- **Bảo mật**: mật khẩu admin băm scrypt (`lib/server/password.js`); JWT HS256 tự
  ký/verify bằng Web Crypto (`lib/server/jwt.js`, chạy cả edge) lưu trong cookie
  `httpOnly` + `SameSite=Strict`, hết hạn 1 ngày; kiểm tra Origin cho request ghi;
  `middleware.js` chặn trang admin; rate-limit login (10 lần/15 phút) và contact
  (5 lần/15 phút) theo IP thật (`x-real-ip`, không tin `x-forwarded-for`), dùng Upstash
  Redis nếu cấu hình; honeypot + kiểm tra thời gian điền form liên hệ; validate URL
  http(s) cho link/ảnh dự án; security headers (CSP, HSTS, X-Frame-Options...) trong
  `next.config.mjs`.
- **Cache/ISR**: trang chủ và trang chi tiết render sẵn (`revalidate = 60`), API admin
  gọi `revalidatePath` khi thêm/sửa/xoá nên thay đổi hiện ngay; slug không tồn tại trả
  404 thật (`notFound()`); `robots.txt`, `sitemap.xml`, ảnh OG mặc định tự sinh.
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
