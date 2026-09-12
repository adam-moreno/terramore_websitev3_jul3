import { SiteFooter } from "@/components/site-footer"

export default function DisclosurePage() {
  return (
    <div className="min-h-screen bg-white">
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

      <SiteFooter />
    </div>
  )
}
