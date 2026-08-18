import { NextResponse } from 'next/server'
import { prisma } from '@/lib/server/prisma.js'
import { getAdmin, unauthorized } from '@/lib/server/auth.js'
import { pickExperienceFields } from '@/lib/server/fields.js'
import { friendlyError, isUuid } from '@/lib/server/validate.js'
import { serializeExperience } from '@/lib/server/serialize.js'
import { revalidateContent } from '@/lib/server/revalidate.js'

export const dynamic = 'force-dynamic'

const notFound = () => NextResponse.json({ message: 'Không tìm thấy kinh nghiệm' }, { status: 404 })

/** GET /api/experience/:slug — public (fallback tìm theo id nếu là uuid) */
export async function GET(request, { params }) {
  const key = params.key
  try {
    let item = await prisma.experience.findUnique({ where: { slug: key } })
    if (!item && isUuid(key)) {
      item = await prisma.experience.findUnique({ where: { id: key } })
    }
    if (!item) return notFound()
    return NextResponse.json(serializeExperience(item))
  } catch (err) {
    console.error('[api/experience/:key] GET:', err.message)
    return NextResponse.json({ message: 'Không đọc được dữ liệu' }, { status: 500 })
  }
}

/** PUT /api/experience/:id — admin */
export async function PUT(request, { params }) {
  if (!(await getAdmin(request))) return unauthorized()
  if (!isUuid(params.key)) return notFound()
  try {
    const body = await request.json()
    const item = await prisma.experience.update({
      where: { id: params.key },
      data: pickExperienceFields(body, { create: false }),
    })
    revalidateContent(null, item.slug ?? item.id)
    return NextResponse.json(serializeExperience(item))
  } catch (err) {
    if (err?.code === 'P2025') return notFound()
    return NextResponse.json({ message: friendlyError(err) }, { status: 400 })
  }
}

/** DELETE /api/experience/:id — admin */
export async function DELETE(request, { params }) {
  if (!(await getAdmin(request))) return unauthorized()
  if (!isUuid(params.key)) return notFound()
  try {
    const deleted = await prisma.experience.delete({ where: { id: params.key } })
    revalidateContent(null, deleted.slug ?? deleted.id)
    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err?.code === 'P2025') return notFound()
    return NextResponse.json({ message: friendlyError(err) }, { status: 400 })
  }
}
