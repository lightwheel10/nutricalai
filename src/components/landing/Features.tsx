import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Zap, Users } from "lucide-react"

const features = [
  { title: "Image Recognition", description: "Instantly recognize foods and calculate calories from photos of your meals.", icon: BarChart },
  { title: "Personalized Insights", description: "Get AI-driven recommendations for your diet based on your goals and habits.", icon: Zap },
  { title: "Smart Meal Planning", description: "Receive customized meal plans that fit your calorie goals and dietary preferences.", icon: Users }
]

const Features: React.FC = () => {
  return (
    <section id="features" className="w-full py-24 md:py-32 lg:py-48 bg-gray-50">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
          AI-Powered Calorie Tracking
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="bg-white border border-gray-200">
                <CardHeader>
                  <feature.icon className="w-10 h-10 mb-2 text-gray-900" />
                  <CardTitle className="text-2xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
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
