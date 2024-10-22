import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { LogMealVoice } from '@/components/log-meal/log-meal-voice'

interface RecordingAnimationProps {
  onStop: (audioBlob: Blob) => void
  onLogMeal: (mealDetails: {
    meal_name: string;
    calories: number;
    nutrients: Array<{ name: string; amount: number; unit: string }>;
    insights: string;
    quantity: string;
    mealType: string;
  }) => void
  onError: (error: string) => void
}

export function RecordingAnimation({ onStop, onLogMeal, onError }: RecordingAnimationProps) {
  const [timeLeft, setTimeLeft] = useState(20)
  const [isUserSpeaking, setIsUserSpeaking] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const chunksRef = useRef<Blob[]>([])

  useEffect(() => {
    let stream: MediaStream | null = null
    let timer: NodeJS.Timeout

    const startRecording = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        mediaRecorderRef.current = new MediaRecorder(stream)
        audioContextRef.current = new AudioContext()
        analyserRef.current = audioContextRef.current.createAnalyser()
        const source = audioContextRef.current.createMediaStreamSource(stream)
        source.connect(analyserRef.current)

        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunksRef.current.push(event.data)
          }
        }

        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' })
          setAudioBlob(audioBlob)
          onStop(audioBlob)
        }

        mediaRecorderRef.current.start()

        timer = setInterval(() => {
          setTimeLeft((prevTime) => {
            if (prevTime <= 1) {
              clearInterval(timer)
              handleStopRecording()
              return 0
            }
            return prevTime - 1
          })
        }, 1000)

        detectSpeech()
      } catch (error) {
        console.error('Error accessing microphone:', error)
      }
    }

    startRecording()

    return () => {
      clearInterval(timer)
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop()
      }
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [onStop])

  const detectSpeech = () => {
    if (!analyserRef.current) return

    const bufferLength = analyserRef.current.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const checkAudio = () => {
      analyserRef.current!.getByteFrequencyData(dataArray)
      const sum = dataArray.reduce((a, b) => a + b, 0)
      const average = sum / bufferLength
      setIsUserSpeaking(average > 10) // Adjust this threshold as needed
      requestAnimationFrame(checkAudio)
    }

    checkAudio()
  }

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop()
    }
  }

  return (
    <div className="flex flex-col items-center">
      <motion.div
        className="w-16 h-16 bg-red-500 rounded-full mb-4"
        animate={{ scale: isUserSpeaking ? [1, 1.2, 1] : 1 }}
        transition={{ repeat: Infinity, duration: 0.5 }}
      />
      <p className="text-lg font-semibold mb-2">Recording... {timeLeft}s left</p>
      <Button onClick={handleStopRecording} variant="outline" className="mb-4">
        Stop Recording
      </Button>
      <p className="text-sm text-gray-600 text-center max-w-xs">
        Describe your meal, including the food items and approximate quantities.
      </p>
      {audioBlob && (
        <LogMealVoice
          onLogMeal={onLogMeal}
          onError={onError}
          audioBlob={audioBlob}
        />
      )}
    </div>
  )
}
