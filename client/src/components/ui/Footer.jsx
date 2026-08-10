import { profile } from '../../data/profile.js'

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-8 text-center text-sm text-slate-500">
      <p>
        © {new Date().getFullYear()} {profile.name} — Xây bằng React, Three.js & Node.js
      </p>
    </footer>
  )
}
