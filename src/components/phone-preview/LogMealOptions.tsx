import { Button } from '@/components/ui/button'
import { Mic, Type } from 'lucide-react'

interface LogMealOptionsProps {
  onVoice: () => void
  onText: () => void
}

export function LogMealOptions({ onVoice, onText }: LogMealOptionsProps) {
  return (
    <div className="flex flex-col items-center space-y-6 p-6 rounded-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Log Your Meal</h2>
      <Button 
        onClick={onVoice} 
        className="w-full max-w-xs bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105"
      >
        <Mic className="w-5 h-5 mr-2" />
        <span>Voice Input</span>
      </Button>
      <Button 
        onClick={onText} 
        className="w-full max-w-xs bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105"
      >
        <Type className="w-5 h-5 mr-2" />
        <span>Text Input</span>
      </Button>
    </div>
  )
}
