import { NextResponse } from 'next/server'
import { prisma } from '@/lib/server/prisma.js'
import { getAdmin, unauthorized } from '@/lib/server/auth.js'
import { pickProjectFields } from '@/lib/server/fields.js'
import { friendlyError } from '@/lib/server/validate.js'

export const dynamic = 'force-dynamic'

const ORDER_BY = [{ order: 'asc' }, { createdAt: 'desc' }]

/** GET /api/projects?featured=true — public */
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const where = searchParams.get('featured') === 'true' ? { featured: true } : {}
  const projects = await prisma.project.findMany({ where, orderBy: ORDER_BY })
  return NextResponse.json(projects)
}

/** POST /api/projects — admin */
export async function POST(request) {
  if (!getAdmin(request)) return unauthorized()
  try {
    const body = await request.json()
    const project = await prisma.project.create({ data: pickProjectFields(body, { create: true }) })
    return NextResponse.json(project, { status: 201 })
  } catch (err) {
    return NextResponse.json({ message: friendlyError(err) }, { status: 400 })
  }
}
