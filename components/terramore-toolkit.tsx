"use client"

import { StickyShowcase } from "@/components/sticky-showcase"
import {
  AudienceIntelVisual,
  ChannelValueVisual,
  FollowUpFlowVisual,
  IntegrationTilesVisual,
  LeakFlowVisual,
  RoadmapVisual,
} from "@/components/software-visuals"

const ITEMS = [
  {
    title: "Work inside your current tools",
    copy: "Google, Meta, Shopify, HubSpot, Mailchimp. We join the accounts you already pay for. You do not start over.",
    visual: IntegrationTilesVisual,
  },
  {
    title: "Connect every channel to revenue",
    copy: "Paid ads bring people in. The site turns clicks into orders. Email and texts bring old leads back. Each one adds revenue you can see, in one place.",
    visual: ChannelValueVisual,
  },
  {
    title: "Find where you lose the sale, then fix it",
    copy: "We watch visitors, clicks, carts they leave, and buys they finish. You see the broken step before we charge you to fix it.",
    visual: LeakFlowVisual,
  },
  {
    title: "Follow up the same day",
    copy: "A new lead reaches you, your salesperson, and your assistant the same minute. Then it keeps moving: a spot on the calendar, an invoice, the welcome files. Each one goes to a person, from a person.",
    visual: FollowUpFlowVisual,
  },
  {
    title: "Reach the people ready to buy",
    copy: "We watch who notices you, who comes to the site, and who is ready. Then we reach those people so more of them purchase.",
    visual: AudienceIntelVisual,
  },
  {
    title: "Leave with a 90-day plan",
    copy: "At day 90 you have a written plan with owners and dates: what we fixed, what we turned on, and what comes next. It stays with your team whether we stay or not.",
    visual: RoadmapVisual,
  },
]

export function TerramoreToolkit() {
  return (
    <div id="how-we-work" className="scroll-mt-28">
    <StickyShowcase
      title="Why Terramore feels like"
      accent="a real growth team."
      subtitle="Six things we do that a freelancer or an agency usually does not."
      items={ITEMS}
    />
    </div>
  )
}
