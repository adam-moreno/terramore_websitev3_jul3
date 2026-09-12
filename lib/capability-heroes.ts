import type { StaticImageData } from "next/image"
import audience from "@/assets/capability-heroes/hero-audience.png"
import ai from "@/assets/capability-heroes/hero-artificial-intelligence.png"
import transformation from "@/assets/capability-heroes/hero-business-transformation.png"
import cost from "@/assets/capability-heroes/hero-cost-management.png"
import insights from "@/assets/capability-heroes/hero-customer-insights.png"
import digital from "@/assets/capability-heroes/hero-digital-technology-and-data.png"
import discoverability from "@/assets/capability-heroes/hero-discoverability.png"
import innovation from "@/assets/capability-heroes/hero-innovation-strategy-and-delivery.png"
import marketing from "@/assets/capability-heroes/hero-marketing-and-sales.png"
import operations from "@/assets/capability-heroes/hero-operations.png"
import pricing from "@/assets/capability-heroes/hero-pricing-and-revenue-management.png"

export const CAPABILITY_HEROES: Record<string, StaticImageData> = {
  "marketing-and-sales": marketing,
  "artificial-intelligence": ai,
  "customer-insights": insights,
  "digital-technology-and-data": digital,
  "pricing-and-revenue-management": pricing,
  operations,
  "cost-management": cost,
  "innovation-strategy-and-delivery": innovation,
  "business-transformation": transformation,
  discoverability,
  audience,
}
