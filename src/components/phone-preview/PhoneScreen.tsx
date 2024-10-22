'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { VoiceInputButton } from './VoiceInputButton'
import { RecordingAnimation } from './RecordingAnimation'
import { LoadingAnimation } from './LoadingAnimation'
import { AIAnalysisResult } from './AIAnalysisResult'
import { LogMealOptions } from './LogMealOptions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft } from 'lucide-react'
import { LanguageAnimation } from './LanguageAnimation'

interface MealDetails {
  meal_name: string;
  calories: number;
  nutrients: Array<{ name: string; amount: number; unit: string }>;
  insights: string;
  quantity: string;
  mealType: string;
}

export function PhoneScreen() {
  const [stage, setStage] = useState<'initial' | 'options' | 'recording' | 'loading' | 'result' | 'text-input'>('initial')
  const [mealInput, setMealInput] = useState('')
  const [mealDetails, setMealDetails] = useState<MealDetails | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleLogMeal = () => setStage('options')
  const handleStartRecording = () => setStage('recording')
  const handleTextLog = () => setStage('text-input')

  const handleBack = () => {
    setError(null)
    if (stage === 'text-input' || stage === 'recording') {
      setStage('options')
    } else {
      setStage('initial')
    }
  }

  const handleStopRecording = async () => {
    setStage('loading')
    // The actual processing is now handled by LogMealVoice
  }

  const handleTextSubmit = async () => {
    setStage('loading')
    try {
      await analyzeMeal({ input_text: mealInput })
    } catch (error) {
      handleError(error as Error)
    }
  }

  const analyzeMeal = async (input: { input_audio?: string; input_text?: string }) => {
    const response = await fetch('/api/landing_ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input)
    })
    const data = await response.json()
    if (data.status === 'success') {
      setMealDetails(data.meal_details)
      setStage('result')
    } else {
      throw new Error(data.message)
    }
  }

  const handleError = (error: unknown) => {
    console.error('Error analyzing meal:', error)
    setError(error instanceof Error ? error.message : 'An error occurred. Please try again.')
    setStage('options')
  }

  const handleVoiceLogMeal = (mealDetails: MealDetails) => {
    setMealDetails(mealDetails)
    setStage('result')
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        key={stage}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full h-full bg-white flex flex-col items-center justify-center relative"
      >
        {stage !== 'initial' && (
          <Button variant="ghost" size="sm" className="absolute top-2 left-2 z-10" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
        )}

        {error && <p className="text-red-500 mb-4 absolute top-12 left-2 right-2 text-center">{error}</p>}

        {stage === 'initial' && (
          <>
            <p className="text-base font-semibold mb-2">Experience AI Meal Logging</p>
            <VoiceInputButton onClick={handleLogMeal} text="Log Your Meal" />
          </>
        )}

        {stage === 'options' && (
          <LogMealOptions onVoice={handleStartRecording} onText={handleTextLog} />
        )}
        
        {stage === 'recording' && (
          <RecordingAnimation
            onStop={handleStopRecording}
            onLogMeal={handleVoiceLogMeal}
            onError={handleError}
          />
        )}
        
        {stage === 'text-input' && (
          <div className="flex flex-col items-center space-y-4 w-full max-w-[90%]">
            <LanguageAnimation />
            <Input
              value={mealInput}
              onChange={(e) => setMealInput(e.target.value)}
              placeholder="Enter your meal details"
              className="w-full"
            />
            <Button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold"
              onClick={handleTextSubmit}
            >
              Submit
            </Button>
          </div>
        )}

        {stage === 'loading' && <LoadingAnimation />}
        
        {stage === 'result' && mealDetails && (
          <div className="w-full h-full">
            <AIAnalysisResult mealDetails={mealDetails} />
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
