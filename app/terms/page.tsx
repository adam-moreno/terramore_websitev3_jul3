// Updated 2026-10-11 for SMS, connected data, billing and financing. Plain-language draft; have counsel review before relying on it.
import type { Metadata } from "next"
import { PlainEmail } from "@/components/plain-email"
import { SiteFooter } from "@/components/site-footer"

export const metadata: Metadata = {
  title: "Terms of Service | Terramore",
  description:
    "Terms that govern use of terramore.io and Terramore services, including billing, cancellation, text messages, disclaimers, and how to contact us.",
  alternates: { canonical: "https://www.terramore.io/terms" },
}

const TOC = [
  { id: "website-use", label: "1. WEBSITE USE" },
  { id: "conduct", label: "2. USER CONDUCT AND INTELLECTUAL PROPERTY" },
  { id: "results", label: "3. YOUR RESULTS WILL VARY" },
  { id: "google-maps", label: "4. GOOGLE MAPS" },
  { id: "software", label: "5. SOFTWARE: GROWTH WORKSPACE AND TERRAIQ" },
  { id: "subscriptions", label: "6. SOFTWARE SUBSCRIPTIONS AND BILLING" },
  { id: "services-contracts", label: "7. MARKETING SERVICES" },
  { id: "financing", label: "8. FINANCING" },
  { id: "text-messages", label: "9. TEXT MESSAGE TERMS" },
  { id: "ai-phone-assistant", label: "10. AI PHONE ASSISTANT" },
  { id: "indemnification", label: "11. YOUR CONTENT AND INDEMNIFICATION" },
  { id: "warranties", label: "12. DISCLAIMER OF WARRANTIES" },
  { id: "liability", label: "13. LIMITATION OF LIABILITY" },
  { id: "termination", label: "14. SUSPENSION AND TERMINATION" },
  { id: "disputes", label: "15. DISPUTE RESOLUTION AND ARBITRATION" },
  { id: "governing-law", label: "16. GOVERNING LAW AND VENUE" },
  { id: "changes", label: "17. CHANGES TO THESE TERMS" },
  { id: "general", label: "18. GENERAL TERMS" },
  { id: "contact", label: "19. CONTACTING US" },
]

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-12 px-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">TERMS OF SERVICE</h1>
          <p className="text-sm text-gray-600 mb-8 text-center">Last Updated: October 11, 2026</p>

          <div className="prose prose-lg max-w-none">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
              <p className="text-sm font-medium text-yellow-800">
                <strong>IMPORTANT</strong> – PLEASE READ THESE TERMS OF SERVICE (&ldquo;TERMS&rdquo;) BEFORE YOU USE
                WWW.TERRAMORE.IO OR BUY ANYTHING FROM US. THEY INCLUDE A DISCLAIMER OF WARRANTIES AND LIMITS ON OUR
                LIABILITY (SEE SECTIONS 3, 12 AND 13). PLEASE KEEP A COPY FOR YOUR RECORDS.
              </p>
            </div>

            <p className="text-gray-700 leading-relaxed mb-6">
              www.terramore.io and its subdomains (the &ldquo;Website&rdquo;) are owned and run by Terramore.io, LLC
              (&ldquo;Terramore,&rdquo; &ldquo;we,&rdquo; &ldquo;our,&rdquo; &ldquo;us&rdquo;). These Terms cover the
              Website and everything we offer through it, including our software and our marketing services (together,
              the &ldquo;Services&rdquo;). By using the Services, you agree to these Terms for yourself and for the
              business you represent (&ldquo;you&rdquo;). You also confirm that you have the authority to agree for that
              business. If you don&apos;t agree, please don&apos;t use the Services.
            </p>

            <p className="text-gray-700 leading-relaxed mb-6">
              These Terms and our{" "}
              <a href="/privacy" className="text-blue-600 hover:text-blue-800 underline">
                Privacy Policy
              </a>{" "}
              form a binding agreement between you and Terramore.
            </p>

            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
              <p className="text-sm font-medium text-red-800">
                These Terms contain an arbitration agreement and a class action and jury trial waiver. Most disputes
                will be settled by binding individual arbitration, not in court. You can opt out within 30 days. See
                SECTION 15.
              </p>
            </div>

            <p className="text-gray-700 leading-relaxed mb-6">
              We may change these Terms. Section 17 explains how we tell you. The current version is always at
              www.terramore.io/terms.
            </p>

            <p className="text-gray-700 leading-relaxed mb-8">
              For marketing services, we agree on the scope of work and the price with you in writing before work
              starts. If a signed agreement or statement of work (&ldquo;SOW&rdquo;) conflicts with these Terms, the
              signed agreement or SOW controls.
            </p>

            {/* Table of Contents */}
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Table of Contents:</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                {TOC.map((item) => (
                  <a key={item.id} href={`#${item.id}`} className="text-blue-600 hover:text-blue-800">
                    {item.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Section 1 */}
            <section id="website-use" className="mb-8 scroll-mt-28">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. WEBSITE USE</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">1.1</h3>
                  <p className="text-gray-700 leading-relaxed">
                    The Services are for adults and for businesses. To use them, you must be at least 18 years old (or
                    the age of majority where you live, if higher) and able to enter a binding contract.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">1.2</h3>
                  <p className="text-gray-700 leading-relaxed">
                    If you are under 18, please don&apos;t use the Services or send us your information.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section id="conduct" className="mb-8 scroll-mt-28">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. USER CONDUCT AND INTELLECTUAL PROPERTY</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">2.1</h3>
                  <p className="text-gray-700 leading-relaxed">
                    The Website, our software, reports, designs, text, logos, images and other materials are owned by
                    Terramore or our licensors. They are protected by U.S. and international copyright, trademark and
                    other laws. You may not copy, resell, republish, modify, reverse engineer or try to get the source
                    code of any of it, except as these Terms allow or as we agree in writing. The Terramore name and
                    logo are our trademarks. Don&apos;t use them without our written permission.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">2.2</h3>
                  <p className="text-gray-700 leading-relaxed">
                    As long as you follow these Terms, we give you a limited, revocable, non-exclusive,
                    non-transferable license to use the Services for your business. You don&apos;t get any ownership
                    rights in our materials. You agree not to use the Services in any unlawful or harmful way.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">2.3</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Work we create for you under a signed agreement or SOW is owned as that agreement says. If it
                    doesn&apos;t say, you own the final deliverables once you have paid for them in full. We keep
                    ownership of our tools, templates, software and know-how.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section id="results" className="mb-8 scroll-mt-28">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. YOUR RESULTS WILL VARY</h2>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">3.1</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Every business is different. Results depend on many things we don&apos;t control, such as your
                      location, market, offer, prices, staff, competition, budget and the ad platforms themselves.{" "}
                      <strong>YOUR RESULTS WILL VARY.</strong>
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">3.2</h3>
                    <p className="text-gray-700 leading-relaxed">
                      <strong>
                        WE DO NOT GUARANTEE ANY RESULTS, INCLUDING ANY NUMBER OF LEADS, CALLS, BOOKINGS, SALES,
                        REVENUE, RANKINGS OR RETURN ON AD SPEND.
                      </strong>{" "}
                      Reports, scores, estimates and examples are for information only. They are not promises.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section id="google-maps" className="mb-8 scroll-mt-28">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. GOOGLE MAPS</h2>
              <p className="text-gray-700 leading-relaxed">
                Some Services, including the Digital Footprint report, use Google Maps features and content. Use of
                Google Maps features and content is subject to the then-current versions of the{" "}
                <a
                  href="https://maps.google.com/help/terms_maps/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Google Maps/Google Earth Additional Terms of Service
                </a>{" "}
                and the{" "}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Google Privacy Policy
                </a>
                .
              </p>
            </section>

            {/* Section 5 */}
            <section id="software" className="mb-8 scroll-mt-28">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. SOFTWARE: GROWTH WORKSPACE AND TERRAIQ</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We offer software as part of the Services. TerraIQ is a dashboard for our clients. The Growth Workspace
                is a free workspace where business owners can connect up to 2 business tools, such as Shopify, Square,
                Instagram, a Facebook Page, Google Ads, Meta Ads or Google Analytics.
              </p>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Acceptable use</h3>
              <p className="text-gray-700 leading-relaxed mb-4">When you use our software, you agree not to:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>break the law or anyone else&apos;s rights;</li>
                <li>connect an account you are not authorized to connect;</li>
                <li>try to access another person&apos;s workspace or data;</li>
                <li>disrupt, overload or try to break the software or its security; or</li>
                <li>share your sign-in with people who are not part of your business.</li>
              </ul>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Connected accounts</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Connections go through Windsor.ai, a data connector service. You sign in to the tool and choose which
                account to connect. When you connect an account, you confirm that you own it or are authorized to
                connect it on behalf of the business that owns it. You also authorize us to pull business data from it
                as described in our{" "}
                <a href="/privacy" className="text-blue-600 hover:text-blue-800 underline">
                  Privacy Policy
                </a>
                .
              </p>
              <p className="text-gray-700 leading-relaxed">
                You can disconnect at any time by revoking access in the tool, or by emailing us. We then stop pulling
                data. How long we keep connected data is explained in the &ldquo;How long we keep information&rdquo;
                section of our{" "}
                <a href="/privacy" className="text-blue-600 hover:text-blue-800 underline">
                  Privacy Policy
                </a>
                .
              </p>
            </section>

            {/* Section 6 */}
            <section id="subscriptions" className="mb-8 scroll-mt-28">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. SOFTWARE SUBSCRIPTIONS AND BILLING</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>The Growth Workspace is free.</strong> We don&apos;t ask for a card, and it never turns into a
                paid plan on its own.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may also offer paid software plans. If you choose a paid plan, these terms apply:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>
                  <strong>Automatic renewal.</strong> Your plan renews automatically each month, or each year if you
                  choose yearly billing, until you cancel.
                </li>
                <li>
                  <strong>Recurring charges.</strong> By subscribing, you authorize us to charge your payment method
                  the plan price, plus any taxes, at the start of each billing period until you cancel.
                </li>
                <li>
                  <strong>How to cancel.</strong> You can cancel any time online in your account, or by emailing{" "}
                  <PlainEmail address="support@terramore.io" />. Cancellation takes effect at the end of your current
                  billing period. You keep access until then.
                </li>
                <li>
                  <strong>Refunds.</strong> We don&apos;t give refunds for partial billing periods, unless the law
                  requires it.
                </li>
                <li>
                  <strong>Price changes.</strong> We give you at least 30 days&apos; notice before a price change. The
                  new price applies from your next billing period after the notice period. You can cancel before then.
                </li>
                <li>
                  <strong>Yearly plans.</strong> We send you a reminder 15 to 45 days before your plan renews.
                </li>
                <li>
                  <strong>Payments.</strong> We bill your card through Stripe. We don&apos;t store your full card
                  details.
                </li>
              </ul>
            </section>

            {/* Section 7 */}
            <section id="services-contracts" className="mb-8 scroll-mt-28">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. MARKETING SERVICES</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We also provide done-for-you marketing: ads, content, websites and automation. The first call is free.
                We agree on the scope of work and the price with you in writing before work starts. You can choose
                month to month, or a year paid up front.
              </p>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Month to month</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>Either of us can end the services with 30 days&apos; written notice. Email is fine.</li>
                <li>
                  We bill for work done and costs we have committed to through the end of the notice period.
                </li>
              </ul>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">A year paid up front</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>
                  Within the first 30 days after you pay, you can cancel. We refund the unused part of what you paid,
                  minus the value of work already completed.
                </li>
                <li>
                  After those 30 days, prepaid fees are non-refundable, except as required by law or as stated in your
                  signed agreement.
                </li>
              </ul>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Prices</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We give you 30 days&apos; notice before we change the price of ongoing services. If a signed
                agreement or SOW conflicts with this, the signed agreement or SOW controls.
              </p>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Ad spend</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                You pay ad spend directly to the ad platforms, such as Google or Meta, unless we agree otherwise in
                writing. Ad spend is separate from our fees. Terramore never refunds ad spend.
              </p>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Your part</h3>
              <p className="text-gray-700 leading-relaxed">
                You agree to give us the access, information and approvals we need, on time. You are responsible for
                your products, services, prices, licenses and claims about your business. Delays on your side can
                delay our work.
              </p>
            </section>

            {/* Section 8 */}
            <section id="financing" className="mb-8 scroll-mt-28">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. FINANCING</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                You may be able to pay for services over time through PayPal, using PayPal Pay Later or PayPal Credit,
                for up to $10,000.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Financing is subject to PayPal&apos;s credit approval and PayPal&apos;s terms.</li>
                <li>PayPal, not Terramore, is the lender.</li>
                <li>Terramore does not make credit decisions. We are not a lender or a loan broker.</li>
              </ul>
            </section>

            {/* Section 9 — id must stay "text-messages"; forms link to /terms#text-messages */}
            <section id="text-messages" className="mb-8 scroll-mt-28">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. TEXT MESSAGE TERMS</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>Program.</strong> If you give us your mobile number and agree to receive texts, Terramore will
                text you about your request. This includes replies to your report request, booking confirmations and
                reminders, and follow-ups from our team. Texts come from our business number, sent through Sendblue
                and sometimes Twilio.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>How you opt in.</strong> To get texts about your report request, check the separate, optional
                &ldquo;Text me about my report and booking&rdquo; box on our form. Booking confirmations and reminders
                are sent to the number you give when you book a call.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>Message frequency varies (typically up to 4 messages per request or booking).</li>
                <li>Message and data rates may apply.</li>
                <li>Reply STOP to opt out.</li>
                <li>
                  Reply HELP for help. You can also email questions to <PlainEmail address="support@terramore.io" />.
                </li>
                <li>You don&apos;t have to agree to texts to buy anything from us.</li>
                <li>Marketing texts are optional and separate from these service texts.</li>
                <li>Carriers are not liable for delayed or undelivered messages.</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                We do not share mobile numbers or SMS consent with third parties or affiliates for their marketing
                purposes. See our{" "}
                <a href="/privacy" className="text-blue-600 hover:text-blue-800 underline">
                  Privacy Policy
                </a>
                .
              </p>
            </section>

            {/* Section 10 */}
            <section id="ai-phone-assistant" className="mb-8 scroll-mt-28">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. AI PHONE ASSISTANT</h2>
              <p className="text-gray-700 leading-relaxed">
                Our phone line may be answered by an AI assistant. It will tell you it is an AI. At the start of each
                call, we tell you that the call is recorded. Calls are recorded and transcribed so we can take your
                message, book a call with you and improve our service. If you don&apos;t want to speak with an AI
                assistant, you can email us instead.
              </p>
            </section>

            {/* Section 11 */}
            <section id="indemnification" className="mb-8 scroll-mt-28">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. YOUR CONTENT AND INDEMNIFICATION</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                You keep ownership of the content and data you give us, such as logos, photos, product details and
                connected data. You give us permission to use it to provide the Services to you. You confirm that you
                have the right to give it to us.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                You agree to defend, indemnify and hold harmless Terramore and its owners, employees and contractors
                from any claims, losses, damages, fines and costs (including reasonable attorneys&apos; fees) that
                come from:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>content or data you give us;</li>
                <li>accounts you connect, and your use of them;</li>
                <li>your ads and the claims in them, including content you approve;</li>
                <li>your products, services and business practices; or</li>
                <li>your breach of these Terms or your violation of any law or anyone&apos;s rights.</li>
              </ul>
            </section>

            {/* Section 12 */}
            <section id="warranties" className="mb-8 scroll-mt-28">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. DISCLAIMER OF WARRANTIES</h2>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <p className="text-gray-700 leading-relaxed mb-4">
                  <strong>
                    THE SERVICES ARE PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE.&rdquo; TO THE FULLEST EXTENT
                    THE LAW ALLOWS, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF
                    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT.
                  </strong>
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>We don&apos;t guarantee results. Marketing results vary (see Section 3).</li>
                  <li>We don&apos;t promise the Services will be uninterrupted, error-free or always available.</li>
                  <li>
                    We don&apos;t control third-party platforms, such as Google, Meta, Shopify, Square or Windsor.ai.
                    They can change their rules, prices, features or data, or suspend accounts. We are not responsible
                    for what they do.
                  </li>
                  <li>Some places don&apos;t allow these disclaimers, so some of them may not apply to you.</li>
                </ul>
              </div>
            </section>

            {/* Section 13 */}
            <section id="liability" className="mb-8 scroll-mt-28">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. LIMITATION OF LIABILITY</h2>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">13.1</h3>
                    <p className="text-gray-700 leading-relaxed">
                      <strong>
                        TO THE FULLEST EXTENT THE LAW ALLOWS, TERRAMORE IS NOT LIABLE FOR ANY INDIRECT, INCIDENTAL,
                        SPECIAL, CONSEQUENTIAL OR PUNITIVE DAMAGES, OR FOR LOST PROFITS, REVENUE, DATA OR GOODWILL,
                        EVEN IF WE WERE TOLD THEY WERE POSSIBLE.
                      </strong>
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">13.2</h3>
                    <p className="text-gray-700 leading-relaxed">
                      <strong>
                        OUR TOTAL LIABILITY FOR ALL CLAIMS ABOUT THE SERVICES IS LIMITED TO THE FEES YOU PAID
                        TERRAMORE IN THE 12 MONTHS BEFORE THE CLAIM AROSE, OR $100 IF YOU PAID NOTHING.
                      </strong>{" "}
                      Ad spend paid to ad platforms does not count as fees paid to Terramore.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">13.3</h3>
                    <p className="text-gray-700 leading-relaxed">
                      These limits don&apos;t apply where the law doesn&apos;t allow them, such as liability for fraud,
                      willful misconduct, gross negligence, or death or personal injury caused by our negligence.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 14 */}
            <section id="termination" className="mb-8 scroll-mt-28">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">14. SUSPENSION AND TERMINATION</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may suspend or end your access to all or part of the Services if:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>you misuse the Services or break these Terms;</li>
                <li>you don&apos;t pay amounts you owe on time; or</li>
                <li>continuing would create legal, security or platform risk for us or others.</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mb-4">
                When we can, we will tell you first and give you a chance to fix the problem. You can stop using the
                Services at any time, as explained in Sections 6 and 7.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Amounts you owe, and Sections 2, 3 and 11 through 18, survive after the Services end.
              </p>
            </section>

            {/* Section 15 */}
            <section id="disputes" className="mb-8 scroll-mt-28">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">15. DISPUTE RESOLUTION AND ARBITRATION</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">15.1 Talk to us first</h3>
                  <p className="text-gray-700 leading-relaxed">
                    If you have a dispute with us, email <PlainEmail address="legal@terramore.io" /> and describe it. We
                    will do the same if we have a dispute with you. Both of us agree to try to settle it informally
                    for 30 days before starting arbitration.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">15.2 Binding arbitration</h3>
                  <p className="text-gray-700 leading-relaxed">
                    If we can&apos;t settle it, the dispute will be decided by binding arbitration run by the American
                    Arbitration Association (&ldquo;AAA&rdquo;). The AAA Consumer Arbitration Rules apply if you are a
                    consumer. The AAA Commercial Arbitration Rules apply if you are a business. Fees are paid as those
                    rules say. The arbitrator&apos;s decision is final and can be entered in any court with
                    jurisdiction.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">15.3 Exceptions</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Either of us may bring an individual claim in small claims court if it qualifies. Either of us may
                    also ask a court to stop misuse of intellectual property. Claims that the law does not allow to be
                    arbitrated go to court, as Section 16 says.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">15.4 No class actions, no jury</h3>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>
                      YOU AND TERRAMORE EACH BRING CLAIMS ONLY AS INDIVIDUALS, NOT AS A PLAINTIFF OR CLASS MEMBER IN
                      ANY CLASS, COLLECTIVE OR REPRESENTATIVE ACTION. YOU AND TERRAMORE EACH GIVE UP THE RIGHT TO A JURY
                      TRIAL.
                    </strong>{" "}
                    If this class action waiver is found unenforceable for a claim, that claim goes to court, not
                    arbitration.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">15.5 How to opt out</h3>
                  <p className="text-gray-700 leading-relaxed">
                    You can opt out of this arbitration agreement. Email <PlainEmail address="legal@terramore.io" />{" "}
                    within 30 days after you first accept these Terms. Include your name, your business name and a
                    clear statement that you opt out of arbitration. Opting out doesn&apos;t change the rest of these
                    Terms.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 16 */}
            <section id="governing-law" className="mb-8 scroll-mt-28">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">16. GOVERNING LAW AND VENUE</h2>
              <p className="text-gray-700 leading-relaxed">
                California law governs these Terms, without regard to its conflict of law rules. The Federal
                Arbitration Act governs Section 15. Any matter that is not arbitrated will be heard only in the state
                or federal courts in Sacramento County, California. You and Terramore agree to the jurisdiction of
                those courts.
              </p>
            </section>

            {/* Section 17 */}
            <section id="changes" className="mb-8 scroll-mt-28">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">17. CHANGES TO THESE TERMS</h2>
              <p className="text-gray-700 leading-relaxed">
                We may update these Terms from time to time. We post the new version on this page and change the
                &ldquo;Last Updated&rdquo; date. For material changes, we also email account holders and clients. The
                changes apply from the date we post them, or a later date we state. If you keep using the Services
                after that, you accept the changes. Changes do not apply to disputes we already knew about before the
                change.
              </p>
            </section>

            {/* Section 18 */}
            <section id="general" className="mb-8 scroll-mt-28">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">18. GENERAL TERMS</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>
                  <strong>Entire agreement.</strong> These Terms, our Privacy Policy and any signed agreement or SOW
                  are the whole agreement between us about the Services. They replace earlier discussions.
                </li>
                <li>
                  <strong>Severability.</strong> If a court or arbitrator finds part of these Terms unenforceable, the
                  rest stays in effect.
                </li>
                <li>
                  <strong>Assignment.</strong> You may not transfer these Terms without our written consent. We may
                  transfer them, for example in a merger or sale of our business.
                </li>
                <li>
                  <strong>No waiver.</strong> If we don&apos;t enforce a right, we have not given it up.
                </li>
                <li>
                  <strong>Force majeure.</strong> Neither of us is responsible for delays or failures caused by events
                  beyond reasonable control, such as natural disasters, outages, platform failures, labor disputes or
                  government action. This does not excuse payment owed.
                </li>
                <li>
                  <strong>Notices.</strong> We may give you notice by posting on www.terramore.io/terms, by email or by
                  mail.
                </li>
              </ul>
            </section>

            {/* Section 19 */}
            <section id="contact" className="mb-8 scroll-mt-28">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">19. CONTACTING US</h2>

              <div className="bg-blue-50 p-6 rounded-lg">
                <p className="text-gray-700 leading-relaxed mb-4">
                  For questions about our products and services, email <PlainEmail address="support@terramore.io" />.
                  For questions about these Terms, email <PlainEmail address="legal@terramore.io" /> or write to us
                  at:
                </p>

                <div className="bg-white p-4 rounded border-l-4 border-blue-400">
                  <p className="font-medium text-gray-900">
                    Terramore.io, LLC
                    <br />
                    2108 N St Ste N
                    <br />
                    Sacramento, CA 95816
                  </p>
                </div>
              </div>
            </section>

            {/* Copyright */}
            <div className="text-center py-8 border-t border-gray-200">
              <p className="text-gray-600 font-medium">
                © 2026 Terramore.io, LLC. Terramore is owned and operated by Adam Moreno.
              </p>
            </div>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  )
}
