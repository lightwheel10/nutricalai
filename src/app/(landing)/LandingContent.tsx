'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { ArrowRight } from 'lucide-react'
import logoImage from './nutrical-ai-logo.png'
import { PhoneScreen } from '@/components/phone-preview/PhoneScreen'
import Features from '@/components/landing/Features'
import Pricing from '@/components/landing/Pricing'
import Waitlist from '@/components/landing/Waitlist'
import TestimonialMarquee from '@/components/landing/TestimonialMarquee'
import Footer from '@/components/landing/Footer'
import WaitlistPopup from '@/components/landing/WaitlistPopup'
import AvatarCircles from '@/components/landing/AvatarCircles'
import { useScreenSize } from '@/hooks/useScreenSize'
import MobileLandingContent from '@/components/landing/MobileLandingContent'
import { usePageTracking, useTimeOnPage } from '@/hooks/useAnalytics'
import { trackEvent } from '@/lib/analytics/config'

const avatarUrls = [
  "https://avatars.githubusercontent.com/u/16860528",
  "https://avatars.githubusercontent.com/u/20110627",
  "https://avatars.githubusercontent.com/u/106103625",
  "https://avatars.githubusercontent.com/u/59228569",
]

const steps = [
  { 
    number: '1', 
    title: 'Snap, Speak, or Type', 
    description: 'Log meals in your language using voice, text, or photos - as natural as telling a friend what you ate.',
    stat: '93% faster than manual logging'
  },
  { 
    number: '2', 
    title: 'Let AI Do The Math', 
    description: 'Instant nutritional breakdown with precise calories, macros, and micronutrients - no guesswork needed.',
    stat: '99.9% accuracy in analysis'
  },
  { 
    number: '3', 
    title: 'Achieve Your Goals', 
    description: 'Get personalized insights and track your progress with easy-to-understand dashboards and trends.',
    stat: '87% of users reach their goals'
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    $crisp: any;
    CRISP_WEBSITE_ID: string;
  }
}

