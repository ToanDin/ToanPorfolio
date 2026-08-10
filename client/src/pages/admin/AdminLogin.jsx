import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminLogin } from '../../lib/api.js'
import { useForceDarkTheme } from '../../lib/theme.jsx'

export default function AdminLogin() {
  useForceDarkTheme()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { token } = await adminLogin(form)
      localStorage.setItem('admin_token', token)
      navigate('/admin/dashboard')
    } catch {
      setError('Email hoặc mật khẩu không đúng.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <form onSubmit={onSubmit} className="card w-full max-w-sm space-y-4 p-8">
        <h1 className="font-display text-xl font-bold text-white">Admin</h1>
        <input
          required
          type="email"
          placeholder="Email"
          className="input-dark"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          required
          type="password"
          placeholder="Mật khẩu"
          className="input-dark"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-60">
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
        {error && <p className="text-sm text-rose-400">{error}</p>}
      </form>
    </div>
  )
}
