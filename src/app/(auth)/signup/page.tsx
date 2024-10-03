import dynamic from 'next/dynamic'

const SignUpContent = dynamic(() => import('./SignUpContent'), {
  loading: () => <p>Loading...</p>,
  ssr: false
})

export default function SignUpPage() {
  return <SignUpContent />
}