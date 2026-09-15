// One source of truth for the four report chapters. The homepage report band carousel
// and the desktop "Inside the report" list both read from this array.
//
// Every stat below is a reused sample value from the Northline Atelier sample
// report. Nothing here is a real client number, and the captions say so in plain
// English. The `tone` drives the supporting stat color: gold by default, warn for the leak.

export type ChapterTone = "gold" | "warn"

export type Chapter = {
  n: string
  title: string
  body: string
  sample: string
  kicker: string
  stat: string
  caption: string
  tone: ChapterTone
}

export const CHAPTERS: readonly Chapter[] = [
  {
    n: "01",
    title: "Where you already show up",
    body: "Your site, ads, Maps, email, and the listings people already use. We write what a stranger can see today.",
    sample: "Northline: Shopify is live. Maps hours are a season behind.",
    kicker: "Discoverability",
    stat: "3 of 6",
    caption: "Northline Atelier turns up in 3 of the 6 places a new customer looks.",
    tone: "gold",
  },
  {
    n: "02",
    title: "Who already looks and buys",
    body: "Who visits, who pays, and who paid still talks to. So ads and email go to the right people.",
    sample: "Northline: women 32–46. Soft Knit Set. 61% leave at shipping.",
    kicker: "Audience",
    stat: "18.2k",
    caption: "18.2k follow the Instagram, the widest way people meet Northline Atelier.",
    tone: "gold",
  },
  {
    n: "03",
    title: "What already pays",
    body: "The path that already makes money. We keep it. We do not rip out what works.",
    sample: "Northline: mobile checkout and the first-time buyer note.",
    kicker: "What pays",
    stat: "3.1x",
    caption: "Every dollar in Meta return ads brings about three back for Northline Atelier.",
    tone: "gold",
  },
  {
    n: "04",
    title: "Quick Revenue Opportunities",
    body: "The broken step, and the first moves we would take in 90 days. In order.",
    sample: "Northline: paid still talks to the city. No second email.",
    kicker: "Quick revenue",
    stat: "61%",
    caption: "61% of Northline Atelier shoppers leave at shipping on their phones.",
    tone: "warn",
  },
] as const
