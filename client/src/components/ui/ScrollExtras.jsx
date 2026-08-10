import { useEffect, useState } from 'react'

/** Thanh tiến độ đọc trang (trên cùng) + nút back-to-top — theo phong cách template */
export default function ScrollExtras() {
  const [progress, setProgress] = useState(0)
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement
      const max = el.scrollHeight - el.clientHeight
      setProgress(max > 0 ? window.scrollY / max : 0)
      setShowTop(window.scrollY > 600)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]" aria-hidden="true">
        <div
          className="h-full origin-left"
          style={{
            transform: `scaleX(${progress})`,
            backgroundImage:
              'linear-gradient(90deg, rgb(var(--c-accent)), rgb(var(--c-accentp)), rgb(var(--c-accent2)))',
          }}
        />
      </div>

      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Lên đầu trang"
        className={`fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-line bg-panel/90 text-ink shadow-lg backdrop-blur transition-all hover:border-accent hover:text-accent ${
          showTop ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
        }`}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </button>
    </>
  )
}
