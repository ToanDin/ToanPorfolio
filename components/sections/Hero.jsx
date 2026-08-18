'use client'

import { profile, content } from '@/data/profile.js'
import { useLang } from '@/lib/i18n.jsx'
import TypingText from '@/components/ui/TypingText.jsx'

export default function Hero() {
  const { t, lang } = useLang()
  const c = content[lang]
  return (
    <section id="hero" className="relative flex min-h-screen items-center">
      <div className="section-shell !py-0">
        <div className="max-w-2xl">
          <p className="mb-4 font-medium text-accent2">{t('hero.greeting')}</p>
          <h1 className="font-display text-5xl font-bold leading-tight md:text-7xl">
            <TypingText text={profile.name} className="grad-text" />
          </h1>
          <h2 className="mt-3 font-display text-2xl font-semibold text-ink-soft md:text-3xl">
            {c.role}
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-mute">{c.tagline}</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a href="#projects" className="btn-primary">
              {t('hero.viewProjects')}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
            <a href="#contact" className="btn-ghost">{t('hero.contact')}</a>
          </div>
        </div>
      </div>

      {/* Gợi ý cuộn xuống */}
      <a
        href="#about"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-ink-mute transition hover:text-ink"
        aria-label={t('hero.scrollDown')}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-bounce">
          <path d="M12 5v14M6 13l6 6 6-6" />
        </svg>
      </a>
    </section>
  )
}
