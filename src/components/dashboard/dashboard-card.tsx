import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"

interface DashboardCardProps {
  title: string
  icon: React.ReactNode
  content: React.ReactNode
  animation: {
    initial: object
    animate: object
    transition: object
  }
  className?: string
}

export function DashboardCard({ title, icon, content, animation, className }: DashboardCardProps) {
  return (
    <motion.div
      initial={animation.initial}
      animate={animation.animate}
      transition={animation.transition}
      className={className}
    >
      <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {icon}
        </CardHeader>
        <CardContent className="space-y-4">
          {content}
        </CardContent>
      </Card>
    </motion.div>
  )
}
