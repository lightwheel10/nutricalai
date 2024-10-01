import React from 'react'
import { motion } from 'framer-motion'

interface NutrientProgressProps {
  label: string
  value: number
  max: number
}

export function NutrientProgress({ label, value, max }: NutrientProgressProps) {
  const percentage = (value / max) * 100
  const cappedPercentage = Math.min(percentage, 100)
  const overflowPercentage = Math.max(percentage - 100, 0)

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span>{value} / {max}</span>
      </div>
      <div className="relative h-2 bg-white overflow-hidden rounded">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${cappedPercentage}%` }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 bg-green-500"
        />
        {overflowPercentage > 0 && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${overflowPercentage}%` }}
            transition={{ duration: 1.5 }}
            className="absolute bg-red-500"
            style={{ left: `${cappedPercentage}%`, transform: 'translateX(-100%)' }}
          />
        )}
      </div>
    </div>
  )
}
