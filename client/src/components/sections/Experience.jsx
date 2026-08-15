import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SectionTitle from '../ui/SectionTitle.jsx'
import Reveal from '../ui/Reveal.jsx'
import { fetchExperience } from '../../lib/api.js'
import { experience as fallbackExperience } from '../../data/profile.js'
import { useLang } from '../../lib/i18n.jsx'

/** Lấy chuỗi theo ngôn ngữ, rơi về tiếng Việt nếu bản dịch trống */
export const pick = (field, lang) => field?.[lang] || field?.vi || ''
export const pickList = (field, lang) => {
  const list = field?.[lang]?.length ? field[lang] : field?.vi
  return Array.isArray(list) ? list : []
}

export default function Experience() {
  const { t, lang } = useLang()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetchExperience()
      .then((data) => {
        if (!cancelled) setItems(Array.isArray(data) && data.length ? data : fallbackExperience)
      })
      .catch(() => {
        // Backend chưa chạy → dùng dữ liệu local
        if (!cancelled) setItems(fallbackExperience)
      })
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section id="experience" className="section-shell">
      <Reveal>
        <SectionTitle kicker={t('experience.kicker')} title={t('experience.title')} />
      </Reveal>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="card h-56 animate-pulse" />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {items.map((job, i) => {
            const desc = pick(job.shortDesc, lang) || pickList(job.bullets, lang)[0] || ''
            return (
              <Reveal key={job.id ?? job.company} delay={(i % 2) * 100} className="h-full">
                <Link
                  to={`/experience/${job.slug || job.id}`}
                  className="card group flex h-full flex-col p-6 transition hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_8px_40px_var(--glow)] md:p-8"
                >
                  {/* Viền gradient mảnh trên đầu thẻ */}
                  <div
                    className="mb-5 h-1 w-16 rounded-full"
                    style={{
                      backgroundImage:
                        'linear-gradient(90deg, rgb(var(--c-accent)), rgb(var(--c-accentp)), rgb(var(--c-accent2)))',
                    }}
                  />
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h3 className="font-display text-xl font-semibold text-ink group-hover:text-accent2">
                      {job.company}
                    </h3>
                    <span className="chip">{pick(job.period, lang)}</span>
                  </div>
                  <p className="mt-1 font-medium text-accent2">{pick(job.role, lang)}</p>
                  <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-ink-mute">{desc}</p>
                  <span className="mt-auto flex items-center gap-1.5 pt-5 text-sm font-medium text-accent transition group-hover:gap-2.5">
                    {t('detail.viewDetail')}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </span>
                </Link>
              </Reveal>
            )
          })}
        </div>
      )}
    </section>
  )
}
