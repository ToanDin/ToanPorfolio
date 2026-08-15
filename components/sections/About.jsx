'use client'

import SectionTitle from '@/components/ui/SectionTitle.jsx'
import Reveal from '@/components/ui/Reveal.jsx'
import { content } from '@/data/profile.js'
import { useLang } from '@/lib/i18n.jsx'

export default function About() {
  const { t, lang } = useLang()
  return (
    <section id="about" className="section-shell">
      <div className="md:max-w-[55%]">
        <Reveal>
          <SectionTitle kicker={t('about.kicker')} title={t('about.title')} />
        </Reveal>
        <div className="space-y-5 text-lg leading-relaxed text-ink-soft">
          {content[lang].about.map((para, i) => (
            <Reveal key={i} delay={i * 120}>
              <p>{para}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
