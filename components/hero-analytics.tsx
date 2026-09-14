"use client"

import {
  Briefcase,
  Calendar,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  Cpu,
  Dumbbell,
  FileText,
  Film,
  Folder,
  HardHat,
  House,
  Mail,
  MapPin,
  MessageSquare,
  Shirt,
  ShoppingBag,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react"
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react"

function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(false)

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const sync = () => setReduce(media.matches)
    sync()
    media.addEventListener("change", sync)
    return () => media.removeEventListener("change", sync)
  }, [])

  return reduce
}

type Person = { name: string; role: string; photo: string; team?: boolean }
type DriveFile = { name: string; kind: "folder" | "video" | "doc" }
type EmailTile = { name: string; subject: string; tone: string }
type GanttRow = { name: string; start: number; span: number; state: "done" | "now" | "next" }
type Attachment =
  | { kind: "drive"; folder: string; files: DriveFile[] }
  | { kind: "shoot"; place: string; when: string; crew: string }
  | { kind: "emails"; campaigns: EmailTile[] }
  | { kind: "sms"; title: string; steps: string[] }
  | { kind: "gantt"; title: string; weeks: string; rows: GanttRow[] }
  | { kind: "checklist"; title: string; items: { label: string; done: boolean }[] }
  | { kind: "log"; title: string; rows: { time: string; event: string }[] }

type Message = {
  from: Person
  time: string
  text: ReactNode
  attachment?: Attachment
}

type Channel = {
  id: string
  label: string
  icon: LucideIcon
  members: number
  client: Person
  messages: Message[]
}

function mention(name: string) {
  return <span className="slack-mention">@{name}</span>
}

function SlackFace({ src, name, className }: { src: string; name: string; className: string }) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    const initials = name
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
    return (
      <span className={`${className} flex items-center justify-center bg-slate-200 text-[10px] font-semibold text-slate-600`}>
        {initials}
      </span>
    )
  }
  return <img src={src} alt={name} className={className} onError={() => setFailed(true)} />
}

const ADAM: Person = {
  name: "Adam Moreno",
  role: "Founder, Terramore",
  photo: "/founder/adam-moreno-cartoon.png?v=2",
  team: true,
}

const RILEY: Person = {
  name: "Riley Cho",
  role: "Account Manager, Terramore",
  photo: "/founder/riley-cho-cartoon.png?v=3",
  team: true,
}

const NOAH: Person = {
  name: "Noah Patel",
  role: "Automation Expert, Terramore",
  photo: "/founder/noah-patel-cartoon.png?v=3",
  team: true,
}

const SOFIA: Person = {
  name: "Sofia Ramirez",
  role: "Lead Web Developer, Terramore",
  photo: "/founder/sofia-ramirez-cartoon.png?v=3",
  team: true,
}

const MARCUS: Person = {
  name: "Marcus Bell",
  role: "Head of Sales, Terramore",
  photo: "/founder/marcus-bell-cartoon.png?v=3",
  team: true,
}

const ELENA: Person = {
  name: "Elena Park",
  role: "Lifecycle Lead, Terramore",
  photo: "/founder/elena-voss-cartoon.png?v=3",
  team: true,
}

const CHRIS: Person = {
  name: "Chris Okonkwo",
  role: "Growth Strategist, Terramore",
  photo: "/founder/chris-okonkwo-cartoon.png?v=3",
  team: true,
}

const BLAKE: Person = {
  name: "Blake Harrow",
  role: "Producer, Terramore",
  photo: "/founder/jordan-blake-cartoon.png?v=3",
  team: true,
}

const AVA: Person = {
  name: "Ava Lindstrom",
  role: "Account Manager, Terramore",
  photo: "/founder/ava-lindstrom-cartoon.png?v=3",
  team: true,
}

