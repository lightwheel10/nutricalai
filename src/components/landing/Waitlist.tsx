import { useState } from 'react'
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail } from "lucide-react"
import { supabase } from '@/lib/supabaseClient'

const Waitlist: React.FC = () => {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage('')

    try {
      const { error } = await supabase
        .from('waitlist')
        .insert([{ email }])

      if (error) throw error

      setSubmitMessage('Thank you for joining our waitlist!')
      setEmail('')
    } catch (error) {
      console.error('Error submitting email:', error)
      setSubmitMessage('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="waitlist" className="w-full py-24 md:py-32 lg:py-48">
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center space-y-4 text-center"
        >
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Join Our Exclusive Waitlist
            </h2>
            <p className="mx-auto max-w-[600px] text-gray-600 md:text-xl">
              Be the first to experience our groundbreaking features. Sign up for our waitlist today and get early access!
            </p>
          </div>
          <div className="w-full max-w-sm space-y-2">
            <form onSubmit={handleEmailSubmit} className="flex space-x-2">
              <Input 
                placeholder="Enter your email" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white border-gray-300" 
                required
              />
              <Button 
                type="submit" 
                className="bg-gray-900 text-white hover:bg-gray-800 whitespace-nowrap w-32"
                disabled={isSubmitting}
              >
                <Mail className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Joining...' : 'Join Now'}
              </Button>
            </form>
            {submitMessage && (
              <p className="mt-2 text-sm text-green-600">{submitMessage}</p>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Waitlist