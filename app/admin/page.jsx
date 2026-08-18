'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { adminLogin } from '@/lib/api.js'
import { useForceDarkTheme } from '@/lib/theme.jsx'

export default function AdminLogin() {
  useForceDarkTheme()
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await adminLogin(form) // cookie httpOnly được server đặt
      router.replace('/admin/dashboard')
      router.refresh()
    } catch (err) {
      setError(
        err?.response?.status === 429
          ? 'Quá nhiều lần thử — vui lòng đợi ít phút.'
          : err?.response?.data?.message ?? 'Email hoặc mật khẩu không đúng.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <form onSubmit={onSubmit} className="card w-full max-w-sm space-y-4 p-8" aria-labelledby="admin-login-title">
        <h1 id="admin-login-title" className="font-display text-xl font-bold text-white">Admin</h1>
        <label className="block">
          <span className="sr-only">Email</span>
          <input
            required
            type="email"
            autoComplete="username"
            placeholder="Email"
            className="input-dark"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </label>
        <label className="block">
          <span className="sr-only">Mật khẩu</span>
          <input
            required
            type="password"
            autoComplete="current-password"
            placeholder="Mật khẩu"
            className="input-dark"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </label>
        <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-60">
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
        <p role="alert" aria-live="polite" className="min-h-[1.25rem] text-sm text-rose-400">{error}</p>
      </form>
    </div>
  )
}
