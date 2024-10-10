import dynamic from 'next/dynamic'

const ContactContent = dynamic(() => import('./ContactContent'), {
  loading: () => <p>Loading...</p>,
  ssr: false
})

export default function ContactPage() {
  return <ContactContent />
}
