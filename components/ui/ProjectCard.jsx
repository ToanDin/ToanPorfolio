'use client'

import Link from 'next/link'
import { useLang } from '@/lib/i18n.jsx'

export default function ProjectCard({ project }) {
  const { t } = useLang()
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="card group block overflow-hidden transition hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_8px_40px_var(--glow)]"
    >
      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-accent/20 to-accent2/10">
        {project.thumbnail ? (
          <img
            src={project.thumbnail}
            alt={project.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-display text-4xl font-bold text-ink/20">
            {project.title?.[0] ?? '?'}
          </div>
        )}
        {project.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-accent px-3 py-1 text-xs font-medium text-white">
            {t('projects.featured')}
          </span>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-display text-lg font-semibold text-ink group-hover:text-accent2">
          {project.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-ink-mute">{project.shortDesc}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {(project.techStack ?? []).slice(0, 4).map((tech) => (
            <span key={tech} className="chip">{tech}</span>
          ))}
        </div>
      </div>
    </Link>
  )
}
