import type { StaticImageData } from "next/image"
import advertising from "@/assets/capability-heroes/hero-advertising.png"
import analytics from "@/assets/capability-heroes/hero-analytics.png"
import communications from "@/assets/capability-heroes/hero-communications.png"
import ecommerce from "@/assets/capability-heroes/hero-ecommerce.png"
import email from "@/assets/capability-heroes/hero-email-marketing.png"
import payments from "@/assets/capability-heroes/hero-payments.png"
import scheduling from "@/assets/capability-heroes/hero-scheduling.png"

export const INTEGRATION_HEROES: Record<string, StaticImageData> = {
  "email-marketing": email,
  communications,
  advertising,
  ecommerce,
  payments,
  analytics,
  scheduling,
}
