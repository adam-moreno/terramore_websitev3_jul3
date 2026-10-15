// Updated 2026-10-12 for the AI phone assistant (disclosure on request, call transfer, caller lookup, training use). Updated 2026-10-11 for SMS, connected data, billing and financing. Plain-language draft; have counsel review before relying on it.
import type { Metadata } from "next"
import { PlainEmail } from "@/components/plain-email"
import { SiteFooter } from "@/components/site-footer"

export const metadata: Metadata = {
  title: "Privacy Policy | Terramore.io",
  description:
    "How Terramore collects, uses, and shares personal information on terramore.io, including California privacy rights and how to contact us.",
  alternates: { canonical: "https://www.terramore.io/privacy" },
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
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
              <p className="text-gray-600 mb-0">Last Updated October 15, 2026</p>
            </div>

            <div className="space-y-8">
              <section>
                <p className="text-gray-700 leading-relaxed">
                  Terramore LLC ("Terramore," "us," "we," or "our") thanks you for visiting the online and mobile resources we
                  publish. We use the words "you" and "your" to mean you, the reader, and other visitors to our online
                  and mobile resources who are, in all cases, 18 or older. Our privacy statement ("this
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
                  Terramore is a marketing services and software company. We run marketing for businesses (ads, content, websites and automation). We also offer software: the TerraIQ dashboard for clients and a free Growth Workspace for business owners. For residents from the GDPR Jurisdictions, as defined
                  below, and some US state privacy laws, Terramore LLC is the data controller responsible for your
                  personal data. For residents of California, Terramore LLC is a "Business."
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
                  Terramore may use the information we collect from and about you for a variety of business
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

                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Google Maps Platform</h3>
                <p className="text-gray-700 leading-relaxed">
                  When you request a Digital Footprint report, we send the business name and website you give us to
                  Google Maps Platform to look for a matching Google Maps listing. We use the listing&apos;s details to
                  help calculate your report&apos;s scores, and we do not keep those details. If the listing&apos;s website
                  matches the website you gave us, we keep Google&apos;s place identifier for that listing. Google
                  processes these requests under the{" "}
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Google Privacy Policy
                  </a>
                  . Use of Google Maps features and content is subject to the{" "}
                  <a
                    href="https://maps.google.com/help/terms_maps/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Google Maps/Google Earth Additional Terms of Service
                  </a>
                  .
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Service Providers</h3>
                <p className="text-gray-700 leading-relaxed">
                  We use service providers to run our business. They process data for us, to provide their service to
                  us. These are the kinds of providers we use, with examples:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>
                    <strong>Hosting</strong> – Vercel.
                  </li>
                  <li>
                    <strong>Database</strong> – Supabase.
                  </li>
                  <li>
                    <strong>Sign-in</strong> – Clerk.
                  </li>
                  <li>
                    <strong>Email</strong> – Resend.
                  </li>
                  <li>
                    <strong>Text messaging</strong> – Sendblue and Twilio.
                  </li>
                  <li>
                    <strong>Phone and AI phone assistant</strong> – Retell AI.
                  </li>
                  <li>
                    <strong>Data connectors</strong> – Windsor.ai.
                  </li>
                  <li>
                    <strong>AI processing</strong> – Anthropic, for drafting and sorting messages and reports.
                  </li>
                  <li>
                    <strong>Payments and financing</strong> – Stripe and PayPal.
                  </li>
                  <li>
                    <strong>Scheduling and meetings</strong> – Microsoft Outlook and Google Meet.
                  </li>
                  <li>
                    <strong>Analytics and advertising</strong> – Google Analytics, Google Ads and Meta.
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">No Sharing for Others&apos; Marketing</h3>
                <p className="text-gray-700 leading-relaxed">
                  We never share your personal information with third parties or affiliates for their own marketing.
                  Service providers may use it only to provide their service to us.
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
                <h2 className="text-2xl font-bold text-gray-900 mb-4">CONNECTED ACCOUNTS</h2>
                <p className="text-gray-700 leading-relaxed">
                  In our free Growth Workspace, and in TerraIQ, you can connect business tools. Examples are Shopify,
                  Square, Instagram, a Facebook Page, Google Ads, Meta Ads and Google Analytics. In the Growth
                  Workspace, you can connect up to 2 tools.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Connections go through Windsor.ai, a data connector service. You sign in to the tool yourself and
                  choose which account to connect.
                </p>
                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">What we receive</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Business totals, such as sales, orders, reach, ad spend and website sessions.</li>
                  <li>For Instagram, the captions of your own posts.</li>
                </ul>
                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">What we don&apos;t ask for</h3>
                <p className="text-gray-700 leading-relaxed">
                  We do not request customer-level personal data. That means we don&apos;t ask for the names, emails,
                  phone numbers or addresses of your customers.
                </p>
                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">How we use it</h3>
                <p className="text-gray-700 leading-relaxed">
                  We use connected data to show your business numbers and build your reports.
                </p>
                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">How to disconnect</h3>
                <p className="text-gray-700 leading-relaxed">
                  You can disconnect at any time. Revoke our access in the tool&apos;s own settings, or email us at{" "}
                  <PlainEmail address="admin@terramore.io" />. Once you disconnect, we stop pulling new data.
                </p>
                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">How long we keep it</h3>
                <p className="text-gray-700 leading-relaxed">
                  We keep connected data while your connection is active. We delete it within 30 days after you
                  disconnect, close your account or ask us to delete it. We may keep aggregated or de-identified totals
                  that don&apos;t identify your business.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">TEXT MESSAGES (SMS)</h2>
                <p className="text-gray-700 leading-relaxed">
                  We text you only if you give us your mobile number and agree to receive texts. We may text you to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>reply to your report request;</li>
                  <li>confirm and remind you about a booked call; and</li>
                  <li>follow up from our team about your request.</li>
                </ul>
                <p className="text-gray-700 leading-relaxed">
                  To get texts about your report request, check the separate, optional &ldquo;Text me about my report
                  and booking&rdquo; box on our form. Booking confirmations and reminders go to the number you give
                  when you book a call.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Texts come from Terramore&apos;s business number. We send them through Sendblue, and sometimes Twilio.
                  Message frequency varies (typically up to 4 messages per request or booking). Message and data rates
                  may apply. Reply STOP to opt out. Reply HELP for help, or email{" "}
                  <PlainEmail address="support@terramore.io" />.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Marketing texts are optional and separate from these service texts. You don&apos;t have to agree to
                  texts to buy anything from us.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  <strong>
                    We do not share mobile numbers or SMS consent with third parties or affiliates for their marketing
                    purposes.
                  </strong>{" "}
                  This applies even where other parts of this statement allow sharing.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">PHONE CALLS</h2>
                <p className="text-gray-700 leading-relaxed">
                  When you call us, an automated assistant that uses AI may answer. If you ask whether you are speaking
                  with an AI, it will tell you. At the start of each call, we tell you that the call is recorded. Calls are
                  recorded and transcribed. We use the recording and transcript to take your message, connect you with our
                  team, book a call with you and improve our service, including training and evaluating the assistant. If
                  the assistant transfers your call, the team member may hear a short summary of what you told it. To
                  prepare our team for the call, we may match the number you call from to information we already hold
                  about you, such as a report you requested or an earlier call, and look up the caller name your phone
                  carrier provides and public information about your business, such as its Google listing. We do not buy
                  personal data about callers. Our phone and AI assistant provider is Retell AI.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">AI PROCESSING</h2>
                <p className="text-gray-700 leading-relaxed">
                  We use AI from Anthropic to help draft messages and reports and to sort incoming requests. To do that,
                  we send it the information needed for the task, such as your request or your connected business
                  totals. Anthropic does not use this data to train its public models.
                </p>
              </section>

              <section id="terraai-extension">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">TERRAAI CHROME EXTENSION</h2>
                <p className="text-gray-700 leading-relaxed">
                  TerraAI is Terramore&apos;s AI assistant, powered by Claude from Anthropic. The Terramore extension for
                  Google Chrome lets TerraAI make one website fix with you, in a tab in your own browser, after you start
                  that fix from your Growth Workspace. This section explains what the extension handles. The rest of this
                  privacy statement also applies.
                </p>
                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">What it reads, and when</h3>
                <p className="text-gray-700 leading-relaxed">
                  Only while a fix you started is running, and only in the tab that fix opened, the extension reads that
                  page: its layout and labels, its visible text, and screenshots of it. It doesn&apos;t read your other
                  tabs, your browsing history, your passwords or saved logins. It does nothing until you start a fix,
                  and it stops when the fix ends or you press Stop.
                </p>
                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">What it sends, and to whom</h3>
                <p className="text-gray-700 leading-relaxed">
                  The extension sends what it reads to Terramore&apos;s servers (dashboard.terramore.io). We send it to
                  Anthropic, our AI provider, to decide the next step of your fix. Anthropic doesn&apos;t use this data
                  to train its public models. We don&apos;t sell it, share it for advertising, or use it for anything
                  except making the fix you asked for and showing you its result.
                </p>
                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">What it won&apos;t do</h3>
                <p className="text-gray-700 leading-relaxed">
                  TerraAI doesn&apos;t type on login, security-code or payment screens, doesn&apos;t pay for anything,
                  and doesn&apos;t delete anything. Nothing is saved on your website until you approve the exact change
                  with Save it.
                </p>
                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">How long we keep it</h3>
                <p className="text-gray-700 leading-relaxed">
                  While a fix runs, we keep TerraAI&apos;s working notes with a few recent screenshots. When the fix
                  ends, we delete the screenshots and working notes and keep a short log of the steps taken, without
                  screenshots and without anything TerraAI typed, so your Growth Workspace can show what was done. In
                  your browser, the extension keeps the current fix&apos;s session until Chrome closes, and the list of
                  sites you&apos;ve allowed TerraAI to work on until you remove the extension.
                </p>
                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Your choices</h3>
                <p className="text-gray-700 leading-relaxed">
                  Press Stop at any time, or remove the extension from Chrome. To ask us to delete your fix logs, email{" "}
                  <PlainEmail address="hello@terramore.io" />. The use of information received from the extension adheres to the Chrome Web
                  Store User Data Policy, including the Limited Use requirements.
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
                  <strong>Emails:</strong> If you consented to receive direct marketing from Terramore, we
                  provide you with the opportunity to opt out of our marketing communications or change your preferences
                  by following a link in the footer of all non-transactional email messages from us or by emailing us at{" "}
                  <PlainEmail address="admin@terramore.io" />.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  <strong>Texts:</strong> Reply STOP to any text from us to stop receiving texts.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  <strong>Connected accounts:</strong> Revoke access in the tool, or email us to disconnect and to ask
                  us to delete your connected data.
                </p>
              </section>

              <section id="retention">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">HOW LONG WE KEEP INFORMATION</h2>
                <p className="text-gray-700 leading-relaxed">
                  We keep information only as long as we need it. These are our retention periods:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>
                    <strong>Connected data</strong> – kept while the connection is active. Deleted within 30 days after
                    you disconnect, close your account or ask us to delete it. We may keep aggregated or de-identified
                    totals that don&apos;t identify your business.
                  </li>
                  <li>
                    <strong>Call recordings and transcripts</strong> – kept up to 12 months, then deleted.
                  </li>
                  <li>
                    <strong>Text message consent and opt-out records</strong> – kept for 5 years, so we can show that
                    you agreed or opted out.
                  </li>
                  <li>
                    <strong>Text message content and logs</strong> – kept up to 24 months.
                  </li>
                  <li>
                    <strong>Report and lead data</strong> – kept while we have an active relationship with you, and up
                    to 3 years after our last contact. Then we delete or anonymize it.
                  </li>
                </ul>
                <p className="text-gray-700 leading-relaxed">
                  We may keep information longer if we need it for a dispute, to enforce our agreements or to meet a
                  legal obligation.
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
                  To exercise your rights under California law, contact us at <PlainEmail address="admin@terramore.io" />. We may ask you to
                  fill out a request form. The CCPA only allows us to act on your request if we can verify your identity
                  or your authority to make the request so you will also need to follow our instructions for identity
                  verification.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">CHANGES TO THIS PRIVACY STATEMENT</h2>
                <p className="text-gray-700 leading-relaxed">
                  This privacy statement was last updated on October 15, 2026, and is effective as of that date. The
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
                  <p className="text-gray-700 mb-2">Terramore LLC</p>
                  <p className="text-gray-700 mb-2">2108 N St Ste N</p>
                  <p className="text-gray-700 mb-2">Sacramento, CA 95816</p>
                  <p className="text-gray-700">
                    Email: <PlainEmail address="admin@terramore.io" />
                  </p>
                </div>
                <p className="text-gray-600 text-sm mt-6">© 2026 Terramore LLC. Terramore is owned and operated by Adam Moreno.</p>
              </section>
            </div>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  )
}
