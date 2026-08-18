'use client'

import { useRef, useState } from 'react'
import emailjs from '@emailjs/browser'
import { sendContact } from '@/lib/api.js'
import SectionTitle from '@/components/ui/SectionTitle.jsx'
import Reveal from '@/components/ui/Reveal.jsx'
import { profile } from '@/data/profile.js'
import { useLang } from '@/lib/i18n.jsx'

// Cấu hình EmailJS — biến NEXT_PUBLIC_* được nhúng vào bundle (public key, không phải bí mật).
// Nhớ bật "Allowed domains" trong EmailJS dashboard để người khác không dùng chùa quota.
const EMAILJS = {
  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
  templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
}
const emailjsEnabled = Boolean(EMAILJS.serviceId && EMAILJS.templateId && EMAILJS.publicKey)

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', content: '', website: '' })
  const [status, setStatus] = useState('idle') // idle | sending | ok | error | tooMany
  const startedAt = useRef(0)
  const { t } = useLang()

  const onChange = (e) => {
    if (!startedAt.current) startedAt.current = Date.now()
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')

    // 1) Lưu vào DB (hiện trong trang admin) — đây là kênh chính, lỗi thì báo người dùng
    try {
      await sendContact({ ...form, elapsedMs: startedAt.current ? Date.now() - startedAt.current : 0 })
    } catch (err) {
      setStatus(err?.response?.status === 429 ? 'tooMany' : 'error')
      return
    }

    // 2) Gửi email qua EmailJS (tuỳ chọn) — thất bại không làm mất tin nhắn đã lưu
    if (emailjsEnabled) {
      try {
        await emailjs.send(
          EMAILJS.serviceId,
          EMAILJS.templateId,
          { from_name: form.name, from_email: form.email, message: form.content },
          { publicKey: EMAILJS.publicKey },
        )
      } catch (err) {
        console.error('EmailJS error:', err)
      }
    }

    setStatus('ok')
    setForm({ name: '', email: '', content: '', website: '' })
    startedAt.current = 0
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
          <form onSubmit={onSubmit} className="card relative space-y-4 p-6 text-left md:p-8">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="sr-only">{t('contact.name')}</span>
                <input
                  required
                  name="name"
                  autoComplete="name"
                  value={form.name}
                  onChange={onChange}
                  placeholder={t('contact.name')}
                  className="input-dark"
                  maxLength={100}
                />
              </label>
              <label className="block">
                <span className="sr-only">{t('contact.email')}</span>
                <input
                  required
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={onChange}
                  placeholder={t('contact.email')}
                  className="input-dark"
                  maxLength={150}
                />
              </label>
            </div>
            <label className="block">
              <span className="sr-only">{t('contact.message')}</span>
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
            </label>

            {/* Honeypot: ẩn với người thật, bot tự điền → server bỏ qua */}
            <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
              <label>
                Website
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={onChange}
                />
              </label>
            </div>

            <button type="submit" disabled={status === 'sending'} className="btn-primary w-full justify-center disabled:opacity-60">
              {status === 'sending' ? t('contact.sending') : t('contact.send')}
            </button>

            <p role="status" aria-live="polite" className="min-h-[1.25rem] text-center text-sm">
              {status === 'ok' && <span className="text-emerald-400">{t('contact.ok')}</span>}
              {status === 'error' && (
                <span className="text-rose-400">
                  {t('contact.error')} <a className="underline" href={`mailto:${profile.email}`}>{profile.email}</a>
                </span>
              )}
              {status === 'tooMany' && (
                <span className="text-amber-400">
                  {t('contact.tooMany')} <a className="underline" href={`mailto:${profile.email}`}>{profile.email}</a>
                </span>
              )}
            </p>
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