const NIA: Person = { name: "Nia Brooks", role: "Founder, Loom & Line", photo: "/founder/nia-brooks-headshot.png" }
const CALEB: Person = {
  name: "Caleb Voss",
  role: "Owner, Hale Athletics",
  photo: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=96&h=96&q=80",
}
const FARAH: Person = {
  name: "Farah Nadir",
  role: "Ops, Northwind HVAC",
  photo: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=96&h=96&q=80",
}
const DIEGO: Person = {
  name: "Diego Marquez",
  role: "CMO, Ortega Studio",
  photo: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?auto=format&fit=crop&w=96&h=96&q=80",
}
const HELEN: Person = {
  name: "Helen Zhou",
  role: "Managing Partner, Whitfield & Co.",
  photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=96&h=96&q=80",
}
const IMANI: Person = {
  name: "Imani Cole",
  role: "Founder, Solis Skin",
  photo: "https://images.unsplash.com/photo-1589156280159-27698a70f80e?auto=format&fit=crop&w=96&h=96&q=80",
}
const ARJUN: Person = {
  name: "Arjun Mehta",
  role: "CEO, Northbeam Labs",
  photo: "https://images.unsplash.com/photo-1615109390621-47e2d4edc5c0?auto=format&fit=crop&w=96&h=96&q=80",
}
const SABLE: Person = {
  name: "Sable Quinn",
  role: "Creator, Sable Makes",
  photo: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=96&h=96&q=80",
}
const DESHAWN: Person = {
  name: "DeShawn Carter",
  role: "Owner, Ruiz Build",
  photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=96&h=96&q=80",
}

