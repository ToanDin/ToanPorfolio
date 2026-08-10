import { lazy, Suspense } from 'react'
import Navbar from '../components/ui/Navbar.jsx'
import Footer from '../components/ui/Footer.jsx'
import Hero from '../components/sections/Hero.jsx'
import About from '../components/sections/About.jsx'
import Skills from '../components/sections/Skills.jsx'
import Projects from '../components/sections/Projects.jsx'
import Contact from '../components/sections/Contact.jsx'

// Lazy load phần 3D: nội dung chữ hiện ngay, Three.js tải sau
const Scene = lazy(() => import('../components/canvas/Scene.jsx'))

export default function Home() {
  return (
    <>
      <Suspense fallback={null}>
        <Scene />
      </Suspense>

      <div className="content-layer">
        <Navbar />
        <main>
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  )
}
