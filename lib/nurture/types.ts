export type NurtureSource = "talk" | "report" | "book"

export type NurtureStep = 1 | 2 | 3

export type NurtureLink = {
  label: string
  /** Absolute URL, e.g. https://www.terramore.io/solutions/... */
  href: string
}

export type NurtureEnrollInput = {
  email: string
  name?: string | null
  source: NurtureSource
  businessType?: string | null
  job?: string | null
  businessName?: string | null
  website?: string | null
}

export type LeadNurtureRow = {
  id: string
  email: string
  name: string | null
  source: NurtureSource
  business_type: string | null
  job: string | null
  business_name: string | null
  website: string | null
  enrolled_at: string
  step1_sent_at: string | null
  step2_sent_at: string | null
  step3_sent_at: string | null
  unsubscribed_at: string | null
}

export type NurtureEmail = {
  subject: string
  text: string
  html: string
}
