import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import StarsBackground from './StarsBackground.jsx'
import HeroObject from './HeroObject.jsx'
import useIsMobile from '../../hooks/useIsMobile.js'

/**
 * Canvas 3D cố định phủ toàn trang (z-index dưới nội dung).
 * - Mobile: giảm số hạt, tắt antialias, DPR thấp hơn.
 * - prefers-reduced-motion: giữ scene tĩnh, không scroll animation.
 * - theme: đổi màu hạt/vật thể cho hợp nền sáng hoặc tối.
 */
export default function Scene({ theme = 'dark' }) {
  const isMobile = useIsMobile()
  const [reducedMotion, setReducedMotion] = useState(false)
  const mouse = useRef({ x: 0, y: 0 })
  const isLight = theme === 'light'

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const onChange = (e) => setReducedMotion(e.matches)
    mq.addEventListener('change', onChange)

    const onMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove)
    return () => {
      mq.removeEventListener('change', onChange)
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  return (
    <div className="webgl-fixed" aria-hidden="true">
      <Canvas
        dpr={[1, isMobile ? 1.5 : 2]}
        camera={{ position: [0, 0, 5], fov: 55 }}
        gl={{ antialias: !isMobile, powerPreference: 'high-performance', alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={isLight ? 0.55 : 0.35} />
          <directionalLight position={[4, 4, 6]} intensity={1.1} />
          <pointLight position={[-4, -2, -4]} intensity={0.4} color="#00d4ff" />
          <StarsBackground
            count={isMobile ? 1600 : 4500}
            mouse={mouse}
            color={isLight ? '#54609c' : '#a8b4ff'}
          />
          <HeroObject
            isMobile={isMobile}
            reducedMotion={reducedMotion}
            baseColor={isLight ? '#6a4ee0' : '#7b61ff'}
            cyanColor={isLight ? '#0098b8' : '#00d4ff'}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}
