import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface PricingPlan {
  name: string;
  price: string;
  features: string[];
}

const plans: PricingPlan[] = [
  { name: "Basic", price: "$9.99/mo", features: ["AI calorie tracking", "Basic insights", "7-day meal planning"] },
  { name: "Pro", price: "$19.99/mo", features: ["Everything in Basic", "Advanced insights", "30-day meal planning", "24/7 support"] },
]

const Pricing: React.FC = () => {
  return (
    <section className="py-16 px-6">
      <h2 className="text-3xl font-bold text-center mb-8">Pricing Plans</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {plans.map((plan, index) => (
          <Card key={index} className="flex flex-col">
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-2xl font-bold mb-4">{plan.price}</p>
              <ul className="list-disc list-inside">
                {plan.features.map((feature, i) => (
                  <li key={i}>{feature}</li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Choose Plan</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}

export default Pricing
