import { profile } from '../../data/profile.js'
import { useLang } from '../../lib/i18n.jsx'

export default function Footer() {
  const { t } = useLang()
  return (
    <footer className="border-t border-line py-8 text-center text-sm text-ink-mute">
      <p>
        © {new Date().getFullYear()} {profile.name} — {t('footer.built')}
      </p>
    </footer>
  )
}
