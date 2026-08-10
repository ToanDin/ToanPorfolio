import SectionTitle from '../ui/SectionTitle.jsx'
import Reveal from '../ui/Reveal.jsx'
import { skills } from '../../data/profile.js'
import { useLang } from '../../lib/i18n.jsx'

export default function Skills() {
  const { t } = useLang()
  return (
    <section id="skills" className="section-shell">
      <div className="md:ml-auto md:max-w-[55%]">
        <Reveal>
          <SectionTitle kicker={t('skills.kicker')} title={t('skills.title')} />
        </Reveal>
        <div className="space-y-8">
          {skills.map((group, i) => (
            <Reveal key={group.key} delay={i * 120}>
              <div className="card p-6">
                <h3 className="mb-4 font-display font-semibold text-accent2">
                  {t(`skills.groups.${group.key}`)}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-lg border border-line bg-surface px-3 py-1.5 text-sm text-ink transition hover:border-accent/50 hover:bg-accent/10"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
