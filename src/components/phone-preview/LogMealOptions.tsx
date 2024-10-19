import { Button } from '@/components/ui/button'
import { Mic, Type } from 'lucide-react'

interface LogMealOptionsProps {
  onVoice: () => void
  onText: () => void
}

export function LogMealOptions({ onVoice, onText }: LogMealOptionsProps) {
  return (
    <div className="flex flex-col items-center space-y-4">
      <p className="text-base font-semibold mb-2">Choose how to log your meal</p>
      <Button onClick={onVoice} className="flex items-center space-x-2">
        <Mic className="w-4 h-4" />
        <span>Log Meal - Voice</span>
      </Button>
      <Button onClick={onText} className="flex items-center space-x-2">
        <Type className="w-4 h-4" />
        <span>Log Meal - Text</span>
      </Button>
    </div>
  )
}
