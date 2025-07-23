"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Cookie, ChevronDown, Menu } from "lucide-react"
import Link from "next/link"
import { IClosedWidget } from "@/components/iclosed-widget"
import { useSchedulePopup } from "@/hooks/use-schedule-popup"

export default function TermsPage() {
  const { isPopupOpen, setIsPopupOpen } = useSchedulePopup()

  return (
    <div className="min-h-screen bg-white">
      {/* Floating Corner Buttons */}
      <div className="fixed bottom-4 left-4 z-50">
        <Button size="sm" variant="secondary" className="rounded-full shadow-lg hover:shadow-xl transition-shadow">
          <Cookie className="w-4 h-4 mr-2" />
          Cookies
        </Button>
      </div>

      <div className="fixed bottom-4 right-4 z-50">
        <Button
          size="sm"
          onClick={() => setIsPopupOpen(true)}
          className="rounded-full shadow-lg hover:shadow-xl transition-shadow bg-blue-600 hover:bg-blue-700"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Schedule
        </Button>
      </div>

      {/* Announcement Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <Badge variant="secondary" className="mr-3 bg-white text-blue-800">
            NEW
          </Badge>
          <span className="text-sm font-medium">
            2025 AI Marketing Workshop Dates Announced: Find out if you're a fit
          </span>
          <span className="ml-2">→</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-slate-900 text-white py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2">
              <img src="/images/terramore-logo-clean.png" alt="Terramore Logo" className="w-10 h-10 object-contain" />
              <span className="text-xl font-bold">TERRAMORE.IO</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-center flex-1">
            <div className="flex items-center space-x-8">
              </Link>
              <div className="relative group">
                <div className="flex items-center space-x-1 hover:text-blue-300 transition-colors cursor-pointer">
                  <span>Courses</span>
                  <ChevronDown className="w-4 h-4" />
                </div>
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2">
                    <Link
                      href="/courses/scaling"
                      className="block px-4 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-600"
                    >
                      Scaling
                    </Link>
                    <Link
                      href="/courses/offers"
                      className="block px-4 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-600"
                    >
                      Offers
                    </Link>
                    <Link
                      href="/courses/leads"
                      className="block px-4 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-600"
                    >
                      Leads
                    </Link>
                  </div>
                </div>
              </div>
              <Link href="/solutions" className="hover:text-blue-300 transition-colors">
                Solutions
              </Link>
              <Link href="/partner" className="hover:text-blue-300 transition-colors">
                Partner With Us
              </Link>
              <Link href="/about" className="hover:text-blue-300 transition-colors">
                About the Firm
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Button variant="ghost" size="sm" className="text-white hover:text-blue-300">
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-12 px-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">TERMS OF SERVICE</h1>

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

            {/* Table of Contents */}
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Table of Contents:</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <a href="#section-1" className="text-blue-600 hover:text-blue-800">
                  1. WEBSITE USE
                </a>
                <a href="#section-2" className="text-blue-600 hover:text-blue-800">
                  2. WEBSITE USER CONDUCT AND RESTRICTIONS
                </a>
                <a href="#section-3" className="text-blue-600 hover:text-blue-800">
                  3. OUR PRIVACY POLICY AND YOUR PERSONAL INFORMATION
                </a>
                <a href="#section-4" className="text-blue-600 hover:text-blue-800">
                  4. PROHIBITED USE OF THE WEBSITE
                </a>
                <a href="#section-5" className="text-blue-600 hover:text-blue-800">
                  5. INFORMATION YOU PROVIDE; REGISTRATION; USERNAMES AND PASSWORDS
                </a>
                <a href="#section-6" className="text-blue-600 hover:text-blue-800">
                  6. DISCLAIMER – YOUR BUSINESS'S INDIVIDUAL RESULTS WILL VARY
                </a>
                <a href="#section-7" className="text-blue-600 hover:text-blue-800">
                  7. YOUR RESPONSIBILITIES IN RUNNING YOUR BUSINESS
                </a>
                <a href="#section-8" className="text-blue-600 hover:text-blue-800">
                  8. TESTIMONIALS, REVIEWS, AND PICTURES/VIDEOS
                </a>
                <a href="#section-9" className="text-blue-600 hover:text-blue-800">
                  9. DISCLAIMERS OF OTHER WARRANTIES
                </a>
                <a href="#section-10" className="text-blue-600 hover:text-blue-800">
                  10. LIMITATIONS OF LIABILITIES
                </a>
                <a href="#section-11" className="text-blue-600 hover:text-blue-800">
                  11. DISPUTE RESOLUTION BY MANDATORY BINDING ARBITRATION
                </a>
                <a href="#section-12" className="text-blue-600 hover:text-blue-800">
                  12. TERRAMORE.IO'S ADDITIONAL REMEDIES
                </a>
                <a href="#section-13" className="text-blue-600 hover:text-blue-800">
                  13. INDEMNIFICATION
                </a>
                <a href="#section-14" className="text-blue-600 hover:text-blue-800">
                  14. NOTICE AND TAKEDOWN PROCEDURES; COPYRIGHT AGENT
                </a>
                <a href="#section-15" className="text-blue-600 hover:text-blue-800">
                  15. THIRD-PARTY LINKS
                </a>
                <a href="#section-16" className="text-blue-600 hover:text-blue-800">
                  16. TERMINATION
                </a>
                <a href="#section-17" className="text-blue-600 hover:text-blue-800">
                  17. NO WAIVER
                </a>
                <a href="#section-18" className="text-blue-600 hover:text-blue-800">
                  18. GOVERNING LAW AND VENUE
                </a>
                <a href="#section-19" className="text-blue-600 hover:text-blue-800">
                  19. FORCE MAJEURE
                </a>
                <a href="#section-20" className="text-blue-600 hover:text-blue-800">
                  20. ASSIGNMENT
                </a>
                <a href="#section-21" className="text-blue-600 hover:text-blue-800">
                  21. ELECTRONIC SIGNATURE
                </a>
                <a href="#section-22" className="text-blue-600 hover:text-blue-800">
                  22. CHANGES TO THE AGREEMENT
                </a>
                <a href="#section-23" className="text-blue-600 hover:text-blue-800">
                  23. SEVERABILITY
                </a>
                <a href="#section-24" className="text-blue-600 hover:text-blue-800">
                  24. ENTIRE AGREEMENT
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

            {/* Contact Information */}
            <section id="section-25" className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">25. CONTACTING US</h2>

              <div className="bg-blue-50 p-6 rounded-lg">
                <p className="text-gray-700 leading-relaxed mb-4">
                  We encourage our clients to contact us with questions or comments about our products and services.
                  Please feel free to do so by sending an e-mail to support@terramore.io. If you have any questions or
                  inquiries concerning any of the Terms, you may contact Terramore.io by e-mail at legal@terramore.io or
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
              <p className="text-gray-600 font-medium">Copyright 2025 – Terramore.io, LLC – All Rights Reserved</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-blue-600 text-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <img
                src="/images/terramore-logo-clean.png"
                alt="Terramore Logo"
                className="w-8 h-8 object-contain mr-3 filter brightness-0 invert"
              />
              <span className="text-xl font-bold">TERRAMORE.IO</span>
            </div>

            <div className="flex flex-wrap justify-center gap-6 mb-8">
                Workshops
              </Link>
              <Link href="/courses/scaling" className="hover:text-blue-200 transition-colors">
                Courses
              </Link>
              <div className="hover:text-blue-200 transition-colors cursor-pointer">Books</div>
              <div className="hover:text-blue-200 transition-colors cursor-pointer">Media</div>
              <Link href="/partner" className="hover:text-blue-200 transition-colors">
                Partner With Us
              </Link>
              <Link href="/about" className="hover:text-blue-200 transition-colors">
                About the Firm
              </Link>
              <Link href="/careers" className="hover:text-blue-200 transition-colors">
                Careers
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm">
              <Link href="/privacy" className="hover:text-blue-200 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-blue-200 transition-colors">
                Terms of Service
              </Link>
              <div className="hover:text-blue-200 transition-colors cursor-pointer">Disclosure</div>
              <div className="hover:text-blue-200 transition-colors cursor-pointer">DMCA POLICY</div>
              <div className="hover:text-blue-200 transition-colors cursor-pointer">Do Not Sell My Info</div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="text-center text-sm leading-relaxed opacity-90">
            <p>
              Adam Moreno's results are not typical and are not a guarantee of your success. Adam Moreno is an
              experienced business owner and investor, and your results will vary depending on education, effort,
              application, experience, and background. Adam Moreno does not personally invest in every business he works
              with through Terramore.io, LLC. Due to the sensitivity of financial information, we do not track the
              typical results of our students. We cannot guarantee that you will make money or that you will be
              successful if you employ his business strategies specifically or generally. Consequently, your results may
              significantly vary from his. We do not give investment, tax, or other professional advice. Specific
              transactions and experiences are mentioned for informational purposes only. The information contained
              within this website is the property of Terramore.io. Any use of the images, content, or ideas expressed
              herein without the express written consent of Terramore.io is prohibited. Copyright © 2025 Terramore.io,
              LLC. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Schedule Popup */}
      <IClosedWidget isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
    </div>
  )
}
