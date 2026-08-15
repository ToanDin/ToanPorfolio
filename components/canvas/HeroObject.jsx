'use client'

import { useRef } from 'react'
import { Color } from 'three'
import { useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial } from '@react-three/drei'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/**
 * Vật thể hero: icosahedron "biến dạng" gradient tím.
 * Khi cuộn trang, GSAP ScrollTrigger điều khiển vị trí / scale / màu / độ mờ
 * theo từng section (#about, #skills, #projects).
 */
export default function HeroObject({
  isMobile,
  reducedMotion,
  baseColor = '#7b61ff',
  cyanColor = '#00d4ff',
}) {
  const group = useRef()
  const mat = useRef()

  // Chuyển động "thở" nhẹ liên tục
  useFrame(({ clock }) => {
    if (!group.current) return
    group.current.rotation.y = clock.elapsedTime * 0.15
  })

  useGSAP(() => {
    if (reducedMotion || !group.current || !mat.current) return

    const g = group.current
    const m = mat.current
    const sideX = isMobile ? 0 : 2.1 // mobile: giữ giữa màn hình, chỉ thu nhỏ

    const common = (trigger) => ({
      trigger,
      start: 'top bottom',
      end: 'top top',
      scrub: 0.6,
    })

    // Hero -> About: trôi sang phải, nhỏ lại một chút
    gsap.to(g.position, { x: sideX, y: -0.2, scrollTrigger: common('#about') })
    gsap.to(g.scale, { x: 0.75, y: 0.75, z: 0.75, scrollTrigger: common('#about') })

    // About -> Skills: đổi màu -> cyan, trôi sang trái
    const cyan = new Color(cyanColor)
    gsap.to(m.color, { r: cyan.r, g: cyan.g, b: cyan.b, scrollTrigger: common('#skills') })
    gsap.to(g.position, { x: -sideX, scrollTrigger: common('#skills') })

    // Skills -> Projects: thu nhỏ và mờ dần, nhường sân khấu cho nội dung
    gsap.to(g.scale, { x: 0.35, y: 0.35, z: 0.35, scrollTrigger: common('#projects') })
    gsap.to(m, { opacity: 0, scrollTrigger: common('#projects') })
    gsap.to(g.position, { y: -1.4, scrollTrigger: common('#projects') })
  }, [isMobile, reducedMotion, cyanColor])

  return (
    <Float speed={1.6} rotationIntensity={0.4} floatIntensity={0.9}>
      <group ref={group} position={[0, 0, 0]}>
        <mesh castShadow>
          <icosahedronGeometry args={[1.15, isMobile ? 4 : 12]} />
          <MeshDistortMaterial
            ref={mat}
            color={baseColor}
            distort={0.42}
            speed={isMobile ? 1.2 : 2}
            roughness={0.15}
            metalness={0.2}
            transparent
          />
        </mesh>
      </group>
    </Float>
  )
}
