import { NextResponse } from 'next/server'
import { prisma } from '@/lib/server/prisma.js'
import { getAdmin, unauthorized } from '@/lib/server/auth.js'
import { pickExperienceFields } from '@/lib/server/fields.js'
import { friendlyError, isUuid } from '@/lib/server/validate.js'
import { serializeExperience } from '@/lib/server/serialize.js'

export const dynamic = 'force-dynamic'

const notFound = () => NextResponse.json({ message: 'Không tìm thấy kinh nghiệm' }, { status: 404 })

/** GET /api/experience/:slug — public (fallback tìm theo id nếu là uuid) */
export async function GET(request, { params }) {
  const key = params.key
  let item = await prisma.experience.findUnique({ where: { slug: key } })
  if (!item && isUuid(key)) {
    item = await prisma.experience.findUnique({ where: { id: key } })
  }
  if (!item) return notFound()
  return NextResponse.json(serializeExperience(item))
}

/** PUT /api/experience/:id — admin */
export async function PUT(request, { params }) {
  if (!getAdmin(request)) return unauthorized()
  if (!isUuid(params.key)) return notFound()
  try {
    const body = await request.json()
    const item = await prisma.experience.update({
      where: { id: params.key },
      data: pickExperienceFields(body, { create: false }),
    })
    return NextResponse.json(serializeExperience(item))
  } catch (err) {
    if (err?.code === 'P2025') return notFound()
    return NextResponse.json({ message: friendlyError(err) }, { status: 400 })
  }
}

/** DELETE /api/experience/:id — admin */
export async function DELETE(request, { params }) {
  if (!getAdmin(request)) return unauthorized()
  if (!isUuid(params.key)) return notFound()
  try {
    await prisma.experience.delete({ where: { id: params.key } })
    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err?.code === 'P2025') return notFound()
    return NextResponse.json({ message: friendlyError(err) }, { status: 400 })
  }
}
