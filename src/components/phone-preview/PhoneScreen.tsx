'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { VoiceInputButton } from './VoiceInputButton'
import { RecordingAnimation } from './RecordingAnimation'
import { LoadingAnimation } from './LoadingAnimation'
import { AIAnalysisResult } from './AIAnalysisResult'

export function PhoneScreen() {
  const [stage, setStage] = useState<'initial' | 'recording' | 'loading' | 'result'>('initial')

  const handleStartRecording = () => setStage('recording')
  const handleStopRecording = () => {
    setStage('loading')
    setTimeout(() => setStage('result'), 1000) // Simulate API call
  }

  return (
    <motion.div className="w-full h-full bg-white flex flex-col items-center justify-center">
      {stage === 'initial' && (
        <>
          <p className="text-base font-semibold mb-2">Experience AI Voice Logging</p>
          <VoiceInputButton onClick={handleStartRecording} />
        </>
      )}
      {stage === 'recording' && <RecordingAnimation onStop={handleStopRecording} />}
      {stage === 'loading' && <LoadingAnimation />}
      {stage === 'result' && <AIAnalysisResult />}
    </motion.div>
  )
}