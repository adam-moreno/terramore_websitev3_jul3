/**
 * /marketing growth-system page content. One sample business ("Example Remodeling Co", the same stand-in the
 * Next Move hero uses, VD-029) threads through the hero journey, the stage chapters and the loop, so the page tells
 * one story. No real people, clients or results: the journey is a sample, and the board says so.
 */

export type JourneyKind = "search" | "page" | "inquiry" | "reply" | "alert" | "booked"

export type JourneyStep = {
  id: JourneyKind
  /** Stage verb on the board: what happened to the customer. */
  stage: string
  /** Clock time in the sample journey. */
  time: string
  /** The system that did the work. */
  system: string
  /** One line for the phone log. */
  summary: string
}

/** One inquiry, start to finish (hero). Times are a sample evening, not a promise of speed. */
export const JOURNEY: readonly JourneyStep[] = [
  {
    id: "search",
    stage: "Found you",
    time: "7:38 PM",
    system: "Google Ads",
    summary: "Searched “kitchen remodel near me” and clicked your ad",
  },
  {
    id: "page",
    stage: "Landed",
    time: "7:38 PM",
    system: "Landing page",
    summary: "Opened a page built for that search, on a phone",
  },
  {
    id: "inquiry",
    stage: "Asked",
    time: "7:41 PM",
    system: "Estimate form",
    summary: "Requested a free estimate, source attached",
  },
  {
    id: "reply",
    stage: "Heard back",
    time: "7:41 PM",
    system: "Text reply",
    summary: "Got a text back while still on the page",
  },
  {
    id: "alert",
    stage: "Team alerted",
    time: "7:41 PM",
    system: "Slack",
    summary: "Your team saw the inquiry and where it came from",
  },
  {
    id: "booked",
    stage: "Booked",
    time: "7:44 PM",
    system: "Calendar + TerraIQ",
    summary: "Picked Thursday 10:00 AM; the booking keeps its source",
  },
]

export type StageId = "attract" | "convert" | "follow-up" | "measure"

export type Stage = {
  id: StageId
  index: string
  name: string
  /** The job, in owner language. */
  job: string
  /** What Terramore builds and runs at this stage (system map). */
  parts: readonly string[]
  /** What we watch to know it works. */
  watch: string
}

export const STAGES: readonly Stage[] = [
  {
    id: "attract",
    index: "01",
    name: "Attract",
    job: "Get found by people who are already looking.",
    parts: ["Google Search and Maps", "Meta and Instagram", "TikTok and short video", "Content and organic"],
    watch: "Cost per real inquiry, by channel",
  },
  {
    id: "convert",
    index: "02",
    name: "Convert",
    job: "Turn the visit into an inquiry.",
    parts: ["Landing pages", "Tracked calls", "Forms and booking", "Source capture on every lead"],
    watch: "Visits that become inquiries",
  },
  {
    id: "follow-up",
    index: "03",
    name: "Follow up",
    job: "Answer while they're still interested.",
    parts: ["Instant text and email", "Team alerts in Slack", "CRM pipeline", "Reminders before the call"],
    watch: "Time to first reply",
  },
  {
    id: "measure",
    index: "04",
    name: "Measure",
    job: "Know which marketing turns into revenue.",
    parts: ["Attribution", "TerraIQ Growth Workspace", "Revenue Path", "Plain-language reporting"],
    watch: "Revenue by source",
  },
]

/** Where a disconnected setup leaks (problem section). Qualitative on purpose: no invented rates. */
export const LEAKS: readonly { between: string; leak: string }[] = [
  { between: "Ads → Website", leak: "The click lands on a homepage with no clear next step." },
  { between: "Website → Inbox", leak: "The form goes to an inbox nobody checks after hours." },
  { between: "Inbox → CRM", leak: "The reply goes out tomorrow, and the lead never reaches the CRM." },
  { between: "CRM → Reports", leak: "No one can say which ad or post produced the customer." },
]

/** The operating loop after launch. */
export const LOOP: readonly { name: string; detail: string }[] = [
  { name: "Watch", detail: "TerraIQ shows where people drop between stages." },
  { name: "Decide", detail: "We pick the one constraint costing you the most." },
  { name: "Fix", detail: "Terramore builds the change: a page, a reply, a campaign." },
  { name: "Measure", detail: "We check whether it moved, then pick the next one." },
]
