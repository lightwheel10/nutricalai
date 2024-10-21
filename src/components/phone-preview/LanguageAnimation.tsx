import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const examples = [
  "I had a cheeseburger with fries and a milkshake",
  "Comí paella con mariscos y una sangría",
  "मैंने बटर चिकन और नान खाया",
  "J'ai mangé une quiche lorraine et bu un verre de vin",
  "Ich habe Schnitzel mit Kartoffelsalat gegessen",
  "我吃了北京烤鸭和饺子",
  "私は寿司と味噌汁を食べました",
  "Я ел борщ и пельмени"
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
    <div className="mb-4 text-center bg-gray-100 p-4 rounded-lg shadow-inner w-full">
      <p className="text-sm text-gray-600 mb-2 font-medium">Example Input:</p>
      <div className="relative h-16 overflow-hidden">
        <AnimatePresence initial={false}>
          <motion.p
            key={currentExample}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="text-sm font-semibold text-gray-800 italic absolute inset-0 flex items-center justify-center"
          >
            &ldquo;{examples[currentExample]}&rdquo;
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  )
}
