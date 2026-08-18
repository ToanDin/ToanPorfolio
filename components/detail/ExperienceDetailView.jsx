'use client'

import Link from 'next/link'
import Navbar from '@/components/ui/Navbar.jsx'
import Footer from '@/components/ui/Footer.jsx'
import ScrollExtras from '@/components/ui/ScrollExtras.jsx'
import { useLang } from '@/lib/i18n.jsx'
import { pick, pickList } from '@/lib/bilingual.js'

/** Nhận item đã được server đọc sẵn từ DB (SSR) — null nếu không tìm thấy */
export default function ExperienceDetailView({ item }) {
  const { t, lang } = useLang()

  return (
    <div className="content-layer min-h-screen">
      <ScrollExtras />
      <Navbar />
      <main id="main" className="section-shell pt-32">
        {!item ? (
          <div className="text-center">
            <h1 className="font-display text-2xl text-ink">{t('detail.expNotFound')}</h1>
            <Link href="/" className="btn-ghost mt-6">{t('detail.home')}</Link>
          </div>
        ) : (
          <article className="mx-auto max-w-3xl">
            <Link href="/#experience" className="text-sm text-ink-mute hover:text-ink">
              {t('detail.allExp')}
            </Link>
            <h1 className="mt-4 font-display text-4xl font-bold text-ink md:text-5xl">
              {item.company}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
              <p className="text-lg font-medium text-accent2">{pick(item.role, lang)}</p>
              <span className="chip">{pick(item.period, lang)}</span>
            </div>
            {pick(item.shortDesc, lang) && (
              <p className="mt-4 text-lg text-ink-mute">{pick(item.shortDesc, lang)}</p>
            )}

            <ul className="mt-10 space-y-4">
              {pickList(item.bullets, lang).map((b, i) => (
                <li key={i} className="flex gap-3 text-lg leading-relaxed text-ink-soft">
                  <span className="mt-[13px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </article>
        )}
      </main>
      <Footer />
    </div>
  )
}
