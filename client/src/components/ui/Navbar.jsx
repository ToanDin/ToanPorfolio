import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { profile } from '../../data/profile.js'
import { useTheme } from '../../lib/theme.jsx'
import { useLang } from '../../lib/i18n.jsx'

const links = [
  { href: '#about', key: 'nav.about' },
  { href: '#experience', key: 'nav.experience' },
  { href: '#skills', key: 'nav.skills' },
  { href: '#projects', key: 'nav.projects' },
  { href: '#contact', key: 'nav.contact' },
]

function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <button onClick={toggle} className="icon-btn" aria-label="Đổi giao diện sáng/tối" title="Theme">
      {theme === 'dark' ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      )}
    </button>
  )
}

function LangToggle() {
  const { lang, toggle } = useLang()
  return (
    <button onClick={toggle} className="icon-btn font-medium" aria-label="Change language" title="VI / EN">
      {lang === 'vi' ? 'EN' : 'VI'}
    </button>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { t } = useLang()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all ${
        scrolled ? 'bg-night/80 shadow-lg shadow-black/10 backdrop-blur' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="font-display text-lg font-bold text-ink">
          {profile.name.split(' ').slice(-1)[0]}
          <span className="grad-text">.dev</span>
        </Link>

        {/* Desktop */}
        <ul className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={`/${l.href}`} className="text-sm text-ink-soft transition hover:text-ink">
                {t(l.key)}
              </a>
            </li>
          ))}
          <li className="flex items-center gap-2">
            <ThemeToggle />
            <LangToggle />
          </li>
          <li>
            <a href="/#contact" className="btn-primary !px-4 !py-2 text-sm">
              {t('nav.cta')}
            </a>
          </li>
        </ul>

        {/* Mobile: toggles + menu */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <LangToggle />
          <button className="text-ink" onClick={() => setOpen(!open)} aria-label="Menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <ul className="space-y-1 border-t border-line bg-night/95 px-6 pb-4 pt-2 backdrop-blur md:hidden">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={`/${l.href}`}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2 text-ink-soft hover:bg-surface hover:text-ink"
              >
                {t(l.key)}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  )
}