export default function LandingContent() {
  usePageTracking()
  useTimeOnPage('Desktop Landing')

  const [isScrolled, setIsScrolled] = useState(false)
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false)
  const isMobile = useScreenSize()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // Crisp chat script
    window.$crisp = [];
    window.CRISP_WEBSITE_ID = "26f1ae60-b2b2-4824-ad62-15559384c1f5";
    
    const d = document;
    const s = d.createElement("script");
    s.src = "https://client.crisp.chat/l.js";
    s.async = true;
    d.getElementsByTagName("head")[0].appendChild(s);

    // Cleanup function to remove the script when component unmounts
    return () => {
      const script = d.querySelector('script[src="https://client.crisp.chat/l.js"]');
      if (script) {
        script.remove();
      }
      if (window.$crisp) {
        delete window.$crisp;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (window as any).CRISP_WEBSITE_ID;
    };
  }, []);

  const scrollTo = (id: string) => {
    trackEvent({
      action: 'navigation',
      category: 'User Interaction',
      label: `Scroll to ${id}`,
    })
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const openWaitlist = () => {
    trackEvent({
      action: 'button_click',
      category: 'User Interaction',
      label: 'Join Waitlist',
    })
    setIsWaitlistOpen(true)
  }
  const closeWaitlist = () => setIsWaitlistOpen(false)

  if (isMobile) {
    return <MobileLandingContent />
  }

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      <header className={`px-4 lg:px-6 h-16 flex items-center fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-white'}`}>
        <Link className="flex items-center justify-center" href="#">
          <div className="w-8 h-8 sm:w-10 sm:h-10 relative mr-2 sm:mr-3">
            <Image
              src={logoImage}
              alt="Nutrical AI Logo"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <span className="text-lg sm:text-xl font-bold">Nutrical AI</span>
        </Link>
        <nav className="ml-auto flex gap-2 sm:gap-4">
          <Button variant="ghost" className="hidden sm:inline-flex" onClick={() => scrollTo('features')}>Features</Button>
          <Button variant="ghost" className="hidden sm:inline-flex" onClick={() => scrollTo('pricing')}>Pricing</Button>
          <Button variant="outline" onClick={openWaitlist}>Join</Button>
        </nav>
      </header>

      <main className="flex-1 pt-16">
        <section className="w-full py-8 sm:py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col lg:flex-row items-center justify-center space-y-8 lg:space-y-0 lg:space-x-8 text-center lg:text-left">
              <div className="flex-1 space-y-4 max-w-3xl">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
                  Say Goodbye to Manual Food Tracking
                </h1>
                <p className="mx-auto lg:mx-0 max-w-[700px] text-gray-600 text-base sm:text-lg md:text-xl">
                No more searching databases or guessing portions. Simply tell our AI what you&apos;re eating - in any language - and get instant nutritional insights. It&apos;s that easy.
                </p>
                <div className="space-x-4">
                  <Button size="lg" className="bg-gray-900 text-white hover:bg-gray-800" onClick={openWaitlist}>
                  Get Early Access
                  </Button>
                </div>
                <div className="pt-4">
                  <AvatarCircles numPeople={99} avatarUrls={avatarUrls} />
                </div>
              </div>
              <div className="flex-1 relative max-w-md w-full mt-8 lg:mt-0">
                <div className="relative w-[240px] sm:w-[280px] h-[480px] sm:h-[560px] rounded-[40px] bg-gray-800 p-4 shadow-xl overflow-hidden mx-auto">
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-6 bg-gray-800 rounded-b-2xl"></div>
                  <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gray-700 rounded-full"></div>
                  <div className="w-full h-full bg-white rounded-[32px] overflow-hidden relative">
                    <PhoneScreen />
                  </div>
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1/4 h-1 bg-gray-700 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-16 sm:py-24 md:py-32 lg:py-48 bg-gray-50">
          <div className="container px-4 md:px-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12 sm:mb-16">How It Works</h2>
            <motion.div 
              className="flex flex-col md:flex-row justify-between items-start max-w-6xl mx-auto"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {steps.map((step, index) => (
                <motion.div 
                  key={index} 
                  className="flex flex-col items-center mb-12 md:mb-0 md:w-1/3 text-center relative"
                  variants={itemVariants}
                >
                  <div className="w-16 h-16 bg-gray-900 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm sm:text-base mb-4">{step.description}</p>
                  <p className="text-gray-900 font-semibold text-sm sm:text-base">{step.stat}</p>
                  {index < steps.length - 1 && (
                    <ArrowRight className="hidden md:block text-gray-400 absolute top-1/2 -right-4 transform -translate-y-1/2" />
                  )}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="w-full py-24 md:py-32 lg:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1 space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Effortless Calorie Tracking
                </h2>
                <p className="text-gray-600 md:text-xl">
                  Our AI-powered app makes calorie tracking a breeze. Simply tell the AI what you had for your meal, and let our advanced algorithms do the rest.
                </p>
                <Button className="bg-gray-900 text-white hover:bg-gray-800" onClick={openWaitlist}>
                  Join Waitlist for Early Access
                </Button>
              </div>
              <div className="flex-1 w-full max-w-2xl">
                <div className="w-full rounded-lg overflow-hidden shadow-2xl relative">
                  <div className="bg-gray-800 p-2 flex items-center">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="flex-1 flex justify-center">
                      <div className="bg-gray-700 rounded px-2 py-1 text-xs text-gray-300">
                        www.nutricalai.com
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <Image
                      src="/nutricalai-dashboard.png"
                      alt="NutricalAI Dashboard Preview"
                      width={600}
                      height={400}
                      className="w-full h-auto filter blur-sm"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                      <p className="text-xl font-bold text-white">Website Coming Soon</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Pricing />

        <Features />

        <Waitlist />

        <TestimonialMarquee />

      </main>

      <WaitlistPopup
        isOpen={isWaitlistOpen}
        onClose={closeWaitlist}
      />

      <Footer />
    </div>
  )
}
