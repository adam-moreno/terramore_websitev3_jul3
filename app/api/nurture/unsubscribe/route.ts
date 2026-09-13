/**
 * GET /api/nurture/unsubscribe?email=&token=
 * Marks the lead_nurture row unsubscribed. Token is HMAC of the email using
 * NURTURE_SECRET, BOOKING_API_SECRET, or CRON_SECRET (first set wins).
 */

import { NextRequest, NextResponse } from "next/server"
import { getServerSupabase } from "@/lib/supabase-server"
import { verifyUnsubscribeToken } from "@/lib/nurture/templates"

export const dynamic = "force-dynamic"

function page(title: string, body: string): NextResponse {
  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title}</title></head>
<body style="margin:0;font-family:Arial,Helvetica,sans-serif;background:#fcf9f8;color:#0f1e2e;">
  <main style="max-width:480px;margin:64px auto;padding:24px;">
    <h1 style="font-size:22px;margin:0 0 12px 0;">${title}</h1>
    <p style="font-size:15px;line-height:1.6;margin:0;">${body}</p>
  </main>
</body>
</html>`
  return new NextResponse(html, { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } })
}

export async function GET(request: NextRequest) {
  const email = (request.nextUrl.searchParams.get("email") || "").trim().toLowerCase()
  const token = (request.nextUrl.searchParams.get("token") || "").trim()

  if (!email || !email.includes("@") || !verifyUnsubscribeToken(email, token)) {
    return page("Link not valid", "This unsubscribe link is missing or expired. Reply to any Terramore email and we will remove you.")
  }

  const supabase = getServerSupabase()
  if (!supabase) {
    return page("Try again later", "We could not update your preference right now. Reply to any Terramore email and we will remove you.")
  }

  const { error } = await supabase
    .from("lead_nurture")
    .update({ unsubscribed_at: new Date().toISOString() })
    .eq("email", email)
    .is("unsubscribed_at", null)

  if (error) {
    console.error("[nurture] unsubscribe failed:", error.message)
    return page("Try again later", "We could not update your preference right now. Reply to any Terramore email and we will remove you.")
  }

  return page("You are unsubscribed", "You will not get further nurture follow-up notes from Terramore. Transactional messages about a booking or a report you requested may still arrive.")
}
