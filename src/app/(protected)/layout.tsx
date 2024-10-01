import { ReactNode } from 'react'

interface ProtectedLayoutProps {
  children: ReactNode
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  // Add authentication check here if needed
  return (
    <>
      {children}
    </>
  )
}