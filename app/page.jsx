'use client'

import dynamic from 'next/dynamic'
import Navbar from '@/components/ui/Navbar.jsx'
import Footer from '@/components/ui/Footer.jsx'
import ScrollExtras from '@/components/ui/ScrollExtras.jsx'
import Hero from '@/components/sections/Hero.jsx'
import About from '@/components/sections/About.jsx'
import Experience from '@/components/sections/Experience.jsx'
import Skills from '@/components/sections/Skills.jsx'
import Projects from '@/components/sections/Projects.jsx'
import Contact from '@/components/sections/Contact.jsx'
import { useTheme } from '@/lib/theme.jsx'

// Phần 3D chỉ chạy phía trình duyệt (WebGL) — nội dung chữ hiện ngay, Three.js tải sau
const Scene = dynamic(() => import('@/components/canvas/Scene.jsx'), { ssr: false })

export default function Home() {
  const { theme } = useTheme()
  return (
    <>
      <Scene theme={theme} />

      <div className="content-layer">
        <ScrollExtras />
        <Navbar />
        <main>
          <Hero />
          <About />
          <Experience />
          <Skills />
          <Projects />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  )
}
