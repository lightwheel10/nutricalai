import { Button } from '@/components/ui/button'
import { Mic } from 'lucide-react'

interface VoiceInputButtonProps {
  onClick: () => void
}

export function VoiceInputButton({ onClick }: VoiceInputButtonProps) {
  return (
    <Button onClick={onClick} className="flex items-center space-x-2">
      <Mic className="w-4 h-4" />
      <span>Start Voice Input</span>
    </Button>
  )
}
