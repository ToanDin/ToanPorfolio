import { ImageResponse } from 'next/og'

// Ảnh OG mặc định cho toàn site (1200x630) — Next tự thêm <meta og:image>
export const runtime = 'edge'
export const alt = 'TOAN DINH — Fullstack Developer'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 80,
          background: 'linear-gradient(135deg, #0b0f1a 0%, #151a2e 60%, #1c1440 100%)',
          color: '#e6e8f0',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 28, color: '#00d4ff', letterSpacing: 6, textTransform: 'uppercase' }}>Portfolio</div>
        <div style={{ fontSize: 96, fontWeight: 800, marginTop: 16 }}>TOAN DINH</div>
        <div style={{ fontSize: 40, color: '#a8b4ff', marginTop: 8 }}>Fullstack Developer</div>
        <div style={{ fontSize: 28, color: '#8b93a7', marginTop: 40 }}>React · Next.js · Node.js · Three.js · PostgreSQL</div>
      </div>
    ),
    { ...size },
  )
}
