'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import Footer from '@/components/landing/Footer'

export default function TermsContent() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="px-4 lg:px-6 h-16 flex items-center fixed top-0 w-full z-50 bg-white shadow-sm">
        <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Home
        </Link>
      </header>

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-black">Terms of Service</h1>
          
          <div className="prose prose-gray max-w-none">
            <p className="text-black mb-4">
              Last updated: [Current Date]
            </p>
            <p className="text-black mb-4">
              Please read these Terms of Service (&quot;Terms&quot;, &quot;Terms of Service&quot;) carefully before using the Nutrical AI website and AI-powered calorie tracking service (the &quot;Service&quot;) operated by Nutrical AI (&quot;us&quot;, &quot;we&quot;, or &quot;our&quot;).
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-black">1. Acceptance of Terms</h2>
              <p className="text-black mb-4">
                By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-black">2. Description of Service</h2>
              <p className="text-black mb-4">
                Nutrical AI provides an AI-powered calorie tracking service that allows users to track their food intake and estimate calorie content through image recognition technology.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-black">3. User Accounts</h2>
              <p className="text-black mb-4">
                When you create an account with us, you must provide accurate, complete, and up-to-date information. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
              </p>
              <p className="text-black mb-4">
                You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-black">4. Content and Conduct</h2>
              <p className="text-black mb-4">
                Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, or images. You are responsible for the content that you post to the Service, including its legality, reliability, and appropriateness.
              </p>
              <p className="text-black mb-4">
                You agree not to use the Service for any unlawful purposes or to conduct any unlawful activity, including, but not limited to, fraud, embezzlement, money laundering or insider trading.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-black">5. Intellectual Property</h2>
              <p className="text-black mb-4">
                The Service and its original content (excluding content provided by users), features and functionality are and will remain the exclusive property of Nutrical AI and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-black">6. Termination</h2>
              <p className="text-black mb-4">
                We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-black">7. Limitation of Liability</h2>
              <p className="text-black mb-4">
                In no event shall Nutrical AI, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-black">8. Disclaimer</h2>
              <p className="text-black mb-4">
                Your use of the Service is at your sole risk. The Service is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. The Service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement or course of performance.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-black">9. Governing Law</h2>
              <p className="text-black mb-4">
                These Terms shall be governed and construed in accordance with the laws of [Your State/Country], without regard to its conflict of law provisions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-black">10. Changes to Terms</h2>
              <p className="text-black mb-4">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-black">11. Contact Us</h2>
              <p className="text-black mb-4">
                If you have any questions about these Terms, please contact us at:
              </p>
              <p className="text-black">
                Nutrical AI<br />
                [Company Address]<br />
                Email: legal@nutricalai.com
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
