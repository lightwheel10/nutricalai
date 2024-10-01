import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

interface RecordingAnimationProps {
  onStop: () => void
}

export function RecordingAnimation({ onStop }: RecordingAnimationProps) {
  return (
    <div className="flex flex-col items-center">
      <motion.div
        className="w-16 h-16 bg-red-500 rounded-full mb-4"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      />
      <p className="text-lg font-semibold mb-4">Recording...</p>
      <Button onClick={onStop} variant="outline">
        Stop Recording
      </Button>
    </div>
  )
}
