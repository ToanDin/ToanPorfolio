import { Inter, Sora } from 'next/font/google'
import Providers from './providers.jsx'
import './globals.css'

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

// Sora không hỗ trợ subset vietnamese — chữ có dấu sẽ rơi về Inter (đã khai trong
// tailwind fontFamily.display), giống hành vi của bản Vite cũ dùng <link> Google Fonts.
const sora = Sora({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-sora',
  display: 'swap',
})

export const metadata = {
  title: 'TOAN DINH | Fullstack Developer',
  description:
    'Portfolio cá nhân — Fullstack Developer. React, Next.js, Node.js, và những sản phẩm tôi đã xây dựng.',
  openGraph: {
    title: 'Portfolio | Fullstack Developer',
    description: 'Khám phá các dự án và kỹ năng của tôi — React, Next.js, Three.js.',
    type: 'website',
  },
  icons: { icon: '/favicon.svg' },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

// Đặt theme trước khi React hydrate để tránh nháy màn hình
const themeInit = `document.documentElement.dataset.theme =
  localStorage.getItem('portfolio-theme') === 'light' ? 'light' : 'dark'`

export default function RootLayout({ children }) {
  return (
    <html lang="vi" suppressHydrationWarning className={`${inter.variable} ${sora.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
