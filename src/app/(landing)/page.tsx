'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Circle } from "lucide-react"
import Features from '@/components/landing/Features'
import Waitlist from '@/components/landing/Waitlist'
import WaitlistPopup from '@/components/landing/WaitlistPopup'
import Pricing from '@/components/landing/Pricing'
import TestimonialMarquee from '@/components/landing/TestimonialMarquee'
import AvatarCircles from "@/components/landing/AvatarCircles";
import { PhoneScreen } from '@/components/phone-preview/PhoneScreen';

const avatarUrls = [
  "https://avatars.githubusercontent.com/u/16860528",
  "https://avatars.githubusercontent.com/u/20110627",
  "https://avatars.githubusercontent.com/u/106103625",
  "https://avatars.githubusercontent.com/u/59228569",
];

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [email, setEmail] = useState('')
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false)

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

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Email submitted:', email)
    setEmail('')
    setIsWaitlistOpen(false)
    alert('Thank you for joining our waitlist!')
  }

  const openWaitlist = () => setIsWaitlistOpen(true)
  const closeWaitlist = () => setIsWaitlistOpen(false)

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className={`px-4 lg:px-6 h-16 flex items-center fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-white'}`}>
        <Link className="flex items-center justify-center" href="#">
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-gray-900 rounded-full"
          />
          <span className="ml-2 text-xl font-bold">AI Calorie Tracker</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Button variant="ghost" onClick={() => scrollTo('features')}>Features</Button>
          <Button variant="ghost" onClick={() => scrollTo('pricing')}>Pricing</Button>
          <Button variant="outline" onClick={openWaitlist}>Join Waitlist</Button>
        </nav>
      </header>

      <main className="flex-1 pt-16">
        {/* Hero Section */}
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
                {/* Avatar Circles for Waitlist */}
                <div className="pt-4">
                  <AvatarCircles numPeople={99} avatarUrls={avatarUrls} />
                </div>
              </div>
              <div className="flex-1 relative max-w-md w-full">
                {/* iPhone-like frame */}
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

        {/* Features Section */}
        <Features />

        {/* Effortless Tracking Section */}
        <section className="w-full py-24 md:py-32 lg:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1 space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Effortless Calorie Tracking
                </h2>
                <p className="text-gray-600 md:text-xl">
                  Our AI-powered app makes calorie tracking a breeze. Simply take a photo of your meal, and let our advanced algorithms do the rest.
                </p>
                <Button className="bg-gray-900 text-white hover:bg-gray-800" onClick={openWaitlist}>
                  Join Waitlist for Early Access
                </Button>
              </div>
              <div className="flex-1 w-full max-w-2xl">
                <div className="w-full rounded-lg overflow-hidden shadow-2xl">
                  <div className="bg-gray-800 p-2 flex items-center">
                    <div className="flex space-x-2">
                      <Circle size={12} className="text-red-500" />
                      <Circle size={12} className="text-yellow-500" />
                      <Circle size={12} className="text-green-500" />
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

        {/* Pricing Section */}
        <Pricing />

        {/* How It Works Section */}
        <section className="w-full py-24 md:py-32 lg:py-48 bg-gray-50">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: "Take a Photo", description: "Snap a picture of your meal using our app." },
                { title: "AI Analysis", description: "Our AI instantly recognizes the food and calculates calories." },
                { title: "Track Progress", description: "Monitor your calorie intake and nutritional balance effortlessly." }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-12 h-12 rounded-full bg-gray-900 text-white flex items-center justify-center text-xl font-bold mb-4">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                  {index < 2 && <ArrowRight className="w-6 h-6 mt-4 text-gray-400 hidden md:block" />}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Waitlist Section */}
        <Waitlist email={email} setEmail={setEmail} handleEmailSubmit={handleEmailSubmit} />

        {/* Testimonial Marquee */}
        <TestimonialMarquee />

      </main>

      {/* Waitlist Popup */}
      <WaitlistPopup
        isOpen={isWaitlistOpen}
        onClose={closeWaitlist}
        email={email}
        setEmail={setEmail}
        handleEmailSubmit={handleEmailSubmit}
      />
    </div>
  )
}
