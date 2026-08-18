'use client'

import { useEffect, useState } from 'react'

/** true khi màn hình < 768px — dùng để giảm tải hiệu ứng 3D trên mobile */
export default function useIsMobile() {
  // Khởi tạo false cho SSR-safe (không đọc window lúc render); đồng bộ ngay khi mount
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    setIsMobile(mq.matches)
    const onChange = (e) => setIsMobile(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return isMobile
}
