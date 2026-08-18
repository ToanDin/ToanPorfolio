import { NextResponse } from 'next/server'
import { prisma } from '@/lib/server/prisma.js'
import { getAdmin, unauthorized } from '@/lib/server/auth.js'
import { pickExperienceFields } from '@/lib/server/fields.js'
import { friendlyError } from '@/lib/server/validate.js'
import { serializeExperience } from '@/lib/server/serialize.js'
import { revalidateContent } from '@/lib/server/revalidate.js'

export const dynamic = 'force-dynamic'

const ORDER_BY = [{ order: 'asc' }, { createdAt: 'desc' }]

/** GET /api/experience — public */
export async function GET() {
  try {
    const items = await prisma.experience.findMany({ orderBy: ORDER_BY })
    return NextResponse.json(items.map(serializeExperience))
  } catch (err) {
    console.error('[api/experience] GET:', err.message)
    return NextResponse.json({ message: 'Không đọc được dữ liệu' }, { status: 500 })
  }
}

/** POST /api/experience — admin */
export async function POST(request) {
  if (!(await getAdmin(request))) return unauthorized()
  try {
    const body = await request.json()
    const item = await prisma.experience.create({
      data: pickExperienceFields(body, { create: true }),
    })
    revalidateContent(null, item.slug ?? item.id)
    return NextResponse.json(serializeExperience(item), { status: 201 })
  } catch (err) {
    return NextResponse.json({ message: friendlyError(err) }, { status: 400 })
  }
}
