import { createHash } from "node:crypto"

/**
 * Server-only. Opaque analytics reference for a saved row, sent to GA4/Ads as `transaction_id` / `booking_id`.
 * A one-way hash of a namespaced random UUID (gen_random_uuid), so the browser and analytics never see the row id,
 * while Terramore can recompute the reference from the id to reconcile GA4/Ads counts with the tables.
 * Format: 32 lowercase hex characters (checked client-side in lib/analytics.ts).
 */
export function analyticsRef(namespace: "terramore-report" | "terramore-booking", id: string): string {
  return createHash("sha256").update(`${namespace}:${id}`).digest("hex").slice(0, 32)
}
