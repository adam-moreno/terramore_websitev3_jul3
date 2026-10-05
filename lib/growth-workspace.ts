/**
 * Growth Workspace CTA on the Digital Footprint success state.
 * Unset (the default) keeps the success state exactly as before, including the redirect home.
 */
function readGrowthWorkspaceUrl(): string | null {
  const raw = process.env.NEXT_PUBLIC_GROWTH_WORKSPACE_URL?.trim()
  if (!raw) return null
  try {
    const url = new URL(raw)
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null
  } catch {
    return null
  }
}

export const GROWTH_WORKSPACE_URL = readGrowthWorkspaceUrl()

/** Where the owner arrived from, as the dashboard reads it (`ACTIVATION_SOURCES` in the Growth Workspace). */
export type GrowthWorkspaceSource = "report_success" | "report_email"

/**
 * The configured workspace URL with `source` set for this entry point. Every other parameter in the configured URL
 * is kept. Null when no workspace URL is configured.
 */
export function growthWorkspaceUrlFor(source: GrowthWorkspaceSource): string | null {
  if (!GROWTH_WORKSPACE_URL) return null
  const url = new URL(GROWTH_WORKSPACE_URL)
  url.searchParams.set("source", source)
  return url.toString()
}
