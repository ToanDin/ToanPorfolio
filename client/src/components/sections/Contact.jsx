import { useState } from 'react'
import emailjs from '@emailjs/browser'
import SectionTitle from '../ui/SectionTitle.jsx'
import Reveal from '../ui/Reveal.jsx'
import { profile } from '../../data/profile.js'
import { useLang } from '../../lib/i18n.jsx'

// Cấu hình EmailJS — đặt trong client/.env (các biến VITE_* được Vite nhúng lúc build)
const EMAILJS = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
}

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', content: '' })
  const [status, setStatus] = useState('idle') // idle | sending | ok | error
  const { t } = useLang()

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    try {
      await emailjs.send(
        EMAILJS.serviceId,
        EMAILJS.templateId,
        {
          from_name: form.name,
          from_email: form.email,
          message: form.content,
        },
        { publicKey: EMAILJS.publicKey },
      )
      setStatus('ok')
      setForm({ name: '', email: '', content: '' })
    } catch (err) {
      console.error('EmailJS error:', err)
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="section-shell">
      <div className="mx-auto max-w-2xl text-center">
        <Reveal>
          <SectionTitle kicker={t('contact.kicker')} title={t('contact.title')} />
        </Reveal>
        <Reveal delay={100}>
          <p className="-mt-6 mb-10 text-ink-mute">{t('contact.blurb')}</p>
        </Reveal>

        <Reveal delay={200}>
          <form onSubmit={onSubmit} className="card space-y-4 p-6 text-left md:p-8">
            <div className="grid gap-4 md:grid-cols-2">
              <input
                required
                name="name"
                value={form.name}
                onChange={onChange}
                placeholder={t('contact.name')}
                className="input-dark"
                maxLength={100}
              />
              <input
                required
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                placeholder={t('contact.email')}
                className="input-dark"
                maxLength={150}
              />
            </div>
            <textarea
              required
              name="content"
              value={form.content}
              onChange={onChange}
              placeholder={t('contact.message')}
              rows={5}
              className="input-dark resize-none"
              maxLength={2000}
            />
            <button type="submit" disabled={status === 'sending'} className="btn-primary w-full justify-center disabled:opacity-60">
              {status === 'sending' ? t('contact.sending') : t('contact.send')}
            </button>

            {status === 'ok' && (
              <p className="text-center text-sm text-emerald-400">{t('contact.ok')}</p>
            )}
            {status === 'error' && (
              <p className="text-center text-sm text-rose-400">
                {t('contact.error')} {profile.email}
              </p>
            )}
          </form>
        </Reveal>

        <Reveal delay={300}>
          <div className="mt-8 flex justify-center gap-6 text-sm text-ink-mute">
            {profile.socials.github && (
              <a href={profile.socials.github} target="_blank" rel="noreferrer" className="hover:text-ink">GitHub</a>
            )}
            {profile.socials.linkedin && (
              <a href={profile.socials.linkedin} target="_blank" rel="noreferrer" className="hover:text-ink">LinkedIn</a>
            )}
            <a href={`mailto:${profile.email}`} className="hover:text-ink">{profile.email}</a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
