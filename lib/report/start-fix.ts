/**
 * "Fix this" on the website check (owner direction 2026-10-13): the gap the visitor tapped travels with their report
 * request, so the report and the Growth Workspace open on that fix. Pure; mirrors FIXABLE in lib/report/recommend.ts
 * and the dashboard's FIXABLE_REPORT_IDS.
 */

/** Website-check finding id → the report action that fixes it. Only gaps Fix it for me can take on. */
export const FIX_FOR_FINDING: Readonly<Record<string, string>> = {
  "search_basics.no_description": "missing_meta",
  "search_basics.no_sitemap": "missing_sitemap",
  "measurement.none": "no_measurement",
  "website.no_cta": "no_cta",
  "contact.no_phone": "weak_contact",
  "social.none": "no_social_links",
}

const START_FIXES = new Set(Object.values(FIX_FOR_FINDING))

/** A requested start fix, or null for anything else (never trust the browser's value). */
export function parseStartFix(raw: unknown): string | null {
  return typeof raw === "string" && START_FIXES.has(raw) ? raw : null
}
