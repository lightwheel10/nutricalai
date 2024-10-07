'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import Features from '@/components/landing/Features'
import Waitlist from '@/components/landing/Waitlist'
import WaitlistPopup from '@/components/landing/WaitlistPopup'
import Pricing from '@/components/landing/Pricing'
import TestimonialMarquee from '@/components/landing/TestimonialMarquee'
import AvatarCircles from "@/components/landing/AvatarCircles";
import { PhoneScreen } from '@/components/phone-preview/PhoneScreen';
import Footer from '@/components/landing/Footer';
import Image from 'next/image';
import logoImage from './nutrical-ai-logo.png'  //

const avatarUrls = [
  "https://avatars.githubusercontent.com/u/16860528",
  "https://avatars.githubusercontent.com/u/20110627",
  "https://avatars.githubusercontent.com/u/106103625",
  "https://avatars.githubusercontent.com/u/59228569",
];

const steps = [
  {
    number: "1",
    title: "Log Your Meal",
    description: "Use voice, text, or photo to easily log your meals.",
  },
  {
    number: "2",
    title: "AI Analysis",
    description: "Our AI recognizes the food and calculates calories, macros, and micros.",
  },
  {
    number: "3",
    title: "Track Progress",
    description: "Monitor your calorie intake and nutritional balance effortlessly.",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
}

export default function LandingContent() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false)
  // const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const openWaitlist = () => setIsWaitlistOpen(true)
  const closeWaitlist = () => setIsWaitlistOpen(false)

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      <header className={`px-4 lg:px-6 h-16 flex items-center fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-white'}`}>
        <Link className="flex items-center justify-center" href="#">
          <div className="w-10 h-10 relative mr-3">
            <Image
              src={logoImage}
              alt="Nutrical AI Logo"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <span className="text-xl font-bold">Nutrical AI</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Button variant="ghost" onClick={() => scrollTo('features')}>Features</Button>
          <Button variant="ghost" onClick={() => scrollTo('pricing')}>Pricing</Button>
          <Button variant="outline" onClick={openWaitlist}>Join Waitlist</Button>
        </nav>
      </header>

      <main className="flex-1 pt-16">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col lg:flex-row items-center justify-center space-y-4 lg:space-y-0 lg:space-x-8 text-center lg:text-left">
              <div className="flex-1 space-y-4 max-w-3xl">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none">
                  Track Calories with AI Precision
                </h1>
                <p className="mx-auto lg:mx-0 max-w-[700px] text-gray-600 md:text-xl lg:text-2xl">
                  Join our waitlist for the most advanced AI-powered calorie tracking app. Effortlessly manage your nutrition and reach your health goals.
                </p>
                <div className="space-x-4">
                  <Button size="lg" className="bg-gray-900 text-white hover:bg-gray-800" onClick={openWaitlist}>
                    Join Waitlist
                  </Button>
                </div>
                <div className="pt-4">
                  <AvatarCircles numPeople={99} avatarUrls={avatarUrls} />
                </div>
              </div>
              <div className="flex-1 relative max-w-md w-full">
                <div className="relative w-[280px] h-[560px] rounded-[40px] bg-gray-800 p-4 shadow-xl overflow-hidden mx-auto">
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

        <Features />

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
                <div className="w-full rounded-lg overflow-hidden shadow-2xl">
                  <div className="bg-gray-800 p-2 flex items-center">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="flex-1 flex justify-center">
                      <div className="bg-gray-700 rounded px-2 py-1 text-xs text-gray-300">
                        www.aicalorietracker.com
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-100 aspect-video flex items-center justify-center">
                    <p className="text-3xl font-bold text-gray-400">Website Coming Soon</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Pricing />

        <section className="w-full py-24 md:py-32 lg:py-48 bg-gray-50">
          <div className="container px-4 md:px-6">
            <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>
            <motion.div 
              className="flex flex-col md:flex-row justify-between items-start max-w-6xl mx-auto"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {steps.map((step, index) => (
                <motion.div 
                  key={index} 
                  className="flex flex-col items-center mb-8 md:mb-0 md:w-1/3 text-center relative"
                  variants={itemVariants}
                >
                  <div className="w-16 h-16 bg-gray-900 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600 mb-4">{step.description}</p>
                  {index < steps.length - 1 && (
                    <ArrowRight className="hidden md:block text-gray-400 absolute top-1/2 -right-4 transform -translate-y-1/2" />
                  )}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

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