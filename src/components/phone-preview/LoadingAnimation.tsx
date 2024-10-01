import { Loader2 } from 'lucide-react'

export function LoadingAnimation() {
  return (
    <div className="flex flex-col items-center">
      <Loader2 className="w-8 h-8 animate-spin mb-2" />
      <p>Analyzing your input...</p>
    </div>
  )
}
