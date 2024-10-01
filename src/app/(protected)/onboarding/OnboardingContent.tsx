'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface OnboardingStep {
  title: string
  description: string
  fields: React.ReactNode
}

const OnboardingContent = () => {
  const [step, setStep] = useState(1)
  const router = useRouter()

  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      router.push('/dashboard')
    }
  }

  const steps: OnboardingStep[] = [
    {
      title: "Personal Information",
      description: "Let's start with some basic information about you.",
      fields: (
        <>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Enter your name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input id="age" type="number" placeholder="Enter your age" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <RadioGroup defaultValue="female">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female">Female</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male">Male</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="other" />
                <Label htmlFor="other">Other</Label>
              </div>
            </RadioGroup>
          </div>
        </>
      ),
    },
    {
      title: "Health Goals",
      description: "What are your primary health objectives?",
      fields: (
        <>
          <div className="space-y-2">
            <Label htmlFor="goal">Primary Goal</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select your primary goal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weight-loss">Weight Loss</SelectItem>
                <SelectItem value="muscle-gain">Muscle Gain</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="general-health">General Health</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="activity-level">Activity Level</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select your activity level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sedentary">Sedentary</SelectItem>
                <SelectItem value="lightly-active">Lightly Active</SelectItem>
                <SelectItem value="moderately-active">Moderately Active</SelectItem>
                <SelectItem value="very-active">Very Active</SelectItem>
                <SelectItem value="extra-active">Extra Active</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      ),
    },
    {
      title: "Dietary Preferences",
      description: "Tell us about your dietary preferences and restrictions.",
      fields: (
        <>
          <div className="space-y-2">
            <Label htmlFor="diet-type">Diet Type</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select your diet type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="omnivore">Omnivore</SelectItem>
                <SelectItem value="vegetarian">Vegetarian</SelectItem>
                <SelectItem value="vegan">Vegan</SelectItem>
                <SelectItem value="pescatarian">Pescatarian</SelectItem>
                <SelectItem value="keto">Keto</SelectItem>
                <SelectItem value="paleo">Paleo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="allergies">Allergies or Intolerances</Label>
            <Input id="allergies" placeholder="Enter any allergies or intolerances" />
          </div>
        </>
      ),
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to AI Calorie Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <h2 className="text-xl mb-2">Step {step}: {steps[step - 1].title}</h2>
          <p className="text-muted-foreground mb-4">{steps[step - 1].description}</p>
          <div className="space-y-4">
            {steps[step - 1].fields}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleNextStep}>
            {step < 3 ? 'Next' : 'Complete'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default OnboardingContent
