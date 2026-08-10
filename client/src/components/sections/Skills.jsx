import SectionTitle from '../ui/SectionTitle.jsx'
import Reveal from '../ui/Reveal.jsx'
import { skills } from '../../data/profile.js'

export default function Skills() {
  return (
    <section id="skills" className="section-shell">
      <div className="md:ml-auto md:max-w-[55%]">
        <Reveal>
          <SectionTitle kicker="Kỹ năng" title="Tôi làm được gì" />
        </Reveal>
        <div className="space-y-8">
          {skills.map((group, i) => (
            <Reveal key={group.group} delay={i * 120}>
              <div className="card p-6">
                <h3 className="mb-4 font-display font-semibold text-accent2">{group.group}</h3>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-200 transition hover:border-accent/50 hover:bg-accent/10"
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
