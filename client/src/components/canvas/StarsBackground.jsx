import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as random from 'maath/random'

/**
 * Nền galaxy: đám mây hạt hình cầu xoay chậm liên tục,
 * nghiêng nhẹ theo vị trí chuột (parallax).
 */
export default function StarsBackground({ count = 4500, mouse, color = '#a8b4ff' }) {
  const ref = useRef()

  // Sinh vị trí hạt một lần duy nhất
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    random.inSphere(arr, { radius: 1.6 })
    // Loại NaN hiếm gặp để tránh lỗi bounding sphere
    for (let i = 0; i < arr.length; i++) {
      if (!Number.isFinite(arr[i])) arr[i] = 0
    }
    return arr
  }, [count])

  useFrame((_, delta) => {
    if (!ref.current) return
    // Xoay chậm liên tục
    ref.current.rotation.x -= delta / 18
    ref.current.rotation.y -= delta / 24
    // Parallax theo chuột (lerp cho mượt)
    if (mouse?.current) {
      ref.current.position.x += (mouse.current.x * 0.15 - ref.current.position.x) * delta * 2
      ref.current.position.y += (-mouse.current.y * 0.15 - ref.current.position.y) * delta * 2
    }
  })

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points key={count} ref={ref} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color={color}
          size={0.0045}
          sizeAttenuation
          depthWrite={false}
        />
      </Points>
    </group>
  )
}
