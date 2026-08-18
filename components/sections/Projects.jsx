'use client'

import SectionTitle from '@/components/ui/SectionTitle.jsx'
import Reveal from '@/components/ui/Reveal.jsx'
import ProjectCard from '@/components/ui/ProjectCard.jsx'
import { fallbackProjects } from '@/data/fallback.js'
import { useLang } from '@/lib/i18n.jsx'

/** Danh sách dự án — dữ liệu được server đọc sẵn (SSR/ISR), không fetch phía client */
export default function Projects({ items }) {
  const { t } = useLang()
  const projects = Array.isArray(items) && items.length ? items : fallbackProjects

  return (
    <section id="projects" className="section-shell">
      <Reveal>
        <SectionTitle kicker={t('projects.kicker')} title={t('projects.title')} />
      </Reveal>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => (
          <Reveal key={p.id ?? p.slug} delay={(i % 3) * 100}>
            <ProjectCard project={p} />
          </Reveal>
        ))}
      </div>
    </section>
  )
}
