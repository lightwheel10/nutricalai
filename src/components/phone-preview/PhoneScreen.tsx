'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { VoiceInputButton } from './VoiceInputButton'
import { RecordingAnimation } from './RecordingAnimation'
import { LoadingAnimation } from './LoadingAnimation'
import { AIAnalysisResult } from './AIAnalysisResult'
import { LogMealOptions } from './LogMealOptions'

export function PhoneScreen() {
  const [stage, setStage] = useState<'initial' | 'options' | 'recording' | 'loading' | 'result'>('initial')

  const handleLogMeal = () => setStage('options')
  const handleStartRecording = () => setStage('recording')
  const handleStopRecording = () => {
    setStage('loading')
    setTimeout(() => setStage('result'), 1000) // Simulate API call
  }
  const handleTextLog = () => {
    setStage('loading')
    setTimeout(() => setStage('result'), 1000) // Simulate API call
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
      {stage === 'loading' && <LoadingAnimation />}
      {stage === 'result' && <AIAnalysisResult />}
    </motion.div>
  )
}