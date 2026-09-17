import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Integrations | Terramore",
  description:
    "We sit in the tools you already pay for. Email, ads, the store, payments, and the calendar.",
  openGraph: {
    title: "Integrations | Terramore",
    description:
      "We sit in the tools you already pay for. Email, ads, the store, payments, and the calendar.",
    url: "https://www.terramore.io/integrations",
  },
}

export default function IntegrationsLayout({ children }: { children: React.ReactNode }) {
  return children
}