// Three shapes on purpose so the channels do not read like one template:
// e-commerce is a question with a result card, fitness is a proactive update with a checklist,
// home-services is a quick back and forth with a log. Only e-commerce opens with an @mention.
const CHANNELS: Channel[] = [
  {
    id: "ecommerce",
    label: "e-commerce",
    icon: ShoppingBag,
    members: 14,
    client: NIA,
    messages: [
      {
        from: NIA,
        time: "8:47 AM",
        text: <>{mention("Terramore")} can the cart and shipping emails be live before Friday&apos;s drop?</>,
      },
      {
        from: ADAM,
        time: "8:49 AM",
        text: "Yes. Three flows are live in Klaviyo. Test sends are in your inbox.",
        attachment: {
          kind: "emails",
          campaigns: [
            { name: "Cart saved", subject: "You left something in your bag", tone: "amber" },
            { name: "Shipped", subject: "It is on the way", tone: "sky" },
            { name: "Review", subject: "How did it fit?", tone: "rose" },
          ],
        },
      },
    ],
  },
  {
    id: "fitness",
    label: "fitness",
    icon: Dumbbell,
    members: 9,
    client: CALEB,
    messages: [
      {
        from: RILEY,
        time: "7:12 AM",
        text: "Shoot day plan for Thursday. Nothing needed from you.",
        attachment: {
          kind: "checklist",
          title: "Thursday shoot",
          items: [
            { label: "Studio 12 in Wynwood booked, 9:00 AM", done: true },
            { label: "Two camera people and three models confirmed", done: true },
            { label: "Shot list shared in Drive", done: true },
            { label: "New ads go live Friday", done: false },
          ],
        },
      },
      {
        from: CALEB,
        time: "7:20 AM",
        text: "Great. I will be there at 9.",
      },
    ],
  },
  {
    id: "hvac",
    label: "home-services",
    icon: House,
    members: 11,
    client: FARAH,
    messages: [
      {
        from: FARAH,
        time: "6:04 AM",
        text: "Did the after-5 text go out last night?",
      },
      {
        from: NOAH,
        time: "6:07 AM",
        text: "It did. Here is the log.",
        attachment: {
          kind: "log",
          title: "Missed call after 5",
          rows: [
            { time: "6:42 PM", event: "Missed call" },
            { time: "6:42 PM", event: "Text sent with a book link" },
            { time: "6:51 PM", event: "Book link opened" },
          ],
        },
      },
      {
        from: FARAH,
        time: "6:09 AM",
        text: "Perfect. Leave it on.",
      },
    ],
  },
  {
    id: "apparel",
    label: "apparel",
    icon: Shirt,
    members: 16,
    client: DIEGO,
    messages: [
      {
        from: DIEGO,
        time: "9:21 AM",
        text: "Can you rebuild the site so the lookbook actually sells?",
      },
      {
        from: SOFIA,
        time: "9:24 AM",
        text: "The lookbook pages are in Drive. We put them on the site this week.",
        attachment: {
          kind: "drive",
          folder: "Ortega Studio SS26",
          files: [
            { name: "lookbook.pdf", kind: "doc" },
            { name: "hero-cut-03.mp4", kind: "video" },
            { name: "stills", kind: "folder" },
          ],
        },
      },
    ],
  },
  {
    id: "professional",
    label: "professional",
    icon: Briefcase,
    members: 8,
    client: HELEN,
    messages: [
      {
        from: HELEN,
        time: "10:05 AM",
        text: <>{mention("Terramore")} can you build us a 90-day growth plan?</>,
      },
      {
        from: MARCUS,
        time: "10:08 AM",
        text: "Here is the 90 day chart. Week 4 is open. Next is the close path.",
        attachment: {
          kind: "gantt",
          title: "90 day plan",
          weeks: "12 weeks",
          rows: [
            { name: "Setup", start: 0, span: 2, state: "done" },
            { name: "Traffic", start: 2, span: 3, state: "now" },
            { name: "Close path", start: 5, span: 3, state: "next" },
            { name: "Keep", start: 8, span: 4, state: "next" },
          ],
        },
      },
    ],
  },
  {
    id: "skincare",
    label: "skincare",
    icon: Sparkles,
    members: 12,
    client: IMANI,
    messages: [
      {
        from: IMANI,
        time: "11:16 AM",
        text: "People buy once. Can you get them to refill?",
      },
      {
        from: ELENA,
        time: "11:19 AM",
        text: "We set welcome, day 28 refill, and VIP restock in Klaviyo.",
        attachment: {
          kind: "emails",
          campaigns: [
            { name: "Welcome", subject: "Your routine starts here", tone: "stone" },
            { name: "Day 28", subject: "Time to refill", tone: "teal" },
            { name: "VIP", subject: "You get it early", tone: "violet" },
          ],
        },
      },
    ],
  },
  {
    id: "tech",
    label: "tech",
    icon: Cpu,
    members: 10,
    client: ARJUN,
    messages: [
      {
        from: ARJUN,
        time: "2:03 PM",
        text: "Demos sit overnight. Can you book them the same day?",
      },
      {
        from: CHRIS,
        time: "2:06 PM",
        text: "Same day now. A new request gets a text and a hold on the calendar.",
        attachment: {
          kind: "sms",
          title: "New demo",
          steps: ["Request in", "Text plus calendar", "Booked today"],
        },
      },
    ],
  },
  {
    id: "creators",
    label: "creators",
    icon: Clapperboard,
    members: 7,
    client: SABLE,
    messages: [
      {
        from: SABLE,
        time: "4:40 PM",
        text: <>{mention("Terramore")} can you film and edit the course launch?</>,
      },
      {
        from: BLAKE,
        time: "4:43 PM",
        text: "We film Friday in South Beach, then cut and post the launch.",
        attachment: {
          kind: "shoot",
          place: "South Beach, Miami",
          when: "Fri, Oct 10 at 8:00 AM",
          crew: "1 camera person, 2 models, Sable on camera",
        },
      },
    ],
  },
  {
    id: "construction",
    label: "construction",
    icon: HardHat,
    members: 13,
    client: DESHAWN,
    messages: [
      {
        from: DESHAWN,
        time: "5:11 AM",
        text: "Estimates go out and die. Can you chase them?",
      },
      {
        from: AVA,
        time: "5:14 AM",
        text: "Every estimate gets the same packet and a follow-up text. Files are in Drive.",
        attachment: {
          kind: "drive",
          folder: "Ruiz Build estimates",
          files: [
            { name: "estimate.pdf", kind: "doc" },
            { name: "scope.pdf", kind: "doc" },
            { name: "before-after", kind: "folder" },
          ],
        },
      },
    ],
  },
]

const EMAIL_TONES: Record<string, string> = {
  amber: "bg-amber-50",
  sky: "bg-sky-50",
  rose: "bg-rose-50",
  stone: "bg-stone-50",
  teal: "bg-teal-50",
  violet: "bg-violet-50",
}

