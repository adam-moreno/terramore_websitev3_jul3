import { createClient, type SupabaseClient } from "@supabase/supabase-js"

/**
 * Server-only Supabase client for the two lead tables.
 *
 * Env:
 * - NEXT_PUBLIC_SUPABASE_URL      project URL
 * - SUPABASE_SERVICE_ROLE_KEY     service role key (server only, never in the browser)
 * - SUPABASE_SCHEMA               optional. "public" (default) or "website" if the tables were
 *                                 created with supabase-website-migration.sql. The schema must also be
 *                                 listed under Project Settings → API → Exposed schemas.
 */
export function getServerSupabase(): SupabaseClient<any, string, any> | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null

  const schema = process.env.SUPABASE_SCHEMA?.trim() || "public"
  return createClient(url, key, {
    db: { schema },
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

/** Link to the table in the Supabase dashboard, used in Slack alerts. Empty string when the URL is unknown. */
export function supabaseTableUrl(table: string): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const ref = url?.match(/^https?:\/\/([a-z0-9-]+)\.supabase\.co/i)?.[1]
  if (!ref) return ""
  const schema = process.env.SUPABASE_SCHEMA?.trim() || "public"
  return `https://supabase.com/dashboard/project/${ref}/editor?schema=${schema}&table=${table}`
}

/** PostgREST reports an unknown column as PGRST204 (schema cache). Used to fall back when a migration has not run. */
export function isMissingColumnError(error: { code?: string; message?: string } | null | undefined): boolean {
  if (!error) return false
  return error.code === "PGRST204" || /column .* does not exist|schema cache/i.test(error.message || "")
}
