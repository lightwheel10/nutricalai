'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, CheckCircle } from 'lucide-react'
import { format } from "date-fns"

interface Activity {
  date: Date
  steps: string
  workout: string
  weight: string
}

const ActivityPage = () => {
  const [steps, setSteps] = useState('')
  const [workout, setWorkout] = useState('')
  const [weight, setWeight] = useState('')
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [activities, setActivities] = useState<Activity[]>([])
  const [showSuccess, setShowSuccess] = useState(false)

  const handleLogActivity = () => {
    const newActivity = { date: date || new Date(), steps, workout, weight }
    setActivities([...activities, newActivity])
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
    setSteps('')
    setWorkout('')
    setWeight('')
    setDate(new Date())
  }

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Log Your Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="steps">Steps</Label>
              <Input id="steps" value={steps} onChange={(e) => setSteps(e.target.value)} placeholder="Enter steps" />
            </div>
            <div>
              <Label htmlFor="workout">Workout</Label>
              <Input id="workout" value={workout} onChange={(e) => setWorkout(e.target.value)} placeholder="Enter workout details" />
            </div>
            <div>
              <Label htmlFor="weight">Weight</Label>
              <Input id="weight" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="Enter weight" />
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    selected={date}
                    onSelect={setDate}
                    mode="single"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <Button onClick={handleLogActivity} className="w-full mt-4">Log Activity</Button>
          {showSuccess && (
            <div className="flex items-center mt-4 text-green-600">
              <CheckCircle className="mr-2 h-5 w-5" />
              Activity logged successfully!
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {activities.length === 0 ? (
            <p>No activities logged yet.</p>
          ) : (
            <ul className="space-y-2">
              {activities.map((activity, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span>{format(activity.date, "PPP")}</span>
                  <span>Steps: {activity.steps}</span>
                  <span>Workout: {activity.workout}</span>
                  <span>Weight: {activity.weight} kg</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default ActivityPage