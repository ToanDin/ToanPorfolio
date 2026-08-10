# Portfolio 3D — React + Vite + Three.js + Node.js

Portfolio cá nhân với hiệu ứng 3D (galaxy particles + hero object biến đổi theo scroll),
dữ liệu dự án quản lý qua REST API với trang admin riêng.

```
portfolio/
├── client/   # React + Vite + TailwindCSS + React Three Fiber + GSAP
└── server/   # Node.js + Express + MongoDB (Mongoose) + JWT
```

## 1. Chạy local lần đầu

Yêu cầu: Node.js >= 18 (khuyến nghị 20+).

### Backend

```bash
cd server
npm install
copy .env.example .env     # Windows (macOS/Linux: cp .env.example .env)
```

Mở `server/.env` và điền:

1. `MONGODB_URI` — tạo cluster free tại https://www.mongodb.com/cloud/atlas
   (Database → Connect → Drivers → copy chuỗi kết nối, thay user/password).
   Nhớ vào **Network Access** thêm IP `0.0.0.0/0` (hoặc IP của bạn).
2. `JWT_SECRET` — chuỗi ngẫu nhiên dài, tạo bằng:
   `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
3. `ADMIN_EMAIL` / `ADMIN_PASSWORD` — tài khoản đăng nhập trang `/admin`.
4. (Tuỳ chọn) SMTP_* để nhận email khi có người liên hệ — bỏ trống vẫn chạy bình thường,
   tin nhắn luôn được lưu DB và xem được trong admin.

Rồi chạy:

```bash
npm run seed   # nạp 2 dự án mẫu (VietFit + Portfolio 3D) — chạy 1 lần
npm run dev    # API tại http://localhost:5000
```

### Frontend (terminal thứ hai)

```bash
cd client
npm install
npm run dev    # mở http://localhost:3000
```

Dev không cần cấu hình gì thêm — Vite đã proxy `/api` sang `localhost:5000`.

### Trang admin

Vào `http://localhost:3000/admin`, đăng nhập bằng `ADMIN_EMAIL` / `ADMIN_PASSWORD`.
Tại đây bạn thêm/sửa/xóa dự án (có nút cập nhật dữ liệu bất kỳ lúc nào) và xem tin nhắn liên hệ.

## 2. Đổi nội dung thành CỦA BẠN

- `client/src/data/profile.js` — tên, tagline, giới thiệu, skills, email, social links. **Sửa file này trước tiên.**
- `client/index.html` — title + meta description (SEO).
- Màu chủ đạo: `client/tailwind.config.js` (`accent`, `accent2`) và màu trong
  `client/src/components/canvas/HeroObject.jsx`.
- Ảnh dự án: dán URL ảnh (khuyên dùng https://cloudinary.com free) vào form admin.

## 3. Deploy lên Vercel (2 project, giống mô hình VietFit)

**Backend trước:**

1. Push code lên GitHub (repo này chứa cả `client/` và `server/`).
2. Vercel → Add New Project → chọn repo → **Root Directory: `server`**.
3. Thêm Environment Variables: `MONGODB_URI`, `JWT_SECRET`, `ADMIN_EMAIL`,
   `ADMIN_PASSWORD`, `CLIENT_ORIGIN` (điền sau khi có domain frontend), và SMTP_* nếu dùng.
4. Deploy → được URL dạng `https://portfolio-api-xxx.vercel.app`.
   Mở URL đó, thấy `{"ok":true}` là sống.

**Frontend:**

1. Add New Project → cùng repo → **Root Directory: `client`**.
2. Environment Variables: `VITE_API_URL` = URL backend ở trên (không có `/` cuối).
3. Deploy → được URL frontend.
4. Quay lại project backend, sửa `CLIENT_ORIGIN` = URL frontend rồi Redeploy.

## 4. Ghi chú kỹ thuật

- **Hiệu năng 3D**: mobile tự giảm số hạt (1600 vs 4500), tắt antialias, hạ DPR;
  phần 3D lazy-load nên chữ hiện trước; tôn trọng `prefers-reduced-motion`.
- **Fallback**: khi API chưa chạy, trang Projects hiển thị dữ liệu mẫu trong
  `client/src/data/fallback.js` thay vì trắng trơn.
- **Bảo mật**: JWT hết hạn 1 ngày; rate-limit login (10 lần/15 phút) và contact
  (5 lần/15 phút); CORS production chỉ cho phép `CLIENT_ORIGIN`; không có link tới
  `/admin` từ UI công khai.
- **Serverless**: kết nối MongoDB được cache giữa các invocation (`src/config/db.js`).

## 5. Ý tưởng nâng cấp sau

- Upload ảnh trực tiếp lên Cloudinary từ form admin (hiện tại dán URL).
- Thay icosahedron bằng model GLB riêng (nén Draco, < 2MB).
- Blog + thống kê lượt xem.
- Mua domain riêng (vd `tenban.dev`) gắn vào Vercel.
