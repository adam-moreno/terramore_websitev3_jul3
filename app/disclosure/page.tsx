"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Cookie, ChevronDown, Menu } from "lucide-react"
import Link from "next/link"
import { IClosedWidget } from "@/components/iclosed-widget"
import { useSchedulePopup } from "@/hooks/use-schedule-popup"
import { useDoNotSellPopup } from "@/hooks/use-do-not-sell-popup"
import { DoNotSellPopup } from "@/components/do-not-sell-popup"
import { Logo } from "@/components/logo"

export default function DisclosurePage() {
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
            <Logo size="lg" className="text-white" />
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
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">DISCLOSURE</h1>

          <div className="prose prose-lg max-w-none">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
              <p className="text-sm font-medium text-yellow-800">
                <strong>Last Updated:</strong> February 4, 2025
              </p>
            </div>

            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">GENERAL DISCLOSURE</h2>
                <p className="text-gray-700 leading-relaxed">
                  This disclosure statement is provided by Terramore.io, LLC ("we," "us," or "our") to inform visitors 
                  and users of our website about important information regarding our business practices, affiliate 
                  relationships, and potential conflicts of interest.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">AFFILIATE DISCLOSURE</h2>
                <p className="text-gray-700 leading-relaxed">
                  Some of our posts may contain affiliate links. This means that if you click on an affiliate link 
                  and purchase the product or service, we may receive a commission at no additional cost to you. 
                  We only recommend products and services that we believe will provide value to our audience.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  We are a participant in various affiliate programs, including but not limited to Amazon Associates, 
                  and other affiliate networks. As an Amazon Associate, we earn from qualifying purchases.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">FINANCIAL DISCLOSURE</h2>
                <p className="text-gray-700 leading-relaxed">
                  The information provided on this website is for educational and informational purposes only. 
                  We are not financial advisors, and the content should not be considered as financial advice. 
                  Always consult with a qualified financial advisor before making any investment decisions.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Any income or earnings statements, or income or earnings examples, are only estimates of what 
                  we think you could possibly earn. There is no assurance you will do as well. Your results will 
                  depend on your efforts, background, knowledge, market conditions, and various other factors 
                  that are beyond our control.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">TESTIMONIAL DISCLOSURE</h2>
                <p className="text-gray-700 leading-relaxed">
                  Testimonials and success stories featured on our website are from real customers and clients. 
                  However, these results are not typical and are not a guarantee of your success. Individual 
                  results will vary based on your business, implementation, market conditions, and other factors.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  We do not claim that you will duplicate the results stated in testimonials. Your results will 
                  depend on your background, knowledge, market conditions, and various other factors that are 
                  beyond our control.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">SPONSORED CONTENT</h2>
                <p className="text-gray-700 leading-relaxed">
                  From time to time, we may publish sponsored content or receive compensation for featuring 
                  certain products or services. When we do so, we will clearly disclose this relationship 
                  in accordance with FTC guidelines.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Sponsored content will be clearly marked as such, and our opinions remain honest and 
                  independent regardless of any compensation received.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">DISCLAIMER OF WARRANTIES</h2>
                <p className="text-gray-700 leading-relaxed">
                  The information on this website is provided "as is" without any representations or warranties, 
                  express or implied. We make no representations or warranties in relation to this website or 
                  the information and materials provided on this website.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Without prejudice to the generality of the foregoing paragraph, we do not warrant that:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>This website will be constantly available, or available at all</li>
                  <li>The information on this website is complete, true, accurate, or non-misleading</li>
                  <li>This website will meet your specific requirements</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">LIMITATION OF LIABILITY</h2>
                <p className="text-gray-700 leading-relaxed">
                  We will not be liable to you in relation to the contents of, or use of, or otherwise in 
                  connection with, this website for any indirect, special, or consequential loss; or for 
                  any business losses, loss of revenue, income, profits, or anticipated savings, loss of 
                  contracts or business relationships, loss of reputation or goodwill, or loss or corruption 
                  of information or data.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">CONTACT INFORMATION</h2>
                <p className="text-gray-700 leading-relaxed">
                  If you have any questions about this disclosure, please contact us at:
                </p>
                <div className="bg-gray-50 p-6 rounded-lg mt-4">
                  <p className="text-gray-700 mb-2">
                    <strong>Terramore.io, LLC</strong>
                  </p>
                  <p className="text-gray-700 mb-2">2108 N ST STE N</p>
                  <p className="text-gray-700 mb-2">SACRAMENTO, CA 95816</p>
                  <p className="text-gray-700">Email: contact@terramore.io</p>
                </div>
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
              <Logo size="md" className="text-white" />
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