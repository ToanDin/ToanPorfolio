import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="content-layer flex min-h-screen flex-col items-center justify-center gap-6 px-6">
      <h1 className="font-display text-3xl font-bold text-ink">404</h1>
      <p className="text-ink-mute">Trang bạn tìm không tồn tại.</p>
      <Link href="/" className="btn-ghost">← Về trang chủ</Link>
    </div>
  )
}
