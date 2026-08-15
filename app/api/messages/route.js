import { NextResponse } from 'next/server'
import { prisma } from '@/lib/server/prisma.js'
import { getAdmin, unauthorized } from '@/lib/server/auth.js'

export const dynamic = 'force-dynamic'

/** GET /api/messages — admin, mới nhất trước */
export async function GET(request) {
  if (!getAdmin(request)) return unauthorized()
  const messages = await prisma.message.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(messages)
}
