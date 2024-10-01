import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from 'lucide-react'
import Link from 'next/link'

interface WaitlistPopupProps {
  isOpen: boolean
  onClose: () => void
  email: string
  setEmail: (email: string) => void
  handleEmailSubmit: (e: React.FormEvent) => void
}

const WaitlistPopup: React.FC<WaitlistPopupProps> = ({ isOpen, onClose, email, setEmail, handleEmailSubmit }) => {
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
            <form onSubmit={handleEmailSubmit} className="space-y-4">
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
              >
                Join Waitlist
              </Button>
            </form>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">Already have access?</p>
              <Link href="/login" className="text-sm text-blue-600 hover:text-blue-800">
                Log in here
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default WaitlistPopup
