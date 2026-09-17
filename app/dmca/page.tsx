import type { Metadata } from "next"
import { SiteFooter } from "@/components/site-footer"

export const metadata: Metadata = {
  title: "DMCA Policy | Terramore",
  description:
    "Terramore.io DMCA policy for reporting copyright infringement on terramore.io, including how to contact the designated copyright agent.",
  alternates: { canonical: "https://www.terramore.io/dmca" },
}

export default function DMCAPage() {
  return (
    <div className="min-h-screen bg-white">
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

      <SiteFooter />
    </div>
  )
}
