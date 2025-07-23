"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Cookie, ChevronDown, Menu } from "lucide-react"
import Link from "next/link"
import { IClosedWidget } from "@/components/iclosed-widget"
import { useSchedulePopup } from "@/hooks/use-schedule-popup"
import { useDoNotSellPopup } from "@/hooks/use-do-not-sell-popup"
import { DoNotSellPopup } from "@/components/do-not-sell-popup"

export default function DMCAPage() {
  const { isPopupOpen, setIsPopupOpen } = useSchedulePopup()
  const { isOpen: isDoNotSellOpen, openPopup: openDoNotSell, closePopup: closeDoNotSell } = useDoNotSellPopup()

  return (
    <div className="min-h-screen bg-white">
      {/* Floating Corner Buttons */}
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
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">DMCA POLICY</h1>

          <div className="prose prose-lg max-w-none">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
              <p className="text-sm font-medium text-yellow-800">
                <strong>Last Updated:</strong> February 4, 2025
              </p>
            </div>

            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">DIGITAL MILLENNIUM COPYRIGHT ACT (DMCA) POLICY</h2>
                <p className="text-gray-700 leading-relaxed">
                  Terramore.io, LLC ("we," "us," or "our") respects the intellectual property rights of others and 
                  expects its users to do the same. In accordance with the Digital Millennium Copyright Act of 1998 
                  (the "DMCA"), we will respond expeditiously to claims of copyright infringement committed using 
                  our website that are reported to our designated copyright agent.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">FILING A DMCA NOTICE</h2>
                <p className="text-gray-700 leading-relaxed">
                  If you are a copyright owner, or authorized on behalf of one, and you believe that the copyrighted 
                  work has been copied in a way that constitutes copyright infringement that is taking place through 
                  our website, you must submit your notice in writing to the attention of our copyright agent via 
                  email and include in your notice a detailed description of the alleged infringement.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  You may be held accountable for damages (including costs and attorneys' fees) for misrepresenting 
                  that any content is infringing your copyright.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">REQUIREMENTS FOR DMCA NOTICE</h2>
                <p className="text-gray-700 leading-relaxed">
                  Your DMCA notice must include the following information:
                </p>
                <ol className="list-decimal pl-6 space-y-2 text-gray-700">
                  <li>
                    <strong>Identification of the copyrighted work:</strong> A description of the copyrighted work 
                    that you claim has been infringed, including the URL or location of the material.
                  </li>
                  <li>
                    <strong>Identification of the infringing material:</strong> A description of where the material 
                    that you claim is infringing is located on our website, with enough detail that we may find it.
                  </li>
                  <li>
                    <strong>Your contact information:</strong> Your address, telephone number, and email address.
                  </li>
                  <li>
                    <strong>Statement of good faith belief:</strong> A statement by you that you have a good faith 
                    belief that the disputed use is not authorized by the copyright owner, its agent, or the law.
                  </li>
                  <li>
                    <strong>Statement of accuracy:</strong> A statement by you, made under penalty of perjury, that 
                    the above information in your notice is accurate and that you are the copyright owner or 
                    authorized to act on the copyright owner's behalf.
                  </li>
                  <li>
                    <strong>Electronic signature:</strong> An electronic or physical signature of the person 
                    authorized to act on behalf of the owner of the copyright's interest.
                  </li>
                </ol>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">COUNTER-NOTIFICATION</h2>
                <p className="text-gray-700 leading-relaxed">
                  If you believe that your content that was removed (or to which access was disabled) is not 
                  infringing, or that you have the authorization from the copyright owner, the copyright owner's 
                  agent, or pursuant to the law, to post and use the material in your content, you may send a 
                  counter-notification containing the following information to our copyright agent:
                </p>
                <ol className="list-decimal pl-6 space-y-2 text-gray-700">
                  <li>
                    <strong>Your physical or electronic signature.</strong>
                  </li>
                  <li>
                    <strong>Identification of the content:</strong> Identification of the content that has been 
                    removed or to which access has been disabled and the location at which the content appeared 
                    before it was removed or disabled.
                  </li>
                  <li>
                    <strong>Statement under penalty of perjury:</strong> A statement that you have a good faith 
                    belief that the content was removed or disabled as a result of mistake or a misidentification 
                    of the content.
                  </li>
                  <li>
                    <strong>Your contact information:</strong> Your name, address, telephone number, and email 
                    address, and a statement that you consent to the jurisdiction of the federal court in 
                    Sacramento, California, and a statement that you will accept service of process from the 
                    person who provided notification of the alleged infringement.
                  </li>
                </ol>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">REPEAT INFRINGERS</h2>
                <p className="text-gray-700 leading-relaxed">
                  In accordance with the DMCA and other applicable law, we have adopted a policy of terminating, 
                  in appropriate circumstances and at our sole discretion, users who are deemed to be repeat 
                  infringers. We may also at our sole discretion limit access to our website and/or terminate 
                  the accounts of any users who infringe any intellectual property rights of others, whether 
                  or not there is any repeat infringement.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">CONTACT INFORMATION</h2>
                <p className="text-gray-700 leading-relaxed">
                  If you have any questions about this DMCA Policy, please contact our designated copyright agent:
                </p>
                <div className="bg-gray-50 p-6 rounded-lg mt-4">
                  <p className="text-gray-700 mb-2">
                    <strong>Copyright Agent</strong>
                  </p>
                  <p className="text-gray-700 mb-2">Terramore.io, LLC</p>
                  <p className="text-gray-700 mb-2">2108 N ST STE N</p>
                  <p className="text-gray-700 mb-2">SACRAMENTO, CA 95816</p>
                  <p className="text-gray-700">Email: dmca@terramore.io</p>
                </div>
                <p className="text-gray-700 leading-relaxed mt-4">
                  <strong>Note:</strong> Please use the subject line "DMCA Notice" or "DMCA Counter-Notification" 
                  when sending emails to ensure they are properly routed to our copyright agent.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">CHANGES TO THIS POLICY</h2>
                <p className="text-gray-700 leading-relaxed">
                  We may update this DMCA Policy from time to time. We will notify you of any changes by posting 
                  the new DMCA Policy on this page and updating the "Last Updated" date at the top of this policy.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  You are advised to review this DMCA Policy periodically for any changes. Changes to this DMCA 
                  Policy are effective when they are posted on this page.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
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
              <Link href="/courses/scaling" className="hover:text-blue-200 transition-colors">
                Courses
              </Link>
              <div className="hover:text-blue-200 transition-colors cursor-pointer">Books</div>
              <div className="hover:text-blue-200 transition-colors cursor-pointer">Media</div>
              <Link href="/partner" className="hover:text-blue-200 transition-colors">
                Partner With Us
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm">
              <Link href="/privacy" className="text-blue-200 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-blue-200 transition-colors">
                Terms of Service
              </Link>
              <Link href="/disclosure" className="text-blue-200 transition-colors">
                Disclosure
              </Link>
              <Link href="/dmca" className="text-blue-200 transition-colors">
                DMCA POLICY
              </Link>
              <button
                onClick={openDoNotSell}
                className="hover:text-blue-200 transition-colors text-sm cursor-pointer bg-transparent border-none text-white"
              >
                Do Not Sell My Personal Information
              </button>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="text-center text-sm leading-relaxed opacity-90 max-w-6xl mx-auto">
            <p>
              Results mentioned on this website are not typical and are not a guarantee of your success. Individual
              results will vary depending on education, effort, application, experience, and background. Due to the
              sensitivity of financial information, we do not track the typical results of our students. We cannot
              guarantee that you will make money or that you will be successful if you employ the business strategies
              discussed. Consequently, your results may significantly vary. We do not give investment, tax, or other
              professional advice. Specific transactions and experiences are mentioned for informational purposes only.
              The information contained within this website is the property of Terramore.io. Any use of the images,
              content, or ideas expressed herein without the express written consent of Terramore.io is prohibited.
              Copyright © 2025 Terramore.io, LLC. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Schedule Popup */}
      <IClosedWidget isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
      
      {/* Do Not Sell Popup */}
      <DoNotSellPopup isOpen={isDoNotSellOpen} onClose={closeDoNotSell} />
    </div>
  )
} 