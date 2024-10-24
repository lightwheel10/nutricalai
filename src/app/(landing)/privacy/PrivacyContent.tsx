'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import Footer from '@/components/landing/Footer'

export default function PrivacyContent() {
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
          <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-black">Privacy Policy</h1>
          
          <div className="prose prose-gray max-w-none">
            <p className="text-black mb-4">
              Last updated: [Current Date]
            </p>
            <p className="text-black mb-4">
              Nutrical AI (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered calorie tracking service.
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-black">1. Information We Collect</h2>
              <p className="text-black mb-4">
                We collect several types of information from and about users of our service, including:
              </p>
              <ul className="list-disc pl-6 text-black space-y-2">
                <li>Personal Information: Such as your name, email address, and phone number when you create an account or join our waitlist.</li>
                <li>Health and Fitness Data: Information you provide about your diet, exercise habits, weight, height, and other health-related data.</li>
                <li>Usage Data: Information on how you interact with our service, including features used, time spent, and other analytics.</li>
                <li>Device Information: Data about the device and internet connection you use to access our service, including hardware model, operating system, and browser type.</li>
                <li>Images: Photos of food that you upload for calorie estimation.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-black">2. How We Use Your Information</h2>
              <p className="text-black mb-4">
                We use the information we collect for various purposes, including to:
              </p>
              <ul className="list-disc pl-6 text-black space-y-2">
                <li>Provide, maintain, and improve our AI-powered calorie tracking service.</li>
                <li>Process and analyze the images you upload to estimate calorie content.</li>
                <li>Personalize your experience and deliver tailored content and recommendations.</li>
                <li>Communicate with you about our service, including sending updates, security alerts, and support messages.</li>
                <li>Monitor and analyze usage trends and preferences to improve our service and user experience.</li>
                <li>Protect against, identify, and prevent fraud and other illegal activities.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-black">3. Data Sharing and Disclosure</h2>
              <p className="text-black mb-4">
                We may share your information in the following situations:
              </p>
              <ul className="list-disc pl-6 text-black space-y-2">
                <li>With your consent or at your direction.</li>
                <li>With service providers who perform services on our behalf.</li>
                <li>To comply with legal obligations or respond to lawful requests.</li>
                <li>In connection with a merger, sale, or acquisition of all or a portion of our company.</li>
              </ul>
              <p className="text-black mt-4">
                We do not sell your personal information to third parties.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-black">4. Data Security</h2>
              <p className="text-black mb-4">
                We implement appropriate technical and organizational measures to protect the security of your personal information. However, please note that no method of transmission over the Internet or electronic storage is 100% secure.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-black">5. Your Rights and Choices</h2>
              <p className="text-black mb-4">
                Depending on your location, you may have certain rights regarding your personal information, including:
              </p>
              <ul className="list-disc pl-6 text-black space-y-2">
                <li>Accessing, correcting, or deleting your personal information.</li>
                <li>Objecting to or restricting certain processing of your data.</li>
                <li>Requesting portability of your personal information.</li>
                <li>Withdrawing consent at any time for processing based on consent.</li>
              </ul>
              <p className="text-black mt-4">
                To exercise these rights, please contact us using the information provided in the &quot;Contact Us&quot; section.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-black">6. Changes to This Privacy Policy</h2>
              <p className="text-black mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-black">7. Contact Us</h2>
              <p className="text-black mb-4">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <p className="text-black">
                Nutrical AI<br />
                [Company Address]<br />
                Email: privacy@nutricalai.com
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
