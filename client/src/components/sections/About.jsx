import SectionTitle from '../ui/SectionTitle.jsx'
import Reveal from '../ui/Reveal.jsx'
import { profile } from '../../data/profile.js'

export default function About() {
  return (
    <section id="about" className="section-shell">
      <div className="md:max-w-[55%]">
        <Reveal>
          <SectionTitle kicker="Giới thiệu" title="Về tôi" />
        </Reveal>
        <div className="space-y-5 text-lg leading-relaxed text-slate-300">
          {profile.about.map((para, i) => (
            <Reveal key={i} delay={i * 120}>
              <p>{para}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
