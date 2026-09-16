/** Builds a one-event .ics file. Pure string work, so it runs in the browser for the download button. */

function icsDate(iso: string): string {
  return new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z")
}

function escapeText(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/[,;]/g, (c) => `\\${c}`)
}

export type CalendarEventInput = {
  uid: string
  startIso: string
  endIso: string
  title: string
  description: string
  url?: string | null
}

export function buildIcs(input: CalendarEventInput): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Terramore//Booking//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${input.uid}@terramore.io`,
    `DTSTAMP:${icsDate(new Date().toISOString())}`,
    `DTSTART:${icsDate(input.startIso)}`,
    `DTEND:${icsDate(input.endIso)}`,
    `SUMMARY:${escapeText(input.title)}`,
    `DESCRIPTION:${escapeText(input.description)}`,
    input.url ? `LOCATION:${escapeText(input.url)}` : "",
    input.url ? `URL:${input.url}` : "",
    "BEGIN:VALARM",
    "TRIGGER:-PT1H",
    "ACTION:DISPLAY",
    "DESCRIPTION:Terramore call in one hour",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean)
  return lines.join("\r\n") + "\r\n"
}

/** Google Calendar “template” deep link. Works well on Android Chrome; on iOS opens Google Calendar if installed / web. */
export function googleCalendarUrl(input: CalendarEventInput): string {
  const start = icsDate(input.startIso)
  const end = icsDate(input.endIso)
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: input.title,
    dates: `${start}/${end}`,
    details: input.description,
  })
  if (input.url) params.set("location", input.url)
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

/** Outlook.com web “compose event” deep link. Opens the new-event form pre-filled; user clicks Save. */
export function outlookCalendarUrl(input: CalendarEventInput): string {
  const params = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: input.title,
    startdt: new Date(input.startIso).toISOString(),
    enddt: new Date(input.endIso).toISOString(),
    body: input.description,
  })
  if (input.url) params.set("location", input.url)
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`
}
