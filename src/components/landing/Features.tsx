import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mic, Brain, Calculator } from "lucide-react"

const features = [
  { 
    title: "Natural Language Input", 
    description: "Easily log your meals using text or voice in everyday language, like 'I had salmon for dinner with some rice'.", 
    icon: Mic 
  },
  { 
    title: "AI-Powered Analysis", 
    description: "Our advanced AI calculates macros, micros, and calories from your natural language input.", 
    icon: Brain 
  },
  { 
    title: "Comprehensive Nutrition Tracking", 
    description: "Get detailed insights into your diet, including calorie count, macronutrients, and micronutrients.", 
    icon: Calculator 
  }
]

const Features: React.FC = () => {
  return (
    <section id="features" className="w-full py-16 sm:py-24 md:py-32 lg:py-48 bg-gray-50">
      <div className="container px-4 md:px-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tighter text-center mb-8 sm:mb-12">
          AI-Powered Calorie Tracking
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="bg-white border border-gray-200 h-full">
                <CardHeader>
                  <feature.icon className="w-8 h-8 sm:w-10 sm:h-10 mb-2 text-gray-900" />
                  <CardTitle className="text-xl sm:text-2xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm sm:text-base">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
