import type { Metadata } from "next"
import { Suspense } from "react"
import { ManageBooking } from "@/components/manage-booking"
import { SiteFooter } from "@/components/site-footer"

export const metadata: Metadata = {
  title: "Your call | Terramore",
  robots: { index: false, follow: false },
}

export default function ManageBookingPage() {
  return (
    <div className="min-h-screen bg-cream">
      <section className="page-shell pb-16 pt-8 md:pb-24 md:pt-12">
        <div className="mx-auto max-w-xl rounded-[1.75rem] bg-white p-7 shadow-[0_8px_30px_rgba(15,30,46,0.04)] md:p-9">
          <Suspense fallback={<p className="text-[14px] text-slate-500">Loading your call…</p>}>
            <ManageBooking />
          </Suspense>
        </div>
      </section>
      <SiteFooter />
    </div>
  )
}
