'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { VoiceInputButton } from './VoiceInputButton'
import { RecordingAnimation } from './RecordingAnimation'
import { LoadingAnimation } from './LoadingAnimation'
import { AIAnalysisResult } from './AIAnalysisResult'
import { LogMealOptions } from './LogMealOptions'
import { Button } from '@/components/ui/button'

export function PhoneScreen() {
  const [stage, setStage] = useState<'initial' | 'options' | 'recording' | 'loading' | 'result' | 'text-input'>('initial')
  const [mealInput, setMealInput] = useState('')
  const [mealDetails, setMealDetails] = useState(null)

  const handleLogMeal = () => setStage('options')
  const handleStartRecording = () => setStage('recording')
  const handleStopRecording = async (audioBlob: Blob) => {
    setStage('loading')
    try {
      // Convert audio blob to base64
      const reader = new FileReader()
      reader.readAsDataURL(audioBlob)
      reader.onloadend = async () => {
        const base64Audio = reader.result as string
        const base64Data = base64Audio.split(',')[1]

        const response = await fetch('/api/landing_ai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ input_audio: base64Data })
        })
        const data = await response.json()
        if (data.status === 'success') {
          setMealDetails(data.meal_details)
          setStage('result')
        } else {
          throw new Error(data.message)
        }
      }
    } catch (error) {
      console.error('Error analyzing meal:', error)
      // Handle error (e.g., show error message to user)
    }
  }
  const handleTextLog = () => setStage('text-input')

  const handleTextSubmit = async () => {
    setStage('loading')
    try {
      const response = await fetch('/api/landing_ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ input_text: mealInput })
      })
      const data = await response.json()
      if (data.status === 'success') {
        setMealDetails(data.meal_details)
        setStage('result')
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      console.error('Error analyzing meal:', error)
      // Handle error (e.g., show error message to user)
    }
  }

  return (
    <motion.div className="w-full h-full bg-white flex flex-col items-center justify-center p-4">
      {stage === 'initial' && (
        <>
          <p className="text-base font-semibold mb-2">Experience AI Meal Logging</p>
          <VoiceInputButton onClick={handleLogMeal} text="Log Your Meal" />
        </>
      )}
      {stage === 'options' && <LogMealOptions onVoice={handleStartRecording} onText={handleTextLog} />}
      {stage === 'recording' && <RecordingAnimation onStop={handleStopRecording} />}
      {stage === 'text-input' && (
        <div className="flex flex-col items-center space-y-4 w-full">
          <textarea
            value={mealInput}
            onChange={(e) => setMealInput(e.target.value)}
            placeholder="Enter your meal details"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <Button
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleTextSubmit}
          >
            Submit
          </Button>
        </div>
      )}
      {stage === 'loading' && <LoadingAnimation />}
      {stage === 'result' && mealDetails && <AIAnalysisResult mealDetails={mealDetails} />}
    </motion.div>
  )
}
