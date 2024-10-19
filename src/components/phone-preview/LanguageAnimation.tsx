import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const examples = [
  "I had a cheeseburger with fries and a milkshake",
  "Comí paella con mariscos y una sangría",
  "मैंने बटर चिकन और नान खाया"
]

export function LanguageAnimation() {
  const [currentExample, setCurrentExample] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentExample((prev) => (prev + 1) % examples.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="mt-4 text-center">
      <p className="text-sm text-gray-600 mb-2">Example:</p>
      <AnimatePresence mode="wait">
        <motion.p
          key={currentExample}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="text-sm font-medium"
        >
          {examples[currentExample]}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}