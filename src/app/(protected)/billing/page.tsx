import dynamic from 'next/dynamic'

const BillingContent = dynamic(() => import('./BillingContent'), {
  loading: () => <p>Loading...</p>,
  ssr: false
})

export default function BillingPage() {
  return <BillingContent />
}