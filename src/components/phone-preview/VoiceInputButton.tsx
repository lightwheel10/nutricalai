import { Button } from '@/components/ui/button'
import { Mic } from 'lucide-react'

interface VoiceInputButtonProps {
  onClick: () => void
  text: string
}

export function VoiceInputButton({ onClick, text }: VoiceInputButtonProps) {
  return (
    <Button onClick={onClick} className="flex items-center space-x-2">
      <Mic className="w-4 h-4" />
      <span>{text}</span>
    </Button>
  )
}
