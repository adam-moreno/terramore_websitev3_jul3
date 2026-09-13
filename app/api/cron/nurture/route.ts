/**
 * GET or POST /api/cron/nurture
 *
 * Auth (CRON_SECRET must be set; otherwise 503):
 * - Authorization: Bearer ${CRON_SECRET}  (Vercel Cron sends this automatically when CRON_SECRET is configured)
 * - or ?secret=${CRON_SECRET}
 *
 * Schedule: vercel.json cron daily at 16:00 UTC (~9am PT).
 */

import { NextRequest, NextResponse } from "next/server"
import { processNurtureQueue } from "@/lib/nurture/process"

export const dynamic = "force-dynamic"
export const maxDuration = 60

function authorized(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET?.trim()
  if (!secret) return false

  const header = request.headers.get("authorization") || ""
  if (header === `Bearer ${secret}`) return true

  const query = request.nextUrl.searchParams.get("secret")
  if (query && query === secret) return true

  return false
}

async function handle(request: NextRequest) {
  if (!process.env.CRON_SECRET?.trim()) {
    return NextResponse.json({ error: "CRON_SECRET unset" }, { status: 503 })
  }
  if (!authorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  const result = await processNurtureQueue()
  return NextResponse.json(result, { status: result.ok ? 200 : 500 })
}

export async function GET(request: NextRequest) {
  return handle(request)
}

export async function POST(request: NextRequest) {
  return handle(request)
}
