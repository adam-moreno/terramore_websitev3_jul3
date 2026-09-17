/** MVP: no Playwright/Chromium. Returns Not available. */
export function collectMobile() {
  return {
    available: false as const,
    note: "Mobile layout checks: Not available in this report version (no browser automation in MVP).",
  }
}
