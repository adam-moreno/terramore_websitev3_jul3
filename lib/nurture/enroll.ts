import { getServerSupabase } from "@/lib/supabase-server"
import type { NurtureEnrollInput } from "./types"

/**
 * Upsert a lead into the nurture sequence. No-op if that email is already enrolled.
 * Never throws: missing Supabase or table errors are logged and ignored.
 */
export async function enrollLead(input: NurtureEnrollInput): Promise<void> {
  try {
    const email = input.email?.trim().toLowerCase()
    if (!email || !email.includes("@")) return

    const supabase = getServerSupabase()
    if (!supabase) {
      console.info("[nurture] enroll skipped: Supabase not configured", { email, source: input.source })
      return
    }

    const { data: existing, error: selectError } = await supabase
      .from("lead_nurture")
      .select("id")
      .eq("email", email)
      .maybeSingle()

    if (selectError) {
      console.error("[nurture] enroll select failed:", selectError.message)
      return
    }
    if (existing?.id) return

    const { error: insertError } = await supabase.from("lead_nurture").insert([
      {
        email,
        name: input.name?.trim() || null,
        source: input.source,
        business_type: input.businessType?.trim() || null,
        job: input.job?.trim() || null,
        business_name: input.businessName?.trim() || null,
        website: input.website?.trim() || null,
        enrolled_at: new Date().toISOString(),
      },
    ])

    if (insertError) {
      // Unique race: another request enrolled the same email. Treat as success.
      if (insertError.code === "23505") return
      console.error("[nurture] enroll insert failed:", insertError.message)
    }
  } catch (error) {
    console.error("[nurture] enroll threw:", error instanceof Error ? error.message : error)
  }
}
