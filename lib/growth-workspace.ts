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