const HOLD_FIRST_MS = 1000
const TYPING_MS = 800
const MESSAGE_MS = 1000
const ASSET_MS = 800
const HOLD_END_MS = 2200
const SWIPE_THRESHOLD = 48

function FileIcon({ kind }: { kind: DriveFile["kind"] }) {
  if (kind === "folder") return <Folder className="h-3 w-3 text-amber-500" />
  if (kind === "video") return <Film className="h-3 w-3 text-slate-500" />
  return <FileText className="h-3 w-3 text-slate-500" />
}

function GanttMini({ title, weeks, rows }: { title: string; weeks: string; rows: GanttRow[] }) {
  return (
    <div className="mt-2 w-full overflow-hidden rounded-xl border border-black/[0.06] bg-[#f7f7f5] px-3 py-2.5">
      <div className="mb-2 flex items-baseline justify-between">
        <p className="text-[12px] font-semibold text-slate-900">{title}</p>
        <p className="text-[10px] text-slate-400">{weeks}</p>
      </div>
      <div className="space-y-1.5">
        {rows.map((row) => (
          <div key={row.name} className="grid grid-cols-[72px_1fr_36px] items-center gap-2">
            <span className="truncate text-[11px] text-slate-600">{row.name}</span>
            <div className="relative h-2 rounded-full bg-white">
              <div
                className={`absolute top-0 h-2 rounded-full ${
                  row.state === "done" ? "bg-slate-300" : row.state === "now" ? "bg-brand" : "bg-amber-300"
                }`}
                style={{ left: `${(row.start / 12) * 100}%`, width: `${(row.span / 12) * 100}%` }}
              />
            </div>
            <span className="text-right text-[10px] font-medium text-slate-400">
              {row.state === "done" ? "Done" : row.state === "now" ? "Now" : "Next"}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function AttachmentCard({ attachment }: { attachment: Attachment }) {
  if (attachment.kind === "gantt") {
    return <GanttMini title={attachment.title} weeks={attachment.weeks} rows={attachment.rows} />
  }

  if (attachment.kind === "checklist") {
    return (
      <div className="mt-2 w-full overflow-hidden rounded-xl border border-black/[0.06] bg-[#f7f7f5] px-3 py-2.5">
        <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">{attachment.title}</p>
        <ul className="mt-1.5 space-y-1">
          {attachment.items.map((item) => (
            <li key={item.label} className="flex items-start gap-2 text-[12px] leading-snug">
              <span
                className={`mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full ${
                  item.done ? "bg-[#14804a] text-white" : "border border-slate-300 bg-white"
                }`}
              >
                {item.done ? <Check className="h-2.5 w-2.5" strokeWidth={3} /> : null}
              </span>
              <span className={item.done ? "text-slate-700" : "text-slate-500"}>{item.label}</span>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  if (attachment.kind === "log") {
    return (
      <div className="mt-2 w-full overflow-hidden rounded-xl border border-black/[0.06] bg-[#1d1d1f] px-3 py-2.5 text-white">
        <p className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide text-white/50">
          <MessageSquare className="h-3 w-3" />
          {attachment.title}
        </p>
        <div className="mt-1.5 space-y-1">
          {attachment.rows.map((row) => (
            <div key={`${row.time}-${row.event}`} className="flex items-baseline gap-2 text-[12px]">
              <span className="w-[52px] shrink-0 tabular-nums text-white/45">{row.time}</span>
              <span className="text-white/90">{row.event}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (attachment.kind === "drive") {
    return (
      <div className="mt-2 w-full overflow-hidden rounded-xl border border-black/[0.06] bg-[#f7f7f5]">
        <div className="flex items-center gap-2 px-3 pt-2.5">
          <span className="flex h-5 w-5 items-center justify-center rounded bg-[#1a73e8] text-[8px] font-bold text-white">
            G
          </span>
          <div className="min-w-0">
            <p className="truncate text-[12px] font-semibold text-slate-900">{attachment.folder}</p>
            <p className="text-[10px] text-slate-400">Google Drive</p>
          </div>
        </div>
        <div className="mt-2 space-y-0.5 px-2 pb-2">
          {attachment.files.map((file) => (
            <div key={file.name} className="flex items-center gap-2 rounded-md bg-white px-2 py-1.5">
              <FileIcon kind={file.kind} />
              <span className="truncate text-[12px] text-slate-700">{file.name}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (attachment.kind === "shoot") {
    return (
      <div className="mt-2 w-full overflow-hidden rounded-xl border border-black/[0.06] bg-[#f7f7f5] px-3 py-2.5">
        <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">Shoot</p>
        <p className="mt-0.5 flex items-center gap-1.5 text-[13px] font-semibold text-slate-900">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
          {attachment.place}
        </p>
        <p className="mt-1.5 flex items-center gap-1.5 text-[12px] text-slate-600">
          <Calendar className="h-3 w-3 text-slate-400" />
          {attachment.when}
        </p>
        <p className="mt-1 flex items-center gap-1.5 text-[12px] text-slate-600">
          <Users className="h-3 w-3 text-slate-400" />
          {attachment.crew}
        </p>
      </div>
    )
  }

  if (attachment.kind === "emails") {
    return (
      <div className="mt-2 w-full overflow-hidden rounded-xl border border-black/[0.06] bg-[#f7f7f5] p-2">
        <div className="grid grid-cols-3 gap-1.5">
          {attachment.campaigns.map((campaign) => (
            <div key={campaign.name} className="overflow-hidden rounded-lg bg-white">
              <div className={`flex h-5 items-center justify-center ${EMAIL_TONES[campaign.tone] ?? EMAIL_TONES.stone}`}>
                <Mail className="h-3 w-3 text-slate-400" />
              </div>
              <div className="px-1.5 py-1.5">
                <p className="text-[11px] font-semibold text-slate-900">{campaign.name}</p>
                <p className="mt-0.5 line-clamp-2 text-[10px] leading-snug text-slate-500">{campaign.subject}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mt-2 w-full overflow-hidden rounded-xl border border-black/[0.06] bg-[#f7f7f5] px-3 py-2.5">
      <p className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide text-slate-400">
        <MessageSquare className="h-3 w-3" />
        {attachment.title}
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-1">
        {attachment.steps.map((step, index) => (
          <span key={step} className="inline-flex items-center gap-1">
            <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-slate-800">{step}</span>
            {index < attachment.steps.length - 1 && <span className="text-[10px] text-slate-300">→</span>}
          </span>
        ))}
      </div>
    </div>
  )
}

function TypingDots() {
  return (
    <span
      className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1.5"
      role="status"
      aria-label="typing"
    >
      <span className="slack-typing-dot h-1.5 w-1.5 rounded-full bg-slate-400" />
      <span className="slack-typing-dot h-1.5 w-1.5 rounded-full bg-slate-400" style={{ animationDelay: "0.18s" }} />
      <span className="slack-typing-dot h-1.5 w-1.5 rounded-full bg-slate-400" style={{ animationDelay: "0.36s" }} />
    </span>
  )
}

/** phase: 0 = typing only, 1 = text (no attachment yet), 2 = text + attachment */
function SlackMessage({ message, phase }: { message: Message; phase: number }) {
  const showText = phase >= 1
  const showAttachment = phase >= 2

  return (
    <div className="flex gap-3">
      <SlackFace
        src={message.from.photo}
        name={message.from.name}
        className="mt-0.5 h-8 w-8 shrink-0 rounded-lg object-cover object-top"
      />
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-semibold text-slate-900">
          {message.from.name}
          {message.from.team ? (
            <span className="ml-1.5 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
              team
            </span>
          ) : null}{" "}
          <span className="font-normal text-slate-400">{message.time}</span>
        </p>
        <p className="hidden text-[11px] text-slate-400 md:block">{message.from.role}</p>
        {showText ? (
          <p className="mt-1 text-[14px] leading-relaxed text-slate-700">{message.text}</p>
        ) : (
          <TypingDots />
        )}
        {message.attachment && showAttachment ? (
          <div className="max-w-[32rem]">
            <AttachmentCard attachment={message.attachment} />
          </div>
        ) : null}
      </div>
    </div>
  )
}

type RevealCursor = {
  /** Index of the message currently being revealed (or last complete). */
  index: number
  /** 0 typing, 1 text, 2 full (text + attachment). Message 0 starts at 2. */
  phase: number
}

function finalReveal(messages: Message[]): RevealCursor {
  return { index: Math.max(messages.length - 1, 0), phase: 2 }
}

function messagePhase(cursor: RevealCursor, messageIndex: number): number | null {
  if (messageIndex < cursor.index) return 2
  if (messageIndex > cursor.index) return null
  return cursor.phase
}

export function HeroAnalytics() {
  const [active, setActive] = useState(CHANNELS[0].id)
  const channel = CHANNELS.find((item) => item.id === active) ?? CHANNELS[0]
  const activeIndex = CHANNELS.findIndex((item) => item.id === channel.id)
  const extraMembers = Math.max(channel.members - 4, 0)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const paneRef = useRef<HTMLDivElement>(null)
  const probeRef = useRef<HTMLDivElement>(null)
  /** Mobile only: fixed pane height = tallest fully-revealed channel (no clip, no grow-on-switch). */
  const [messagePaneH, setMessagePaneH] = useState<number | null>(null)
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const touchAxis = useRef<"h" | "v" | null>(null)

  useLayoutEffect(() => {
    const probe = probeRef.current
    if (!probe) return

    const measure = () => {
      const mobile = window.matchMedia("(max-width: 767px)").matches
      if (!mobile) {
        setMessagePaneH(null)
        return
      }
      let max = 0
      probe.querySelectorAll<HTMLElement>("[data-channel-probe]").forEach((node) => {
        max = Math.max(max, node.offsetHeight)
      })
      if (max > 0) setMessagePaneH(max)
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(probe)
    window.addEventListener("resize", measure)
    return () => {
      ro.disconnect()
      window.removeEventListener("resize", measure)
    }
  }, [])

  const reduce = usePrefersReducedMotion()
  const [cursor, setCursor] = useState<RevealCursor>(() =>
    reduce ? finalReveal(channel.messages) : { index: 0, phase: 2 }
  )

  useEffect(() => {
    setMenuOpen(false)
    if (reduce) {
      setCursor(finalReveal(channel.messages))
      return
    }

    let cancelled = false
    let timer: number | undefined
    const messages = channel.messages

    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timer = window.setTimeout(resolve, ms)
      })

    const play = async () => {
      while (!cancelled) {
        setCursor({ index: 0, phase: 2 })
        await wait(HOLD_FIRST_MS)
        if (cancelled) return

        for (let i = 1; i < messages.length; i++) {
          setCursor({ index: i, phase: 0 })
          await wait(TYPING_MS)
          if (cancelled) return

          setCursor({ index: i, phase: 1 })
          await wait(MESSAGE_MS)
          if (cancelled) return

          if (messages[i].attachment) {
            setCursor({ index: i, phase: 2 })
            await wait(ASSET_MS)
            if (cancelled) return
          } else {
            setCursor({ index: i, phase: 2 })
          }
        }

        await wait(HOLD_END_MS)
        if (cancelled) return
      }
    }

    void play()
    return () => {
      cancelled = true
      if (timer !== undefined) window.clearTimeout(timer)
    }
  }, [active, reduce])

  useEffect(() => {
    if (!menuOpen) return
    const onPointer = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false)
    }
    document.addEventListener("mousedown", onPointer)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onPointer)
      document.removeEventListener("keydown", onKey)
    }
  }, [menuOpen])

  const goChannel = (delta: number) => {
    const next = activeIndex + delta
    if (next < 0 || next >= CHANNELS.length) return
    setActive(CHANNELS[next].id)
  }

  // Lock page scroll while a horizontal channel swipe is in progress.
  useEffect(() => {
    const el = paneRef.current
    if (!el) return

    const onStart = (event: globalThis.TouchEvent) => {
      const touch = event.changedTouches[0]
      if (!touch) return
      touchStart.current = { x: touch.clientX, y: touch.clientY }
      touchAxis.current = null
    }

    const onMove = (event: globalThis.TouchEvent) => {
      const start = touchStart.current
      const touch = event.touches[0]
      if (!start || !touch) return
      const dx = touch.clientX - start.x
      const dy = touch.clientY - start.y
      if (!touchAxis.current) {
        if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return
        touchAxis.current = Math.abs(dx) > Math.abs(dy) ? "h" : "v"
      }
      if (touchAxis.current === "h") {
        event.preventDefault()
      }
    }

    const onEnd = (event: globalThis.TouchEvent) => {
      const start = touchStart.current
      const touch = event.changedTouches[0]
      const axis = touchAxis.current
      touchStart.current = null
      touchAxis.current = null
      if (!start || !touch || axis !== "h") return
      const dx = touch.clientX - start.x
      if (Math.abs(dx) < SWIPE_THRESHOLD) return
      const next = activeIndex + (dx < 0 ? 1 : -1)
      if (next < 0 || next >= CHANNELS.length) return
      setActive(CHANNELS[next].id)
    }

    el.addEventListener("touchstart", onStart, { passive: true })
    el.addEventListener("touchmove", onMove, { passive: false })
    el.addEventListener("touchend", onEnd, { passive: true })
    el.addEventListener("touchcancel", onEnd, { passive: true })
    return () => {
      el.removeEventListener("touchstart", onStart)
      el.removeEventListener("touchmove", onMove)
      el.removeEventListener("touchend", onEnd)
      el.removeEventListener("touchcancel", onEnd)
    }
  }, [activeIndex])

  const showPrev = activeIndex > 0
  const showNext = activeIndex < CHANNELS.length - 1

  return (
    <div className="relative w-full" data-hero-analytics>
      <div className="card-radius overflow-hidden border border-black/[0.06] bg-white shadow-[0_30px_80px_-32px_rgba(15,23,42,0.22)] md:rounded-[28px]">
        {/* Mobile height follows the tallest conversation (measured once); desktop stays a fixed frame. */}
        <div className="grid grid-cols-[minmax(0,1fr)] md:h-[36rem] md:grid-cols-[200px_minmax(0,1fr)]">
          <aside className="hidden border-r border-black/[0.06] bg-[#f7f4f2] p-3 md:flex md:flex-col">
            <p className="px-2 pb-3 text-[13px] font-semibold text-slate-800">Terramore</p>
            <p className="px-2 pb-2 text-[11px] font-medium uppercase tracking-wide text-slate-400">Channels</p>
            <div className="min-h-0 space-y-0.5 overflow-y-auto pr-1">
              {CHANNELS.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActive(item.id)}
                    className={`flex w-full items-center gap-1.5 rounded-lg px-2 py-1.5 text-left text-[12px] ${
                      item.id === active ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:bg-white/70"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    <span className="shrink-0 text-slate-400">#</span>
                    <span className="whitespace-nowrap">{item.label}</span>
                  </button>
                )
              })}
            </div>
          </aside>

          <div className="flex h-full min-w-0 flex-col bg-white">
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-black/[0.06] px-4 py-2.5">
              <div className="relative min-w-0" ref={menuRef}>
                <button
                  type="button"
                  aria-expanded={menuOpen}
                  aria-haspopup="listbox"
                  onClick={() => setMenuOpen((open) => !open)}
                  className="inline-flex max-w-full items-center gap-1.5 rounded-lg py-0.5 text-left text-[13px] font-semibold text-slate-800 hover:bg-slate-50 md:hover:bg-transparent"
                >
                  <channel.icon className="h-3.5 w-3.5 shrink-0 text-slate-500" />
                  <span className="text-slate-400">#</span>
                  <span className="truncate">{channel.label}</span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 shrink-0 text-slate-400 transition md:hidden ${menuOpen ? "rotate-180" : ""}`}
                  />
                  <span className="hidden shrink-0 font-normal text-slate-400 md:inline">· {channel.members} members</span>
                </button>
                {menuOpen ? (
                  <div
                    role="listbox"
                    aria-label="Channels"
                    className="absolute left-0 top-full z-20 mt-1 max-h-64 w-56 overflow-y-auto rounded-xl border border-black/[0.08] bg-white py-1 shadow-[0_16px_40px_-20px_rgba(15,23,42,0.35)] md:hidden"
                  >
                    {CHANNELS.map((item) => {
                      const Icon = item.icon
                      return (
                        <button
                          key={item.id}
                          type="button"
                          role="option"
                          aria-selected={item.id === active}
                          onClick={() => {
                            setActive(item.id)
                            setMenuOpen(false)
                          }}
                          className={`flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] ${
                            item.id === active ? "bg-slate-50 font-semibold text-slate-900" : "text-slate-600"
                          }`}
                        >
                          <Icon className="h-3.5 w-3.5 shrink-0" />
                          <span className="text-slate-400">#</span>
                          <span>{item.label}</span>
                        </button>
                      )
                    })}
                  </div>
                ) : null}
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className="text-[11px] font-normal text-slate-400 md:hidden">{channel.members}</span>
                <div className="flex -space-x-1.5">
                  {CHANNELS.slice(0, 4).map((item) => (
                    <SlackFace
                      key={item.id}
                      src={item.client.photo}
                      name={item.client.name}
                      className="h-6 w-6 rounded-full border-2 border-white object-cover"
                    />
                  ))}
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-[9px] font-semibold text-slate-500">
                    +{extraMembers}
                  </span>
                </div>
              </div>
            </div>

            <div
              className="relative min-h-[14rem] flex-1 md:min-h-0"
              style={messagePaneH != null ? { height: messagePaneH, flex: "none" } : undefined}
            >
              {/* Offscreen probes: same width as the pane so mobile height = longest full conversation. */}
              <div
                ref={probeRef}
                aria-hidden
                className="pointer-events-none invisible absolute left-0 top-0 -z-10 w-full md:hidden"
              >
                {CHANNELS.map((item) => (
                  <div
                    key={item.id}
                    data-channel-probe
                    className="flex flex-col gap-5 px-4 py-4"
                  >
                    {item.messages.map((message, index) => (
                      <SlackMessage
                        key={`${item.id}-probe-${index}`}
                        message={message}
                        phase={2}
                      />
                    ))}
                  </div>
                ))}
              </div>

              <div
                ref={paneRef}
                className="h-full overflow-hidden px-4 py-4 md:px-6 md:py-5"
              >
                <div className="flex flex-col gap-5">
                  {channel.messages.map((message, index) => {
                    const phase = messagePhase(cursor, index)
                    if (phase === null) return null
                    return (
                      <SlackMessage key={`${channel.id}-${index}`} message={message} phase={phase} />
                    )
                  })}
                </div>
              </div>

              {/* Mobile: quiet horizontal-carousel cues; hide at ends so first has no left, last has no right. */}
              {showPrev ? (
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center md:hidden">
                  <button
                    type="button"
                    aria-label="Previous channel"
                    onClick={() => goChannel(-1)}
                    className="pointer-events-auto ml-1 rounded-full bg-white/80 p-1 text-slate-400 shadow-sm ring-1 ring-black/[0.04] backdrop-blur-sm"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                </div>
              ) : null}
              {showNext ? (
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center md:hidden">
                  <button
                    type="button"
                    aria-label="Next channel"
                    onClick={() => goChannel(1)}
                    className="pointer-events-auto mr-1 rounded-full bg-white/80 p-1 text-slate-400 shadow-sm ring-1 ring-black/[0.04] backdrop-blur-sm"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              ) : null}
            </div>

            {/* Always the last chrome row on mobile — outside the measured message pane so it cannot be clipped. */}
            <div className="relative z-10 flex shrink-0 items-center justify-center gap-1.5 border-t border-black/[0.04] bg-white py-2.5 md:hidden">
              {CHANNELS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-label={`Show #${item.label}`}
                  aria-current={item.id === active ? "true" : undefined}
                  onClick={() => setActive(item.id)}
                  className={`h-1.5 rounded-full transition-all ${
                    item.id === active ? "w-4 bg-brand" : "w-1.5 bg-slate-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
