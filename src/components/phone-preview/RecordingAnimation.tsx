import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'

interface RecordingAnimationProps {
  onStop: (audioBlob: Blob) => void
}

export function RecordingAnimation({ onStop }: RecordingAnimationProps) {
  const [isRecording, setIsRecording] = useState(true) // eslint-disable-line @typescript-eslint/no-unused-vars
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  useEffect(() => {
    let stream: MediaStream | null = null

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
      } catch (error) {
        console.error('Error accessing microphone:', error)
      }
    }

    startRecording()

    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop()
      }
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [onStop])

  const handleStopRecording = () => {
    setIsRecording(false)
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
      <p className="text-lg font-semibold mb-4">Recording...</p>
      <Button onClick={handleStopRecording} variant="outline">
        Stop Recording
      </Button>
    </div>
  )
}
