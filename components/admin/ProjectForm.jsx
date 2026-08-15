'use client'

import { useEffect, useState } from 'react'

const empty = {
  title: '',
  slug: '',
  shortDesc: '',
  description: '',
  techStack: '',
  thumbnail: '',
  images: '',
  liveUrl: '',
  repoUrl: '',
  featured: false,
  order: 0,
}

/** Form thêm/sửa project. techStack & images nhập dạng chuỗi, phân tách bằng dấu phẩy. */
export default function ProjectForm({ initial, onSave, onCancel, saving }) {
  const [form, setForm] = useState(empty)

  useEffect(() => {
    if (initial) {
      setForm({
        ...empty,
        ...initial,
        techStack: (initial.techStack ?? []).join(', '),
        images: (initial.images ?? []).join(', '),
      })
    } else {
      setForm(empty)
    }
  }, [initial])

  const set = (key) => (e) =>
    setForm({ ...form, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })

  const submit = (e) => {
    e.preventDefault()
    onSave({
      ...form,
      slug:
        form.slug ||
        form.title
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/đ/g, 'd')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, ''),
      techStack: form.techStack.split(',').map((s) => s.trim()).filter(Boolean),
      images: form.images.split(',').map((s) => s.trim()).filter(Boolean),
      order: Number(form.order) || 0,
    })
  }

  return (
    <form onSubmit={submit} className="card space-y-4 p-6">
      <h2 className="font-display text-lg font-semibold text-white">
        {initial?.id ? 'Sửa dự án' : 'Thêm dự án mới'}
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        <input required placeholder="Tên dự án *" className="input-dark" value={form.title} onChange={set('title')} />
        <input placeholder="Slug (tự sinh nếu bỏ trống)" className="input-dark" value={form.slug} onChange={set('slug')} />
      </div>

      <input required placeholder="Mô tả ngắn (hiện trên card) *" className="input-dark" value={form.shortDesc} onChange={set('shortDesc')} />

      <textarea
        placeholder="Mô tả chi tiết (mỗi đoạn một dòng)"
        rows={5}
        className="input-dark resize-none"
        value={form.description}
        onChange={set('description')}
      />

      <input placeholder="Tech stack, phân tách bằng dấu phẩy: React, Node.js, PostgreSQL" className="input-dark" value={form.techStack} onChange={set('techStack')} />

      <div className="grid gap-4 md:grid-cols-2">
        <input placeholder="URL ảnh thumbnail" className="input-dark" value={form.thumbnail} onChange={set('thumbnail')} />
        <input placeholder="URL các ảnh khác, phân tách dấu phẩy" className="input-dark" value={form.images} onChange={set('images')} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <input placeholder="Link live demo" className="input-dark" value={form.liveUrl} onChange={set('liveUrl')} />
        <input placeholder="Link GitHub repo" className="input-dark" value={form.repoUrl} onChange={set('repoUrl')} />
      </div>

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 text-sm text-slate-300">
          <input type="checkbox" checked={form.featured} onChange={set('featured')} className="accent-accent" />
          Dự án nổi bật
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-300">
          Thứ tự:
          <input type="number" className="input-dark !w-20 !py-1" value={form.order} onChange={set('order')} />
        </label>
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
          {saving ? 'Đang lưu...' : 'Lưu'}
        </button>
        <button type="button" onClick={onCancel} className="btn-ghost">Hủy</button>
      </div>
    </form>
  )
}
