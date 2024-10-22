import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'

interface RecordingAnimationProps {
  onStop: (audioBlob: Blob) => void
}

export function RecordingAnimation({ onStop }: RecordingAnimationProps) {
  const [timeLeft, setTimeLeft] = useState(20)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  useEffect(() => {
    let stream: MediaStream | null = null
    let timer: NodeJS.Timeout

    const startRecording = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        mediaRecorderRef.current = new MediaRecorder(stream)
        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunksRef.current.push(event.data)
          }
        }
        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' })
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
    }
  }, [onStop])

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop()
    }
  }

  return (
    <div className="flex flex-col items-center">
      <motion.div
        className="w-16 h-16 bg-red-500 rounded-full mb-4"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      />
      <p className="text-lg font-semibold mb-2">Recording... {timeLeft}s left</p>
      <Button onClick={handleStopRecording} variant="outline" className="mb-4">
        Stop Recording
      </Button>
      <p className="text-sm text-gray-600 text-center max-w-xs">
        Describe your meal, including the food items and approximate quantities.
      </p>
    </div>
  )
}
