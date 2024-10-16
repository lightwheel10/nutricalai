import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import WaitlistPopup from "./WaitlistPopup"

interface PricingPlan {
  name: string;
  monthlyPrice: string;
  annualPrice: string;
  features: string[];
}

const plans: PricingPlan[] = [
  {
    name: "Standard",
    monthlyPrice: "$7/mo",
    annualPrice: "$5/mo",
    features: [
      "AI calorie tracking",
      "Detailed insights",
      "7-day free trial",
      "Premium support"
    ]
  },
  {
    name: "Lifetime",
    monthlyPrice: "$150",
    annualPrice: "$150",
    features: [
      "AI calorie tracking",
      "Detailed insights",
      "7-day free trial",
      "Premium support",
      "One-time payment"
    ]
  }
]

const Pricing: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(false)
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false)

  const openWaitlist = () => setIsWaitlistOpen(true)
  const closeWaitlist = () => setIsWaitlistOpen(false)

  return (
    <section id="pricing" className="w-full py-16 sm:py-24 md:py-32 lg:py-48">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8">Pricing Plans</h2>
      <div className="flex justify-center items-center mb-8">
        <span className={`mr-2 ${!isAnnual ? 'font-bold' : ''}`}>Monthly</span>
        <Switch
          checked={isAnnual}
          onCheckedChange={setIsAnnual}
        />
        <span className={`ml-2 ${isAnnual ? 'font-bold' : ''}`}>Annually</span>
      </div>
      <div className="flex flex-col gap-6 max-w-md mx-auto px-4 sm:px-0">
        {plans.map((plan, index) => (
          <Card key={index} className="flex flex-col">
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-xl sm:text-2xl font-bold mb-4">
                {isAnnual ? plan.annualPrice : plan.monthlyPrice}
                {plan.name !== "Lifetime" && <span className="text-sm font-normal"> billed {isAnnual ? 'annually' : 'monthly'}</span>}
              </p>
              <ul className="list-disc list-inside text-sm sm:text-base">
                {plan.features.map((feature, i) => (
                  <li key={i}>{feature}</li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={openWaitlist}>Choose Plan</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <WaitlistPopup isOpen={isWaitlistOpen} onClose={closeWaitlist} />
    </section>
  )
}

export default Pricing
