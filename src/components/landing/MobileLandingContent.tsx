// src/components/landing/MobileLandingContent.tsx
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';
import logoImage from '../../app/(landing)/nutrical-ai-logo.png';
import { PhoneScreen } from '@/components/phone-preview/PhoneScreen';
import Features from '@/components/landing/Features';
import Pricing from '@/components/landing/Pricing';
import Waitlist from '@/components/landing/Waitlist';
import TestimonialMarquee from '@/components/landing/TestimonialMarquee';
import Footer from '@/components/landing/Footer';
import AvatarCircles from '@/components/landing/AvatarCircles';
import WaitlistPopup from '@/components/landing/WaitlistPopup';

const avatarUrls = [
  "https://avatars.githubusercontent.com/u/16860528",
  "https://avatars.githubusercontent.com/u/20110627",
  "https://avatars.githubusercontent.com/u/106103625",
  "https://avatars.githubusercontent.com/u/59228569",
];

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
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
};

const MobileLandingContent: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openWaitlist = () => setIsWaitlistOpen(true);
  const closeWaitlist = () => setIsWaitlistOpen(false);

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      <header className={`px-4 h-16 flex items-center fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-white'}`}>
        <Link className="flex items-center justify-center" href="#">
          <div className="w-8 h-8 relative mr-2">
            <Image
              src={logoImage}
              alt="Nutrical AI Logo"
              layout="fill"
              objectFit="contain"
            />
          </div>
          <span className="text-lg font-bold">Nutrical AI</span>
        </Link>
        <Button variant="outline" className="ml-auto" onClick={openWaitlist}>Join</Button>
      </header>

      <main className="flex-1 pt-16">
        <section className="w-full py-8 px-4">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-3xl font-bold tracking-tighter mb-4">
              Say Goodbye to Manual Food Tracking
            </h1>
            <p className="text-gray-600 mb-6">
              No more searching databases or guessing portions. Simply tell our AI what you&apos;re eating - in any language - and get instant nutritional insights. It&apos;s that easy.
            </p>
            <Button size="lg" className="w-full bg-gray-900 text-white hover:bg-gray-800" onClick={openWaitlist}>
              Get Early Access
            </Button>
            <div className="mt-6">
              <AvatarCircles numPeople={99} avatarUrls={avatarUrls} />
            </div>
          </div>
        </section>

        <section className="py-8 px-4">
          <h2 className="text-2xl font-bold mb-6 text-center">Experience AI Meal Logging</h2>
          <div className="flex justify-center">
            <div className="relative w-[280px] h-[560px] bg-white rounded-[30px] shadow-xl overflow-hidden border-8 border-gray-800">
              <div className="absolute top-0 w-full h-6 bg-gray-800 flex justify-center items-center">
                <div className="w-16 h-4 bg-black rounded-b-xl"></div>
              </div>
              <div className="w-full h-full pt-6 overflow-y-auto">
                <PhoneScreen />
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-16 px-4 bg-gray-50">
          <h2 className="text-2xl font-bold text-center mb-8">How It Works</h2>
          <motion.div 
            className="flex flex-col items-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {steps.map((step, index) => (
              <motion.div 
                key={index} 
                className="flex flex-col items-center mb-8 text-center relative"
                variants={itemVariants}
              >
                <div className="w-16 h-16 bg-gray-900 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                  {step.number}
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{step.description}</p>
                <p className="text-gray-900 font-semibold text-sm">{step.stat}</p>
                {index < steps.length - 1 && (
                  <ArrowRight className="text-gray-400 my-4" />
                )}
              </motion.div>
            ))}
          </motion.div>
        </section>

        <section className="w-full py-16 px-4">
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold tracking-tighter mb-4">
              Effortless Calorie Tracking
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              Our AI-powered app makes calorie tracking a breeze. Simply tell the AI what you had for your meal, and let our advanced algorithms do the rest.
            </p>
            <Button className="w-full bg-gray-900 text-white hover:bg-gray-800" onClick={openWaitlist}>
              Join Waitlist for Early Access
            </Button>
            <div className="mt-8 w-full">
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
                    layout="responsive"
                    className="filter blur-sm"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <p className="text-xl font-bold text-white">Website Coming Soon</p>
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
  );
};

export default MobileLandingContent;
