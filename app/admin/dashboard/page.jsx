'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ProjectForm from '@/components/admin/ProjectForm.jsx'
import ExperienceForm from '@/components/admin/ExperienceForm.jsx'
import {
  fetchProjects,
  createProject,
  updateProject,
  deleteProject,
  fetchMessages,
  markMessageRead,
  deleteMessage,
  adminLogout,
  fetchExperience,
  createExperience,
  updateExperience,
  deleteExperience,
} from '@/lib/api.js'
import { useForceDarkTheme } from '@/lib/theme.jsx'

export default function AdminDashboard() {
  useForceDarkTheme()
  const router = useRouter()
  const [tab, setTab] = useState('projects') // projects | experience | messages
  const [projects, setProjects] = useState([])
  const [experience, setExperience] = useState([])
  const [messages, setMessages] = useState([])
  const [editing, setEditing] = useState(null) // null | {} (new) | project
  const [editingExp, setEditingExp] = useState(null) // null | {} (new) | experience
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const logout = async () => {
    try {
      await adminLogout()
    } catch {
      /* cookie có thể đã hết hạn — vẫn quay về login */
    }
    router.replace('/admin')
    router.refresh()
  }

  const load = async () => {
    try {
      const [ps, es, ms] = await Promise.all([fetchProjects(), fetchExperience(), fetchMessages()])
      setProjects(ps)
      setExperience(es)
      setMessages(ms)
    } catch (err) {
      // Token hết hạn / chưa đăng nhập → quay về login
      if (err?.response?.status === 401) return logout()
      setError('Không tải được dữ liệu. Backend đã chạy chưa?')
    }
  }

  useEffect(() => {
    // middleware.js đã chặn người chưa đăng nhập; API trả 401 nếu phiên hết hạn
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onToggleRead = async (m) => {
    try {
      await markMessageRead(m.id, !m.read)
      setMessages((prev) => prev.map((x) => (x.id === m.id ? { ...x, read: !m.read } : x)))
    } catch (err) {
      if (err?.response?.status === 401) return logout()
      setError('Cập nhật thất bại.')
    }
  }

  const onDeleteMessage = async (m) => {
    if (!window.confirm(`Xóa tin nhắn của "${m.name}"?`)) return
    try {
      await deleteMessage(m.id)
      setMessages((prev) => prev.filter((x) => x.id !== m.id))
    } catch (err) {
      if (err?.response?.status === 401) return logout()
      setError('Xóa thất bại.')
    }
  }

  const onSave = async (data) => {
    setSaving(true)
    setError('')
    try {
      if (editing?.id) {
        await updateProject(editing.id, data)
      } else {
        await createProject(data)
      }
      setEditing(null)
      await load()
    } catch (err) {
      if (err?.response?.status === 401) return logout()
      setError(err?.response?.data?.message ?? 'Lưu thất bại.')
    } finally {
      setSaving(false)
    }
  }

  const onDelete = async (p) => {
    if (!window.confirm(`Xóa dự án "${p.title}"?`)) return
    try {
      await deleteProject(p.id)
      await load()
    } catch (err) {
      if (err?.response?.status === 401) return logout()
      setError('Xóa thất bại.')
    }
  }

  const onSaveExp = async (data) => {
    setSaving(true)
    setError('')
    try {
      if (editingExp?.id) {
        await updateExperience(editingExp.id, data)
      } else {
        await createExperience(data)
      }
      setEditingExp(null)
      await load()
    } catch (err) {
      if (err?.response?.status === 401) return logout()
      setError(err?.response?.data?.message ?? 'Lưu thất bại.')
    } finally {
      setSaving(false)
    }
  }

  const onDeleteExp = async (item) => {
    if (!window.confirm(`Xóa kinh nghiệm tại "${item.company}"?`)) return
    try {
      await deleteExperience(item.id)
      await load()
    } catch (err) {
      if (err?.response?.status === 401) return logout()
      setError('Xóa thất bại.')
    }
  }

  const tabBtn = (key, label) => (
    <button
      onClick={() => setTab(key)}
      className={`rounded-full px-5 py-2 text-sm font-medium transition ${
        tab === key ? 'bg-accent text-white' : 'bg-white/5 text-slate-300 hover:bg-white/10'
      }`}
    >
      {label}
    </button>
  )

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold text-white">Dashboard</h1>
          <button onClick={logout} className="btn-ghost !px-4 !py-2 text-sm">Đăng xuất</button>
        </header>

        <div className="mb-6 flex flex-wrap gap-2">
          {tabBtn('projects', `Dự án (${projects.length})`)}
          {tabBtn('experience', `Kinh nghiệm (${experience.length})`)}
          {tabBtn('messages', `Tin nhắn (${messages.filter((m) => !m.read).length}/${messages.length})`)}
        </div>

        {error && <p className="mb-4 text-sm text-rose-400">{error}</p>}

        {tab === 'projects' && (
          <div className="space-y-6">
            {editing !== null ? (
              <ProjectForm
                initial={editing?.id ? editing : null}
                onSave={onSave}
                onCancel={() => setEditing(null)}
                saving={saving}
              />
            ) : (
              <button onClick={() => setEditing({})} className="btn-primary">+ Thêm dự án</button>
            )}

            <div className="space-y-3">
              {projects.map((p) => (
                <div key={p.id} className="card flex items-center justify-between gap-4 p-4">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-white">
                      {p.title}{' '}
                      {p.featured && <span className="ml-1 text-xs text-accent2">★ nổi bật</span>}
                    </p>
                    <p className="truncate text-sm text-slate-400">/{p.slug} · thứ tự {p.order}</p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button onClick={() => setEditing(p)} className="rounded-lg bg-white/5 px-3 py-1.5 text-sm text-slate-200 hover:bg-white/10">
                      Sửa
                    </button>
                    <button onClick={() => onDelete(p)} className="rounded-lg bg-rose-500/10 px-3 py-1.5 text-sm text-rose-300 hover:bg-rose-500/20">
                      Xóa
                    </button>
                  </div>
                </div>
              ))}
              {projects.length === 0 && (
                <p className="text-sm text-slate-500">Chưa có dự án nào — thêm dự án đầu tiên đi!</p>
              )}
            </div>
          </div>
        )}

        {tab === 'experience' && (
          <div className="space-y-6">
            {editingExp !== null ? (
              <ExperienceForm
                initial={editingExp?.id ? editingExp : null}
                onSave={onSaveExp}
                onCancel={() => setEditingExp(null)}
                saving={saving}
              />
            ) : (
              <button onClick={() => setEditingExp({})} className="btn-primary">+ Thêm kinh nghiệm</button>
            )}

            <div className="space-y-3">
              {experience.map((item) => (
                <div key={item.id} className="card flex items-center justify-between gap-4 p-4">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-white">{item.company}</p>
                    <p className="truncate text-sm text-slate-400">
                      {item.role?.vi} · {item.period?.vi} · thứ tự {item.order}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button onClick={() => setEditingExp(item)} className="rounded-lg bg-white/5 px-3 py-1.5 text-sm text-slate-200 hover:bg-white/10">
                      Sửa
                    </button>
                    <button onClick={() => onDeleteExp(item)} className="rounded-lg bg-rose-500/10 px-3 py-1.5 text-sm text-rose-300 hover:bg-rose-500/20">
                      Xóa
                    </button>
                  </div>
                </div>
              ))}
              {experience.length === 0 && (
                <p className="text-sm text-slate-500">Chưa có kinh nghiệm nào — thêm mục đầu tiên đi!</p>
              )}
            </div>
          </div>
        )}

        {tab === 'messages' && (
          <div className="space-y-3">
            {messages.map((m) => (
              <div key={m.id} className={`card p-4 ${m.read ? 'opacity-70' : ''}`}>
                <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-medium text-white">
                    {!m.read && <span className="mr-2 inline-block h-2 w-2 rounded-full bg-accent2" aria-label="Chưa đọc" />}
                    {m.name} <span className="text-sm font-normal text-slate-400">&lt;{m.email}&gt;</span>
                  </p>
                  <p className="text-xs text-slate-500">
                    {m.createdAt ? new Date(m.createdAt).toLocaleString('vi-VN') : ''}
                  </p>
                </div>
                <p className="whitespace-pre-wrap text-sm text-slate-300">{m.content}</p>
                <div className="mt-3 flex gap-2">
                  <a href={`mailto:${m.email}`} className="rounded-lg bg-white/5 px-3 py-1.5 text-sm text-slate-200 hover:bg-white/10">
                    Trả lời
                  </a>
                  <button onClick={() => onToggleRead(m)} className="rounded-lg bg-white/5 px-3 py-1.5 text-sm text-slate-200 hover:bg-white/10">
                    {m.read ? 'Đánh dấu chưa đọc' : 'Đã đọc'}
                  </button>
                  <button onClick={() => onDeleteMessage(m)} className="rounded-lg bg-rose-500/10 px-3 py-1.5 text-sm text-rose-300 hover:bg-rose-500/20">
                    Xóa
                  </button>
                </div>
              </div>
            ))}
            {messages.length === 0 && <p className="text-sm text-slate-500">Chưa có tin nhắn nào.</p>}
          </div>
        )}
      </div>
    </div>
  )
}
