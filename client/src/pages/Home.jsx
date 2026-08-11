import { lazy, Suspense } from 'react'
import Navbar from '../components/ui/Navbar.jsx'
import Footer from '../components/ui/Footer.jsx'
import ScrollExtras from '../components/ui/ScrollExtras.jsx'
import Hero from '../components/sections/Hero.jsx'
import About from '../components/sections/About.jsx'
import Experience from '../components/sections/Experience.jsx'
import Skills from '../components/sections/Skills.jsx'
import Projects from '../components/sections/Projects.jsx'
import Contact from '../components/sections/Contact.jsx'
import { useTheme } from '../lib/theme.jsx'

// Lazy load phần 3D: nội dung chữ hiện ngay, Three.js tải sau
const Scene = lazy(() => import('../components/canvas/Scene.jsx'))

export default function Home() {
  const { theme } = useTheme()
  return (
    <>
      <Suspense fallback={null}>
        <Scene theme={theme} />
      </Suspense>

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
