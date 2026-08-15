import { NextResponse } from 'next/server'
import { prisma } from '@/lib/server/prisma.js'
import { getAdmin, unauthorized } from '@/lib/server/auth.js'
import { pickProjectFields } from '@/lib/server/fields.js'
import { friendlyError, isUuid } from '@/lib/server/validate.js'

export const dynamic = 'force-dynamic'

const notFound = () => NextResponse.json({ message: 'Không tìm thấy dự án' }, { status: 404 })

/** GET /api/projects/:slug — public, tìm theo slug */
export async function GET(request, { params }) {
  const project = await prisma.project.findUnique({ where: { slug: params.key } })
  if (!project) return notFound()
  return NextResponse.json(project)
}

/** PUT /api/projects/:id — admin */
export async function PUT(request, { params }) {
  if (!getAdmin(request)) return unauthorized()
  if (!isUuid(params.key)) return notFound()
  try {
    const body = await request.json()
    const project = await prisma.project.update({
      where: { id: params.key },
      data: pickProjectFields(body, { create: false }),
    })
    return NextResponse.json(project)
  } catch (err) {
    if (err?.code === 'P2025') return notFound()
    return NextResponse.json({ message: friendlyError(err) }, { status: 400 })
  }
}

/** DELETE /api/projects/:id — admin */
export async function DELETE(request, { params }) {
  if (!getAdmin(request)) return unauthorized()
  if (!isUuid(params.key)) return notFound()
  try {
    await prisma.project.delete({ where: { id: params.key } })
    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err?.code === 'P2025') return notFound()
    return NextResponse.json({ message: friendlyError(err) }, { status: 400 })
  }
}
