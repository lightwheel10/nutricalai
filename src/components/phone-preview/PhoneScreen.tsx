'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { VoiceInputButton } from './VoiceInputButton'
import { RecordingAnimation } from './RecordingAnimation'
import { LoadingAnimation } from './LoadingAnimation'
import { AIAnalysisResult } from './AIAnalysisResult'
import { LogMealOptions } from './LogMealOptions'

export function PhoneScreen() {
  const [stage, setStage] = useState<'initial' | 'options' | 'recording' | 'loading' | 'result' | 'text-input'>('initial')
  const [mealInput, setMealInput] = useState('')
  const [mealDetails, setMealDetails] = useState(null)

  const handleLogMeal = () => setStage('options')
  const handleStartRecording = () => setStage('recording')
  const handleStopRecording = () => {
    setStage('loading')
    setTimeout(() => setStage('result'), 1000) // Simulate API call
  }
  const handleTextLog = () => setStage('text-input')

  const handleTextSubmit = async () => {
    setStage('loading')
    try {
      const response = await fetch('/api/log_meal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming you store the token in localStorage
        },
        body: JSON.stringify({ input_text: mealInput, loggedBy: 'text' })
      })
      const data = await response.json()
      if (data.status === 'success') {
        setMealDetails(data.meal_details)
        setStage('result')
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      console.error('Error logging meal:', error)
      // Handle error (e.g., show error message to user)
    }
  }

  return (
    <motion.div className="w-full h-full bg-white flex flex-col items-center justify-center">
      {stage === 'initial' && (
        <>
          <p className="text-base font-semibold mb-2">Experience AI Meal Logging</p>
          <VoiceInputButton onClick={handleLogMeal} text="Log Your Meal" />
        </>
      )}
      {stage === 'options' && <LogMealOptions onVoice={handleStartRecording} onText={handleTextLog} />}
      {stage === 'recording' && <RecordingAnimation onStop={handleStopRecording} />}
      {stage === 'text-input' && (
        <div className="flex flex-col items-center space-y-4">
          <textarea
            value={mealInput}
            onChange={(e) => setMealInput(e.target.value)}
            placeholder="Enter your meal details"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleTextSubmit}
          >
            Submit
          </button>
        </div>
      )}
      {stage === 'loading' && <LoadingAnimation />}
      {stage === 'result' && mealDetails && <AIAnalysisResult mealDetails={mealDetails} />}
    </motion.div>
  )
}