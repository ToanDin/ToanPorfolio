'use client'

import { useEffect, useState } from 'react'

const empty = {
  company: '',
  slug: '',
  shortDescVi: '',
  shortDescEn: '',
  roleVi: '',
  roleEn: '',
  periodVi: '',
  periodEn: '',
  bulletsVi: '',
  bulletsEn: '',
  order: 0,
}

const toLines = (arr) => (arr ?? []).join('\n')
const fromLines = (s) => s.split('\n').map((x) => x.trim()).filter(Boolean)

const slugify = (s) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

/** Form thêm/sửa kinh nghiệm làm việc. Mỗi gạch đầu dòng nhập trên một dòng. */
export default function ExperienceForm({ initial, onSave, onCancel, saving }) {
  const [form, setForm] = useState(empty)

  useEffect(() => {
    if (initial) {
      setForm({
        company: initial.company ?? '',
        slug: initial.slug ?? '',
        shortDescVi: initial.shortDesc?.vi ?? '',
        shortDescEn: initial.shortDesc?.en ?? '',
        roleVi: initial.role?.vi ?? '',
        roleEn: initial.role?.en ?? '',
        periodVi: initial.period?.vi ?? '',
        periodEn: initial.period?.en ?? '',
        bulletsVi: toLines(initial.bullets?.vi),
        bulletsEn: toLines(initial.bullets?.en),
        order: initial.order ?? 0,
      })
    } else {
      setForm(empty)
    }
  }, [initial])

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    onSave({
      company: form.company.trim(),
      slug: form.slug.trim() || slugify(form.company),
      shortDesc: { vi: form.shortDescVi.trim(), en: form.shortDescEn.trim() },
      role: { vi: form.roleVi.trim(), en: form.roleEn.trim() },
      period: { vi: form.periodVi.trim(), en: form.periodEn.trim() },
      bullets: { vi: fromLines(form.bulletsVi), en: fromLines(form.bulletsEn) },
      order: Number(form.order) || 0,
    })
  }

  return (
    <form onSubmit={submit} className="card space-y-4 p-6">
      <h2 className="font-display text-lg font-semibold text-white">
        {initial?.id ? 'Sửa kinh nghiệm' : 'Thêm kinh nghiệm mới'}
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        <input required placeholder="Tên công ty *" className="input-dark" value={form.company} onChange={set('company')} />
        <input placeholder="Slug (tự sinh nếu bỏ trống)" className="input-dark" value={form.slug} onChange={set('slug')} />
      </div>

      <input
        placeholder="Mô tả ngắn (VI) — hiện trên thẻ ngoài trang chủ"
        className="input-dark"
        value={form.shortDescVi}
        onChange={set('shortDescVi')}
        maxLength={300}
      />
      <input
        placeholder="Mô tả ngắn (EN)"
        className="input-dark"
        value={form.shortDescEn}
        onChange={set('shortDescEn')}
        maxLength={300}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <input required placeholder="Chức danh (VI) *" className="input-dark" value={form.roleVi} onChange={set('roleVi')} />
        <input placeholder="Chức danh (EN)" className="input-dark" value={form.roleEn} onChange={set('roleEn')} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <input required placeholder="Thời gian (VI), vd: 06/2025 – 11/2025 *" className="input-dark" value={form.periodVi} onChange={set('periodVi')} />
        <input placeholder="Thời gian (EN), vd: Jun 2025 – Nov 2025" className="input-dark" value={form.periodEn} onChange={set('periodEn')} />
      </div>

      <textarea
        required
        placeholder="Các thành tích (VI) — mỗi gạch đầu dòng một dòng, hiện ở trang chi tiết *"
        rows={6}
        className="input-dark resize-none"
        value={form.bulletsVi}
        onChange={set('bulletsVi')}
      />
      <textarea
        placeholder="Các thành tích (EN) — mỗi gạch đầu dòng một dòng (bỏ trống sẽ hiện bản VI)"
        rows={6}
        className="input-dark resize-none"
        value={form.bulletsEn}
        onChange={set('bulletsEn')}
      />

      <label className="flex items-center gap-2 text-sm text-slate-300">
        Thứ tự:
        <input type="number" className="input-dark !w-20 !py-1" value={form.order} onChange={set('order')} />
      </label>

      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
          {saving ? 'Đang lưu...' : 'Lưu'}
        </button>
        <button type="button" onClick={onCancel} className="btn-ghost">Hủy</button>
      </div>
    </form>
  )
}
