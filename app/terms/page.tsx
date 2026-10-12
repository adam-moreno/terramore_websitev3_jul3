// Updated 2026-10-11 for SMS, connected data, billing and financing. Plain-language draft; have counsel review before relying on it.
import type { Metadata } from "next"
import { PlainEmail } from "@/components/plain-email"
import { SiteFooter } from "@/components/site-footer"

export const metadata: Metadata = {
  title: "Terms of Service | Terramore",
  description:
    "Terms that govern use of terramore.io and Terramore.io services, including website use, disclaimers, and how to contact us.",
  alternates: { canonical: "https://www.terramore.io/terms" },
}

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
                <strong>IMPORTANT</strong> – PLEASE CAREFULLY READ AND UNDERSTAND THESE TERMS OF SERVICE ("TERMS")
                BEFORE ACCESSING, USING, OR SUBSCRIBING TO WWW.TERRAMORE.IO. THESE TERMS CONTAIN DISCLAIMERS OF
                REPRESENTATIONS AND WARRANTIES AND LIMITATIONS OF LIABILITIES (SEE SECTION 6, SECTION 9, AND SECTION
                10). THESE TERMS FORM AN ESSENTIAL BASIS OF OUR AGREEMENT. PLEASE PRINT AND RETAIN A COPY OF THESE TERMS
                FOR YOUR RECORDS.
              </p>
            </div>

            <p className="text-gray-700 leading-relaxed mb-6">
              The use of www.terramore.io (along with all subdomains, collectively, the "Website"), which is owned and
              maintained by Terramore.io, LLC ("Terramore.io," "we," "our," "us"), is governed by the policies, terms,
              conditions, and notices set forth below. Please read them carefully. We offer the Website, including all
              information, opportunities, tools, products and services available from the Website (the "Services") to
              you, the user, conditioned upon your acceptance of all policies, terms, conditions, and notices stated
              herein. By accessing, using, or subscribing to the Website, you affirm that you have the right, authority,
              and capacity to enter into the following policies, terms, conditions, and notices, and you and your
              business agree to the provisions set forth herein. If you do not agree to these policies, terms,
              conditions, and notices in their entirety, you are not authorized to use the Website and you should leave
              the Website immediately.
            </p>

            <p className="text-gray-700 leading-relaxed mb-6">
              These Terms together with our Privacy Policy form a legally binding agreement between you and your
              business ("you" or "your business") and Terramore.io and should be read carefully. These Terms govern your
              access to, your use of, and your attempted use of the Website and the Services provided by Terramore.io.
            </p>

            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
              <p className="text-sm font-medium text-red-800">
                These Terms contain arbitration and class action waiver provisions that waive your right to a court
                hearing, right to a jury trial, and right to participate in a class action lawsuit. Arbitration is
                mandatory and is the exclusive remedy for any and all disputes, unless otherwise specified below in
                SECTION 11.
              </p>
            </div>

            <p className="text-gray-700 leading-relaxed mb-6">
              Terramore.io reserves the right to update and change, from time to time, these Terms and all documents
              incorporated by reference by posting updates and/or changes to our Website. It is your responsibility to
              check this page periodically for changes. You can find the most recent version of these Terms at
              www.terramore.io/terms. Use of the Website after such changes constitutes acceptance of such changes.
            </p>

            <p className="text-gray-700 leading-relaxed mb-8">
              To sign up as a paying Terramore.io client, you will be required to agree to additional contractual terms.
            </p>

            {/* Table of Contents — only sections present on this page */}
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Table of Contents:</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <a href="#section-1" className="text-blue-600 hover:text-blue-800">
                  1. WEBSITE USE
                </a>
                <a href="#section-2" className="text-blue-600 hover:text-blue-800">
                  2. WEBSITE USER CONDUCT AND RESTRICTIONS
                </a>
                <a href="#section-6" className="text-blue-600 hover:text-blue-800">
                  6. DISCLAIMER – YOUR BUSINESS&apos;S INDIVIDUAL RESULTS WILL VARY
                </a>
                <a href="#google-maps" className="text-blue-600 hover:text-blue-800">
                  GOOGLE MAPS
                </a>
                <a href="#software" className="text-blue-600 hover:text-blue-800">
                  SOFTWARE: GROWTH WORKSPACE AND TERRAIQ
                </a>
                <a href="#subscriptions" className="text-blue-600 hover:text-blue-800">
                  SUBSCRIPTIONS AND BILLING
                </a>
                <a href="#services-contracts" className="text-blue-600 hover:text-blue-800">
                  SERVICES CONTRACTS
                </a>
                <a href="#financing" className="text-blue-600 hover:text-blue-800">
                  FINANCING
                </a>
                <a href="#text-messages" className="text-blue-600 hover:text-blue-800">
                  TEXT MESSAGE TERMS
                </a>
                <a href="#ai-phone-assistant" className="text-blue-600 hover:text-blue-800">
                  AI PHONE ASSISTANT
                </a>
                <a href="#section-25" className="text-blue-600 hover:text-blue-800">
                  25. CONTACTING US
                </a>
              </div>
            </div>

            {/* Section 1 */}
            <section id="section-1" className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. WEBSITE USE</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">1.1</h3>
                  <p className="text-gray-700 leading-relaxed">
                    The Website is intended for the educational benefit of adults and businesses operated by adults. If
                    you use the Website, you are affirming that you are at least eighteen (18) years old or the legal
                    age of majority in your state or province of residence (whichever is greater), have the legal
                    capacity to enter into a binding contract with us, and have read these Terms and understand and
                    agree to its policies, terms, conditions, and notices.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">1.2</h3>
                  <p className="text-gray-700 leading-relaxed">
                    If you are under eighteen (18) years old, your parent or legal guardian must read, understand, and
                    agree to these Terms on your behalf prior to your use of the Website. If you do not agree to these
                    Terms or have not obtained your parent or legal guardian's consent to agree to these Terms, do not
                    access or use the Website.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section id="section-2" className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. WEBSITE USER CONDUCT AND RESTRICTIONS</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">2.1</h3>
                  <p className="text-gray-700 leading-relaxed">
                    All aspects of our Website are protected by U.S. and international copyright, trademark, and other
                    intellectual property laws, including all design elements, text material, logos, taglines,
                    trademark, trade name, metatags, hashtags, photographic images, personal stories, icons, video and
                    audio clips, personal training sessions, marketing tips and strategies, and downloads. No material
                    on or provided through the Website may be copied, registered as a domain name, reproduced,
                    distributed, republished, uploaded, displayed, posted, transmitted, modified, rented, leased,
                    loaned, sold, assigned, distributed, reverse engineered, disassembled, decompiled, attempted to
                    obtain the source code of, granted a security interest in, publicly performed, publicly displayed,
                    transferred, or exploited in any way whatsoever. The Terramore.io trademark and logo are proprietary
                    marks of Terramore.io, and the use of those marks is strictly prohibited unless otherwise provided
                    for by these Terms.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">2.2</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Subject to your continued strict compliance with all Terms, Terramore.io provides to you a
                    revocable, limited, non-exclusive, royalty-free, non-sublicensable, non-transferable license to use
                    the Website. You acknowledge and agree that you do not acquire any ownership rights in any material
                    protected by intellectual property laws. You agree not to use or attempt to use the Website in any
                    unlawful or harmful manner.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 6 - Key Disclaimer */}
            <section id="section-6" className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                6. DISCLAIMER – YOUR BUSINESS'S INDIVIDUAL RESULTS WILL VARY
              </h2>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">6.1</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Every business is different, employing different strategic approaches and organizational
                      structures, and offering different services and products. Therefore, individual results will vary
                      from user to user.{" "}
                      <strong>
                        YOUR BUSINESS'S INDIVIDUAL RESULTS WILL VARY DEPENDING ON A VARIETY OF FACTORS UNIQUE TO YOUR
                        BUSINESS, INCLUDING BUT NOT LIMITED TO YOUR LOCATION, BUSINESS MODEL, STAFF, AND SERVICE AND
                        PRODUCT OFFERINGS.
                      </strong>
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">6.2</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Terramore.io does not promise, guarantee, or warrant your business's success, income, or sales.
                      You understand and acknowledge that Terramore.io will not at any time provide sales leads or
                      referrals to you or your business. Those businesses who utilize or purchase our Services may
                      receive access to marketing and operational strategies and tools. However, we do not guarantee
                      your business's success and based on many market factors that we cannot control, the tools and
                      strategies we provide may or may not be applicable to your specific business.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section id="google-maps" className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">GOOGLE MAPS</h2>
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

            <section id="software" className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">SOFTWARE: GROWTH WORKSPACE AND TERRAIQ</h2>
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
                data. If you ask, we delete the connected data we stored.
              </p>
            </section>

            <section id="subscriptions" className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">SUBSCRIPTIONS AND BILLING</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                The Growth Workspace is free. We may also offer paid software plans, billed monthly. If you choose a paid
                plan, these terms apply:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>We bill your card through Stripe. We don&apos;t store your full card details.</li>
                <li>Your plan renews each month until you cancel.</li>
                <li>You can cancel any time. Cancellation takes effect at the end of your current billing period.</li>
                <li>We don&apos;t give refunds for partial billing periods, unless the law requires it.</li>
              </ul>
            </section>

            <section id="services-contracts" className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">SERVICES CONTRACTS</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We also provide done-for-you marketing: ads, content, websites and automation.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>You can choose month to month, or a year paid up front.</li>
                <li>We agree on the scope of work and the price with you in writing before work starts.</li>
              </ul>
            </section>

            <section id="financing" className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">FINANCING</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                You may be able to pay for services over time through PayPal, using PayPal Pay Later or PayPal Credit,
                for up to $10,000.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Financing is subject to PayPal&apos;s credit approval and PayPal&apos;s terms.</li>
                <li>PayPal, not Terramore.io, is the lender.</li>
                <li>Terramore.io does not make credit decisions. We are not a lender or a loan broker.</li>
              </ul>
            </section>

            <section id="text-messages" className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">TEXT MESSAGE TERMS</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>Program.</strong> If you give us your mobile number and agree to receive texts, Terramore.io
                will text you about your request. This includes replies to your report request, booking confirmations
                and reminders, and follow-ups from our team. Texts come from our business number, sent through Sendblue
                and sometimes Twilio.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>How you opt in.</strong> To get texts about your report request, check the separate, optional
                &ldquo;Text me about my report and booking&rdquo; box on our form. Booking confirmations and reminders
                are sent to the number you give when you book a call.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>Message frequency varies.</li>
                <li>Message and data rates may apply.</li>
                <li>Reply STOP to opt out. Reply HELP for help.</li>
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

            <section id="ai-phone-assistant" className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">AI PHONE ASSISTANT</h2>
              <p className="text-gray-700 leading-relaxed">
                Our phone line may be answered by an AI assistant. It will tell you it is an AI. Calls may be recorded
                and transcribed so we can take your message, book a call with you and improve our service. If you
                don&apos;t want to speak with an AI assistant, you can email us instead.
              </p>
            </section>

            {/* Contact Information */}
            <section id="section-25" className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">25. CONTACTING US</h2>

              <div className="bg-blue-50 p-6 rounded-lg">
                <p className="text-gray-700 leading-relaxed mb-4">
                  We encourage our clients to contact us with questions or comments about our products and services.
                  Please feel free to do so by sending an e-mail to <PlainEmail address="support@terramore.io" />. If you have any questions or
                  inquiries concerning any of the Terms, you may contact Terramore.io by e-mail at{" "}
                  <PlainEmail address="legal@terramore.io" /> or
                  by regular mail at:
                </p>

                <div className="bg-white p-4 rounded border-l-4 border-blue-400">
                  <p className="font-medium text-gray-900">
                    Terramore.io, LLC
                    <br />
                    7710 N FM 620
                    <br />
                    Building 13C, Suite 100
                    <br />
                    Austin, Texas 78726
                  </p>
                </div>

                <p className="text-gray-700 leading-relaxed mt-4">
                  Notices to you may be made by posting a notice (or a link to a notice) on www.terramore.io/terms, by
                  e-mail, or by regular mail, at Terramore.io's discretion.
                </p>
              </div>
            </section>

            {/* Copyright */}
            <div className="text-center py-8 border-t border-gray-200">
              <p className="text-gray-600 font-medium">Terramore.io, owned and operated by Adam Moreno, © 2026</p>
            </div>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  )
}
