'use client'

/** Bắt lỗi ở tận root layout — phải tự render <html>/<body> */
export default function GlobalError({ error, reset }) {
  return (
    <html lang="vi">
      <body style={{ fontFamily: 'system-ui, sans-serif', background: '#0b0f1a', color: '#e6e8f0', margin: 0 }}>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24, textAlign: 'center' }}>
          <h1 style={{ fontSize: 28, margin: 0 }}>Có lỗi xảy ra</h1>
          <p style={{ opacity: 0.7, maxWidth: 420 }}>{error?.digest ? `Mã lỗi: ${error.digest}` : 'Trang gặp sự cố ngoài ý muốn.'}</p>
          <button onClick={() => reset()} style={{ padding: '10px 20px', borderRadius: 999, border: 0, background: '#7b61ff', color: '#fff', cursor: 'pointer' }}>
            Thử lại
          </button>
        </div>
      </body>
    </html>
  )
}
