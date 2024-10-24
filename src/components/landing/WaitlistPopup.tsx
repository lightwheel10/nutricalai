import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'

interface WaitlistPopupProps {
  isOpen: boolean
  onClose: () => void
}

const WaitlistPopup: React.FC<WaitlistPopupProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage('')

    try {
      // Insert email into Supabase
      const { error } = await supabase
        .from('Waitlist-Users')
        .insert([{ email }])

      if (error) throw error

      // Send email using the new API route
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      setSubmitMessage('Thank you for joining our waitlist!')
      setEmail('')
    } catch (error) {
      console.error('Error:', error)
      setSubmitMessage('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Join Our Waitlist</h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-6 w-6" />
              </Button>
            </div>
            <p className="mb-4 text-gray-600">Be the first to experience our groundbreaking features. Sign up for our waitlist today!</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input 
                placeholder="Enter your email" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
                required
              />
              <Button 
                type="submit" 
                className="w-full bg-gray-900 text-white hover:bg-gray-800"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Join Waitlist'}
              </Button>
            </form>
            {submitMessage && (
              <p className="mt-4 text-center text-sm text-green-600">{submitMessage}</p>
            )}
            {/* <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">Already have access?</p>
              <Link href="/login" className="text-sm text-blue-600 hover:text-blue-800">
                Log in here
              </Link>
            </div> */}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default WaitlistPopup
