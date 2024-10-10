import dynamic from 'next/dynamic'

const PricingContent = dynamic(() => import('./PricingContent'), {
  loading: () => <p>Loading...</p>,
  ssr: false
})

export default function PricingPage() {
  return <PricingContent />
}
