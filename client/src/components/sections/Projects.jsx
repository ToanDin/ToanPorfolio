import { useEffect, useState } from 'react'
import SectionTitle from '../ui/SectionTitle.jsx'
import Reveal from '../ui/Reveal.jsx'
import ProjectCard from '../ui/ProjectCard.jsx'
import { fetchProjects } from '../../lib/api.js'
import { fallbackProjects } from '../../data/fallback.js'
import { useLang } from '../../lib/i18n.jsx'

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const { t } = useLang()

  useEffect(() => {
    let cancelled = false
    fetchProjects()
      .then((data) => {
        if (!cancelled) setProjects(Array.isArray(data) && data.length ? data : fallbackProjects)
      })
      .catch(() => {
        // Backend chưa chạy → dùng dữ liệu dự phòng, trang vẫn có nội dung
        if (!cancelled) setProjects(fallbackProjects)
      })
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section id="projects" className="section-shell">
      <Reveal>
        <SectionTitle kicker={t('projects.kicker')} title={t('projects.title')} />
      </Reveal>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card h-72 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <Reveal key={p._id ?? p.slug} delay={(i % 3) * 100}>
              <ProjectCard project={p} />
            </Reveal>
          ))}
        </div>
      )}
    </section>
  )
}
