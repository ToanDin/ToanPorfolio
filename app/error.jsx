'use client'

import { useEffect } from 'react'
import Link from 'next/link'

/** Error boundary toàn app — bắt lỗi render/server thay vì trang lỗi mặc định của Next */
export default function Error({ error, reset }) {
  useEffect(() => {
    console.error('[app error]', error)
  }, [error])

  return (
    <div className="content-layer flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="font-display text-3xl font-bold text-ink">Có lỗi xảy ra</h1>
      <p className="max-w-md text-ink-mute">
        Xin lỗi, trang gặp sự cố. Bạn có thể thử tải lại hoặc quay về trang chủ.
      </p>
      <div className="flex gap-3">
        <button onClick={() => reset()} className="btn-primary">Thử lại</button>
        <Link href="/" className="btn-ghost">← Về trang chủ</Link>
      </div>
    </div>
  )
}
