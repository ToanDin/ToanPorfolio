import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../components/ui/Navbar.jsx'
import Footer from '../components/ui/Footer.jsx'
import { fetchProject } from '../lib/api.js'
import { fallbackProjects } from '../data/fallback.js'

export default function ProjectDetail() {
  const { slug } = useParams()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    window.scrollTo(0, 0)
    let cancelled = false
    fetchProject(slug)
      .then((data) => !cancelled && setProject(data))
      .catch(() => {
        if (!cancelled) setProject(fallbackProjects.find((p) => p.slug === slug) ?? null)
      })
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [slug])

  return (
    <div className="content-layer min-h-screen">
      <Navbar />
      <main className="section-shell pt-32">
        {loading ? (
          <div className="card h-96 animate-pulse" />
        ) : !project ? (
          <div className="text-center">
            <h1 className="font-display text-2xl text-white">Không tìm thấy dự án</h1>
            <Link to="/" className="btn-ghost mt-6">← Về trang chủ</Link>
          </div>
        ) : (
          <article className="mx-auto max-w-3xl">
            <Link to="/#projects" className="text-sm text-slate-400 hover:text-white">
              ← Tất cả dự án
            </Link>
            <h1 className="mt-4 font-display text-4xl font-bold text-white md:text-5xl">
              {project.title}
            </h1>
            <p className="mt-3 text-lg text-slate-400">{project.shortDesc}</p>

            <div className="mt-5 flex flex-wrap gap-2">
              {(project.techStack ?? []).map((t) => (
                <span key={t} className="chip">{t}</span>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-4">
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noreferrer" className="btn-primary">
                  Xem live demo
                </a>
              )}
              {project.repoUrl && (
                <a href={project.repoUrl} target="_blank" rel="noreferrer" className="btn-ghost">
                  Source code
                </a>
              )}
            </div>

            {project.thumbnail && (
              <img
                src={project.thumbnail}
                alt={project.title}
                className="mt-10 w-full rounded-2xl border border-white/10"
              />
            )}

            <div className="prose-invert mt-10 space-y-4 text-lg leading-relaxed text-slate-300">
              {(project.description ?? '').split('\n').filter(Boolean).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            {(project.images ?? []).length > 0 && (
              <div className="mt-10 grid gap-4 md:grid-cols-2">
                {project.images.map((img, i) => (
                  <img key={i} src={img} alt={`${project.title} ${i + 1}`} loading="lazy" className="rounded-xl border border-white/10" />
                ))}
              </div>
            )}
          </article>
        )}
      </main>
      <Footer />
    </div>
  )
}
