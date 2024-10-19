// src/components/landing/MobileLandingContent.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import logoImage from '../../app/(landing)/nutrical-ai-logo.png';
import { PhoneScreen } from '@/components/phone-preview/PhoneScreen';
import Features from '@/components/landing/Features';
import Pricing from '@/components/landing/Pricing';
import Waitlist from '@/components/landing/Waitlist';
import TestimonialMarquee from '@/components/landing/TestimonialMarquee';
import Footer from '@/components/landing/Footer';
import AvatarCircles from '@/components/landing/AvatarCircles';
import WaitlistPopup from '@/components/landing/WaitlistPopup';
import { useState } from 'react';

interface MobileLandingContentProps {}

const MobileLandingContent: React.FC<MobileLandingContentProps> = () => {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  const handleOpenWaitlist = () => {
    setIsWaitlistOpen(true);
  };

  const handleCloseWaitlist = () => {
    setIsWaitlistOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      <header className="px-4 h-16 flex items-center fixed top-0 w-full z-50 bg-white shadow-sm">
        <Link className="flex items-center justify-center" href="#">
          <Image
            src={logoImage}
            alt="Nutrical AI Logo"
            width={32}
            height={32}
            className="object-contain mr-2"
          />
          <span className="text-lg font-bold">Nutrical AI</span>
        </Link>
        <Button variant="outline" className="ml-auto" onClick={handleOpenWaitlist}>Join</Button>
      </header>

      <main className="flex-1 pt-16">
        <section className="py-8 px-4">
          <h1 className="text-3xl font-bold tracking-tighter mb-4">
            Track Calories with AI Precision
          </h1>
          <p className="text-gray-600 mb-6">
            Join our waitlist for the most advanced AI-powered calorie tracking app.
          </p>
          <Button size="lg" className="w-full bg-gray-900 text-white" onClick={handleOpenWaitlist}>
            Join Waitlist
          </Button>
          <div className="mt-6 flex flex-col items-center">
            <AvatarCircles
              avatarUrls={[
                "https://avatars.githubusercontent.com/u/16860528",
                "https://avatars.githubusercontent.com/u/20110627",
                "https://avatars.githubusercontent.com/u/106103625",
                "https://avatars.githubusercontent.com/u/59228569",
              ]}
              numPeople={99}
              className="mb-2"
            />
            {/* <p className="text-sm text-gray-600">Join 1000+ others on the waitlist</p> */}
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

        <Features />
        <Pricing />

        <section className="py-8 px-4 bg-gray-50">
          <h2 className="text-2xl font-bold mb-8 text-center">How It Works</h2>
          <div className="space-y-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center text-lg font-bold mb-4">1</div>
              <h3 className="font-semibold mb-2">Log Your Meal</h3>
              <p className="text-sm text-gray-600">Use voice, text, or photo to easily log your meals.</p>
            </div>
            <div className="flex justify-center">
              <div className="w-4 h-4 border-t-2 border-r-2 border-gray-300 transform rotate-45 mt-2"></div>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center text-lg font-bold mb-4">2</div>
              <h3 className="font-semibold mb-2">AI Analysis</h3>
              <p className="text-sm text-gray-600">Our AI recognizes the food and calculates calories, macros, and micros.</p>
            </div>
            <div className="flex justify-center">
              <div className="w-4 h-4 border-t-2 border-r-2 border-gray-300 transform rotate-45 mt-2"></div>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center text-lg font-bold mb-4">3</div>
              <h3 className="font-semibold mb-2">Track Progress</h3>
              <p className="text-sm text-gray-600">Monitor your calorie intake and nutritional balance effortlessly.</p>
            </div>
          </div>
        </section>

        <section className="py-8 px-4">
          <h2 className="text-2xl font-bold tracking-tighter mb-4">
            Effortless Calorie Tracking
          </h2>
          <p className="text-gray-600 mb-6">
            Our AI-powered app makes calorie tracking a breeze. Simply tell the AI what you had for your meal, and let our advanced algorithms do the rest.
          </p>
          <Button className="w-full bg-gray-900 text-white hover:bg-gray-800" onClick={handleOpenWaitlist}>
            Join Waitlist for Early Access
          </Button>
          <div className="mt-6">
            <div className="w-full rounded-lg overflow-hidden shadow-lg">
              <div className="bg-gray-800 p-2 flex items-center">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="bg-gray-700 rounded px-2 py-1 text-xs text-gray-300">
                    www.nutricalai.com
                  </div>
                </div>
              </div>
              <div className="bg-gray-100 aspect-video flex items-center justify-center">
                <p className="text-xl font-bold text-gray-400">Website Coming Soon</p>
              </div>
            </div>
          </div>
        </section>

        <Waitlist />
        <TestimonialMarquee />
      </main>

      <Footer />
      <WaitlistPopup isOpen={isWaitlistOpen} onClose={handleCloseWaitlist} />
    </div>
  );
};

export default MobileLandingContent;
