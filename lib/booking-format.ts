/** Date helpers shared by the booking UI and the confirmation messages. Safe on server and client. */

export const OWNER_TZ = "America/Los_Angeles"

export function browserTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"
  } catch {
    return "UTC"
  }
}

/** "Tue, Sep 15" */
export function formatDay(iso: string, tz: string): string {
  return new Intl.DateTimeFormat("en-US", { timeZone: tz, weekday: "short", month: "short", day: "numeric" }).format(new Date(iso))
}

/** "Tuesday, September 15" */
export function formatLongDay(iso: string, tz: string): string {
  return new Intl.DateTimeFormat("en-US", { timeZone: tz, weekday: "long", month: "long", day: "numeric" }).format(new Date(iso))
}

/** "9:30 AM" */
export function formatTime(iso: string, tz: string): string {
  return new Intl.DateTimeFormat("en-US", { timeZone: tz, hour: "numeric", minute: "2-digit" }).format(new Date(iso))
}

/** "Tuesday, September 15 at 9:30 AM PDT" */
export function formatWhen(iso: string, tz: string): string {
  const day = formatLongDay(iso, tz)
  const time = new Intl.DateTimeFormat("en-US", { timeZone: tz, hour: "numeric", minute: "2-digit", timeZoneName: "short" }).format(new Date(iso))
  return `${day} at ${time}`
}

/** "PDT" or "GMT+2" */
export function tzLabel(tz: string, iso?: string): string {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: tz, timeZoneName: "short" }).formatToParts(iso ? new Date(iso) : new Date())
  return parts.find((p) => p.type === "timeZoneName")?.value || tz
}

/** "YYYY-MM-DD" in a time zone, used to group slots into days. */
export function dayKey(iso: string, tz: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date(iso))
  const get = (t: string) => parts.find((p) => p.type === t)?.value || ""
  return `${get("year")}-${get("month")}-${get("day")}`
}

export function groupSlotsByDay(slots: string[], tz: string): { key: string; label: string; slots: string[] }[] {
  const map = new Map<string, string[]>()
  for (const iso of slots) {
    const key = dayKey(iso, tz)
    const list = map.get(key) || []
    list.push(iso)
    map.set(key, list)
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([key, list]) => ({ key, label: formatDay(list[0], tz), slots: list }))
}
