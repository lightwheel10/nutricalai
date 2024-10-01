'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const OnboardingPage = () => {
  const [step, setStep] = useState(1)
  const router = useRouter()

  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Welcome to AI Calorie Tracker</h1>
      {step === 1 && (
        <div>
          <h2 className="text-xl mb-2">Step 1: Personal Information</h2>
          {/* Add form fields for personal information */}
        </div>
      )}
      {step === 2 && (
        <div>
          <h2 className="text-xl mb-2">Step 2: Health Goals</h2>
          {/* Add form fields for health goals */}
        </div>
      )}
      {step === 3 && (
        <div>
          <h2 className="text-xl mb-2">Step 3: Dietary Preferences</h2>
          {/* Add form fields for dietary preferences */}
        </div>
      )}
      <button
        onClick={handleNextStep}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        {step < 3 ? 'Next' : 'Complete'}
      </button>
    </div>
  )
}

export default OnboardingPage