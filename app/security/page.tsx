import type { Metadata } from "next"
import Link from "next/link"
import { LindyCard, LindyPage } from "@/components/lindy-page"

export const metadata: Metadata = {
  title: "Security | Terramore",
  description:
    "Your lists, ads, and store stay in the tools you own. We do not sell personal information.",
}

export default function SecurityPage() {
  return (
    <LindyPage
      title="Private"
      accent="and in your control."
      subtitle="Your lists, ads, and store stay in the tools you own."
    >
      <section className="pb-20">
        <div className="page-shell grid gap-5 md:grid-cols-3">
          <LindyCard
            title="Access"
            body="Only the people on your engagement can see your customer data."
          />
          <LindyCard
            title="Private"
            body="We do not sell personal information. We do not train public models on your client files. Work lives in your ad accounts, CRM, and storefront."
          />
          <LindyCard
            title="In your control"
            body="Campaign changes and automations follow a process we agree on first. You can turn any email, text, or helper off. Nothing customer-facing goes out as a surprise."
          />
        </div>
        <div className="page-shell mt-12">
          <p className="mt-8 text-[14px] text-slate-500">
            Full legal pages:{" "}
            <Link href="/privacy" className="font-medium text-brand hover:text-brand-hover">
              Privacy
            </Link>
            ,{" "}
            <Link href="/terms" className="font-medium text-brand hover:text-brand-hover">
              Terms
            </Link>
            ,{" "}
            <Link href="/disclosure" className="font-medium text-brand hover:text-brand-hover">
              Disclosure
            </Link>
            .
          </p>
        </div>
      </section>
    </LindyPage>
  )
}
