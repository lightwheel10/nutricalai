'use client';

import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

const PricingContent: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(false)

  const plans = [
    {
      name: "Monthly/Annual",
      monthlyPrice: "$7",
      annualPrice: "$60",
      features: [
        "AI-powered meal logging",
        "Calorie tracking",
        "Nutritional insights",
        "Meal history",
        "Personalized recommendations"
      ]
    },
    {
      name: "Lifetime",
      price: "$150",
      features: [
        "All features from Monthly/Annual plan",
        "One-time payment",
        "Lifetime access",
        "Future updates included",
        "Priority support"
      ]
    }
  ]

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Choose Your Plan</h1>
      <div className="flex justify-center items-center mb-8">
        <Label htmlFor="pricing-switch" className="mr-2">Monthly</Label>
        <Switch
          id="pricing-switch"
          checked={isAnnual}
          onCheckedChange={setIsAnnual}
        />
        <Label htmlFor="pricing-switch" className="ml-2">Annual</Label>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {plans.map((plan, index) => (
          <Card key={index} className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">{plan.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-3xl font-bold text-center mb-6">
                {plan.price ? plan.price : (isAnnual ? plan.annualPrice : plan.monthlyPrice)}
                {!plan.price && <span className="text-sm font-normal"> /{isAnnual ? 'year' : 'month'}</span>}
              </p>
              {plan.name === "Monthly/Annual" && isAnnual && (
                <p className="text-center mb-4 text-sm text-muted-foreground">Equivalent to $5/month, billed annually</p>
              )}
              <ul className="space-y-2">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Choose Plan</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default PricingContent