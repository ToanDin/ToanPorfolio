'use client'

import Link from 'next/link'
import Navbar from '@/components/ui/Navbar.jsx'
import Footer from '@/components/ui/Footer.jsx'
import ScrollExtras from '@/components/ui/ScrollExtras.jsx'
import { useLang } from '@/lib/i18n.jsx'

/** Nhận project đã được server đọc sẵn từ DB (SSR) — null nếu không tìm thấy */
export default function ProjectDetailView({ project }) {
  const { t } = useLang()

  return (
    <div className="content-layer min-h-screen">
      <ScrollExtras />
      <Navbar />
      <main className="section-shell pt-32">
        {!project ? (
          <div className="text-center">
            <h1 className="font-display text-2xl text-ink">{t('detail.notFound')}</h1>
            <Link href="/" className="btn-ghost mt-6">{t('detail.home')}</Link>
          </div>
        ) : (
          <article className="mx-auto max-w-3xl">
            <Link href="/#projects" className="text-sm text-ink-mute hover:text-ink">
              {t('detail.all')}
            </Link>
            <h1 className="mt-4 font-display text-4xl font-bold text-ink md:text-5xl">
              {project.title}
            </h1>
            <p className="mt-3 text-lg text-ink-mute">{project.shortDesc}</p>

            <div className="mt-5 flex flex-wrap gap-2">
              {(project.techStack ?? []).map((tech) => (
                <span key={tech} className="chip">{tech}</span>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-4">
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noreferrer" className="btn-primary">
                  {t('detail.live')}
                </a>
              )}
              {project.repoUrl && (
                <a href={project.repoUrl} target="_blank" rel="noreferrer" className="btn-ghost">
                  {t('detail.source')}
                </a>
              )}
            </div>

            {project.thumbnail && (
              <img
                src={project.thumbnail}
                alt={project.title}
                className="mt-10 w-full rounded-2xl border border-line"
              />
            )}

            <div className="mt-10 space-y-4 text-lg leading-relaxed text-ink-soft">
              {(project.description ?? '').split('\n').filter(Boolean).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            {(project.images ?? []).length > 0 && (
              <div className="mt-10 grid gap-4 md:grid-cols-2">
                {project.images.map((img, i) => (
                  <img key={i} src={img} alt={`${project.title} ${i + 1}`} loading="lazy" className="rounded-xl border border-line" />
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
