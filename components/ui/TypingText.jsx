'use client'

import { useEffect, useState } from 'react'

/**
 * Hiệu ứng gõ chữ từng ký tự.
 * - Giữ nguyên chiều cao (không nhảy layout) nhờ span ẩn chứa full text.
 * - Tôn trọng prefers-reduced-motion: hiển thị luôn, không gõ.
 */
export default function TypingText({ text, speed = 110, startDelay = 400, className = '' }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCount(text.length)
      return
    }
    setCount(0)
    let timer
    const tick = (i) => {
      setCount(i)
      if (i < text.length) timer = setTimeout(() => tick(i + 1), speed)
    }
    timer = setTimeout(() => tick(1), startDelay)
    return () => clearTimeout(timer)
  }, [text, speed, startDelay])

  return (
    <span className="relative inline-block" aria-label={text}>
      {/* Giữ chỗ để tiêu đề không co giãn khi đang gõ */}
      <span className="invisible" aria-hidden="true">{text}</span>
      <span className="absolute inset-0 whitespace-nowrap" aria-hidden="true">
        <span className={className}>{text.slice(0, count)}</span>
      </span>
    </span>
  )
}
