"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Cookie, ChevronDown, Menu } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { IClosedWidget } from "@/components/iclosed-widget"
import { useSchedulePopup } from "@/hooks/use-schedule-popup"
import { useDoNotSellPopup } from "@/hooks/use-do-not-sell-popup"
import { DoNotSellPopup } from "@/components/do-not-sell-popup"
import { Logo } from "@/components/logo"

export default function PrivacyPolicyPage() {
  const { isPopupOpen, setIsPopupOpen } = useSchedulePopup()
  const { isOpen: isDoNotSellOpen, openPopup: openDoNotSell, closePopup: closeDoNotSell } = useDoNotSellPopup()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white hover:text-blue-300"
            >
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-slate-700">
            <div className="flex flex-col space-y-4 mt-4">
              <Link href="/courses/scaling" className="hover:text-blue-300 transition-colors pl-4">
                Scaling Course
              </Link>
              <Link href="/courses/offers" className="hover:text-blue-300 transition-colors pl-4">
                Offers Course
              </Link>
              <Link href="/courses/leads" className="hover:text-blue-300 transition-colors pl-4">
                Leads Course
              </Link>
              <Link href="/solutions" className="hover:text-blue-300 transition-colors">
                Solutions
              </Link>
              <Link href="/partner" className="hover:text-blue-300 transition-colors">
                Partner With Us
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Privacy Policy Content */}
      <div className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">PRIVACY POLICY</h1>
            <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">PRIVACY STATEMENT</h2>
              <p className="text-gray-600 mb-0">Last Updated February 4, 2025</p>
            </div>

            <div className="space-y-8">
              <section>
                <p className="text-gray-700 leading-relaxed">
                  Terramore.io, LLC ("us," "we," or "our") thanks you for visiting the online and mobile resources we
                  publish. We use the words "you" and "your" to mean you, the reader, and other visitors to our online
                  and mobile resources who are, in all cases, over the age of 13. Our privacy statement ("this
                  statement," "this privacy statement," and "our statement") informs you about from whom and the types
                  of personal information we collect, how we use it, who we share it with and why, and what we do to try
                  to protect it.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Online and mobile resources mean the websites and other internet features we own that allow you to
                  interact with our websites, as well as apps we've created and distributed to let our customers and
                  followers view our online and mobile resources or otherwise interact with the content we provide.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  <strong>California Notice of Collection of Personal Information:</strong> To learn more about your
                  California privacy rights, please scroll down to "THE CALIFORNIA CONSUMER PRIVACY ACT."
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">WHO WE ARE</h2>
                <p className="text-gray-700 leading-relaxed">
                  Terramore.io, LLC is a Sales Training company. For residents from the GDPR Jurisdictions, as defined
                  below, and some US state privacy laws, Terramore.io, LLC is the data controller responsible for your
                  personal data. For residents of California, Terramore.io, LLC is a "Business."
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">WHO WE COLLECT PERSONAL INFORMATION FROM</h2>
                <p className="text-gray-700 leading-relaxed">
                  We may collect personal information from the following groups of data subjects: visitors to, and users
                  of, our online and mobile resources; our customers; current members of our workforce and those who
                  apply for posted jobs; and third-party vendors and business partners.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Personal information generally means information that can be used to identify you or that can be
                  easily linked to you (for example, your name, address, telephone number, email address, social
                  security number and date of birth). The privacy laws in some jurisdictions include unique elements in
                  what they consider to be the personal information of the consumers or data subjects they protect. If
                  those laws apply to us, as in the case of the California Consumer Privacy Act ("CCPA") or European
                  General Data Protection Regulation ("GDPR"), our use of the phrase "personal information" includes the
                  unique elements required by such laws.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  The categories of information we collect from each of these groups, and the ways in which we use it,
                  differs. As you may have noticed, it's possible that the same person could fall into more than one
                  group. Most of this statement addresses our processing and sharing of personal information collected
                  from visitors to and users of our online and mobile resources and our customers.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">WHAT WE COLLECT</h2>
                <p className="text-gray-700 leading-relaxed">
                  There are two types of information that we obtain from you online and then store and use: (i)
                  non-personal information that's collected automatically from each visitor, such as your device
                  operating system; and (ii) personal information that you voluntarily provide to us or that is
                  collected automatically.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  By using our online and mobile resources or purchasing our products or services, you are signifying to
                  us that you agree with this section of our privacy statement and that we may use and disclose your
                  information as described.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Voluntarily Submitted Information</h3>
                <p className="text-gray-700 leading-relaxed">
                  If you participate in certain activities via our online and mobile resources, you may be asked to
                  provide us with information about yourself. The types of personal information we collect in those
                  situations includes identifiers (such as your name, email address, physical address, and phone
                  number), professional information (such as the business you are in), and financial account information
                  (such as your credit card information). We do not sell, rent, or trade voluntarily submitted personal
                  information with third parties.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  If you don't want us to collect this type of personal information, please don't provide it. This means
                  you shouldn't participate in the activities on our online and mobile resources that request or require
                  it and you may want to communicate with us by phone or regular mail instead. Participation is strictly
                  your choice. Not participating may limit your ability to take full advantage of the online and mobile
                  resources, but it will not affect your ability to access certain information available to the general
                  public on the online and mobile resources.
                </p>

                <h4 className="text-lg font-semibold text-gray-900 mt-4 mb-2">
                  Some of the ways you voluntarily give us your personal information and how we use it:
                </h4>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>
                    <strong>Emails and Online Forms</strong> – When you send us an email or fill out an online form,
                    such as to contact us, your email address and any other personal information (e.g., home address or
                    phone number) that may be in the content of your message or attached to it, are retained by us and
                    used to respond back directly to you and to process your request.
                  </li>
                  <li>
                    <strong>Registering for an Account</strong> – When you register for an account, you submit personal
                    information to us such as your name and email address which we then retain. We use that information
                    to create and manage your account and, in some cases, establish a password and profile to
                    communicate with you via email.
                  </li>
                  <li>
                    <strong>Registering for Events</strong> – When you register for services, webinars, events,
                    conferences, or programs we ourselves may host, you will be submitting the types of identifiers
                    described above.
                  </li>
                  <li>
                    <strong>Becoming a Subscriber to Our Service</strong> – We use any information provided from our
                    customers to perform our contractual obligations and provide the products and services purchased to
                    them, to manage their accounts and communicate with them.
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Automatically Collected Information</h3>
                <p className="text-gray-700 leading-relaxed">
                  When you visit our online and mobile resources, basic information is passively collected through your
                  web browser via use of tracking technologies, such as a "cookie" which is a small text file that is
                  downloaded onto your computer or mobile device when you access the online and mobile resources.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  We allow third party vendors to use cookies or similar technologies to collect information about your
                  browsing activities over time following your use of the site. For example, we use Google Analytics, a
                  web analytics service provided by Google, Inc. ("Google"). Google Analytics uses cookies to help us
                  analyze how you use the online and mobile resources and enhance your experience when you visit the
                  online and mobile resources.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">HOW WE USE YOUR INFORMATION</h2>
                <p className="text-gray-700 leading-relaxed">
                  Terramore.io, LLC may use the information we collect from and about you for a variety of business
                  purposes; in general, to provide the services, improve customer experience and engagement and develop
                  the services. We are committed to protecting and maintaining the privacy of your information.
                  Therefore, we will process your data only in accordance with applicable data protection law and this
                  Privacy Statement.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                  We will have a lawful basis for processing your data if:
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>
                    we need to process your information in order to provide you with the products or service you have
                    requested or to enter into a contract;
                  </li>
                  <li>you have consented to such processing;</li>
                  <li>
                    we have a legitimate interest for processing your data – e.g., for fraud prevention; direct
                    marketing; network and information systems security; data analytics; enhancing modifying or
                    improving our services; identifying usage trends; determining the effectiveness of promotional
                    campaigns; and advertising personalization of the service using data to make it easier and faster
                    for you to place orders; and/or
                  </li>
                  <li>we are legally obliged to process it.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  WHEN/WITH WHOM DO WE SHARE PERSONAL INFORMATION
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  We use voluntarily provided personal information to respond to your inquiries and provide you with the
                  services you have requested, amongst other uses as further described below. We do not sell or rent
                  your personal information to third party data vendors or marketing companies. As you might expect, we
                  disclose your information when required by law.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Affiliates</h3>
                <p className="text-gray-700 leading-relaxed">
                  In addition to those third parties set forth above, we may share your information, including personal
                  information, within our family of companies. Those companies will use such information in generally
                  the same manner as we do under this privacy statement which includes sending you information about
                  their products, services, or initiatives that may be of interest to you.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Legally Compelled Disclosures</h3>
                <p className="text-gray-700 leading-relaxed">
                  We may disclose your information, including personal information, to government authorities, and to
                  other third parties when compelled to do so by such government authorities, or at our discretion or
                  otherwise as required or permitted by law, including but not limited to responding to court orders and
                  subpoenas.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  EMAIL COMMUNICATIONS, NEWSLETTERS, AND MARKETING
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  We may use Your Personal Data to contact You with newsletters, marketing or promotional materials and
                  other information that may be of interest to You. You may opt-out of receiving any, or all, of these
                  communications from Us by following the unsubscribe link or instructions provided in any email We send
                  or by contacting Us.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">PAYMENTS</h2>
                <p className="text-gray-700 leading-relaxed">
                  We may provide paid products and/or services within the Service. In that case, we may use third-party
                  services for payment processing (e.g. payment processors).
                </p>
                <p className="text-gray-700 leading-relaxed">
                  We will not store or collect Your payment card details. That information is provided directly to Our
                  third-party payment processors whose use of Your personal information is governed by their Privacy
                  Policy. These payment processors adhere to the standards set by PCI-DSS as managed by the PCI Security
                  Standards Council, which is a joint effort of brands like Visa, Mastercard, American Express and
                  Discover.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">YOUR RIGHTS AND OPTIONS</h2>
                <p className="text-gray-700 leading-relaxed">
                  You may have to provide personal information to enjoy most of the features of our online and mobile
                  resources. Moreover, you can opt out of certain activities like newsletters and announcements.
                  Residents of California and EU data subjects whose personal information was obtained while they were
                  in California or a GDPR Jurisdiction, respectively, have certain additional rights.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  <strong>Emails:</strong> If you consented to receive direct marketing from Terramore.io, LLC, we
                  provide you with the opportunity to opt out of our marketing communications or change your preferences
                  by following a link in the footer of all non-transactional email messages from us or by emailing us at
                  contact@terramore.io.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">CHILDREN'S PRIVACY</h2>
                <p className="text-gray-700 leading-relaxed">
                  Federal law imposes special restrictions and obligations on commercial website operators who direct
                  their operations toward, and collect and use information from, children under the age of 13. We take
                  those age-related requirements very seriously, and consistent with it do not intend for our online and
                  mobile resources to be used by children under the age of 18. If we become aware that anyone under the
                  age of 18 has submitted personal information to our online and mobile resources, we will delete that
                  information and will not use it for any purpose whatsoever.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">HOW WE PROTECT COLLECTED PERSONAL INFORMATION</h2>
                <p className="text-gray-700 leading-relaxed">
                  We will take all reasonable security precautions to protect your personal information provided to our
                  online and mobile resources. We have adopted a security program that includes technical,
                  organizational, administrative, and other security measures designed to protect, in a manner
                  consistent with accepted industry standards and applicable law, against anticipated or actual threats
                  to the security of personal information.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">THE CALIFORNIA CONSUMER PRIVACY ACT</h2>
                <p className="text-gray-700 leading-relaxed">
                  When we collect personal information from California residents, we become subject to, and those
                  residents have rights under, the California Consumer Privacy Act or "CCPA". This section of our
                  statement is used to allow us to fulfill our CCPA obligations and explain your CCPA rights.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  To exercise your rights under California law, contact us at contact@terramore.io. We may ask you to
                  fill out a request form. The CCPA only allows us to act on your request if we can verify your identity
                  or your authority to make the request so you will also need to follow our instructions for identity
                  verification.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">CHANGES TO THIS PRIVACY STATEMENT</h2>
                <p className="text-gray-700 leading-relaxed">
                  This privacy statement was drafted on December 11th, 2024, and is effective as of this date. The
                  English language version of this privacy statement is the controlling version regardless of any
                  translation you may attempt.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  We reserve the right to change or update this statement from time to time. Please check our online and
                  mobile resources periodically for such changes since all information collected is subject to the
                  statement in place at that time.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">CONTACTING US</h2>
                <p className="text-gray-700 leading-relaxed">
                  If you have questions about our privacy statement or privacy practices, please contact us at:
                </p>
                <div className="bg-gray-50 p-6 rounded-lg mt-4">
                  <p className="text-gray-700 mb-2">
                    <strong>Attention Legal Department</strong>
                  </p>
                  <p className="text-gray-700 mb-2">Terramore.io, LLC</p>
                  <p className="text-gray-700 mb-2">2108 N ST STE N</p>
                  <p className="text-gray-700 mb-2">SACRAMENTO, CA 95816</p>
                  <p className="text-gray-700">Email: contact@terramore.io</p>
                </div>
                <p className="text-gray-600 text-sm mt-6">Copyright 2025 – Terramore.io, LLC - All Rights Reserved</p>
              </section>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Popup */}
      <IClosedWidget isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
      
      {/* Do Not Sell Popup */}
      <DoNotSellPopup isOpen={isDoNotSellOpen} onClose={closeDoNotSell} />
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
    </div>
  )
}
