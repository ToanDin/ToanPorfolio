import { NextResponse } from 'next/server'
import { prisma } from '@/lib/server/prisma.js'
import { getAdmin, unauthorized } from '@/lib/server/auth.js'
import { pickProjectFields } from '@/lib/server/fields.js'
import { friendlyError, isUuid } from '@/lib/server/validate.js'
import { revalidateContent } from '@/lib/server/revalidate.js'

export const dynamic = 'force-dynamic'

const notFound = () => NextResponse.json({ message: 'Không tìm thấy dự án' }, { status: 404 })

/** GET /api/projects/:slug — public, tìm theo slug */
export async function GET(request, { params }) {
  try {
    const project = await prisma.project.findUnique({ where: { slug: params.key } })
    if (!project) return notFound()
    return NextResponse.json(project)
  } catch (err) {
    console.error('[api/projects/:key] GET:', err.message)
    return NextResponse.json({ message: 'Không đọc được dữ liệu' }, { status: 500 })
  }
}

/** PUT /api/projects/:id — admin */
export async function PUT(request, { params }) {
  if (!(await getAdmin(request))) return unauthorized()
  if (!isUuid(params.key)) return notFound()
  try {
    const body = await request.json()
    const project = await prisma.project.update({
      where: { id: params.key },
      data: pickProjectFields(body, { create: false }),
    })
    revalidateContent(project.slug)
    return NextResponse.json(project)
  } catch (err) {
    if (err?.code === 'P2025') return notFound()
    return NextResponse.json({ message: friendlyError(err) }, { status: 400 })
  }
}

/** DELETE /api/projects/:id — admin */
export async function DELETE(request, { params }) {
  if (!(await getAdmin(request))) return unauthorized()
  if (!isUuid(params.key)) return notFound()
  try {
    const deleted = await prisma.project.delete({ where: { id: params.key } })
    revalidateContent(deleted.slug)
    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err?.code === 'P2025') return notFound()
    return NextResponse.json({ message: friendlyError(err) }, { status: 400 })
  }
}
