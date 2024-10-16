'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CalendarIcon, CheckCircle, MoreVertical, Edit2, Trash2, Footprints, Dumbbell, Bike, Waves, PersonStanding, Weight } from 'lucide-react'
import { format } from "date-fns"
import { supabase } from '@/lib/supabaseClient'

// Defining the structure of an activity entry
interface Activity {
  id: string
  date: string
  steps: number
  workout: string
  weight: number
  user_id: string
  workout_quantity?: string
}

const getWorkoutQuantityDetails = (workoutType: string) => {
  switch (workoutType) {
    case 'running':
    case 'cycling':
      return { label: 'Distance (km)', placeholder: 'Enter distance' }
    case 'swimming':
      return { label: 'Distance (m)', placeholder: 'Enter distance' }
    case 'weightlifting':
    case 'yoga':
      return { label: 'Duration (minutes)', placeholder: 'Enter duration' }
    default:
      return { label: 'Quantity', placeholder: 'Enter quantity' }
  }
}

const getWorkoutIcon = (workoutType: string) => {
  switch (workoutType) {
    case 'running':
      return <Footprints className="h-5 w-5" />
    case 'cycling':
      return <Bike className="h-5 w-5" />
    case 'swimming':
      return <Waves className="h-5 w-5" />
    case 'weightlifting':
      return <Dumbbell className="h-5 w-5" />
    case 'yoga':
      return <PersonStanding className="h-5 w-5" />
    default:
      return null
  }
}

const ActivityContent = () => {
  // State variables to manage form inputs and activity log
  const [steps, setSteps] = useState('') // Stores the number of steps
  const [workout, setWorkout] = useState('') // Stores workout details
  const [weight, setWeight] = useState('') // Stores the user's weight
  const [date, setDate] = useState<Date | undefined>(new Date()) // Stores the selected date
  const [activities, setActivities] = useState<Activity[]>([]) // Stores all logged activities
  const [showSuccess, setShowSuccess] = useState(false) // Controls the visibility of success message
  const [workoutQuantity, setWorkoutQuantity] = useState('')
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null)

  useEffect(() => {
    const fetchActivities = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data, error } = await supabase
          .from('activities')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false })

        if (error) {
          console.error('Error fetching activities:', error)
        } else {
          setActivities(data || [])
        }
      }
    }

    fetchActivities()
  }, [])

  // Function to handle logging a new activity
  const handleLogActivity = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const newActivity = {
      date: date?.toISOString() || new Date().toISOString(),
      steps: parseInt(steps),
      workout,
      workout_quantity: workoutQuantity,
      weight: parseFloat(weight),
      user_id: user.id
    }

    const { data, error } = await supabase
      .from('activities')
      .insert(newActivity)
      .select()

    if (error) {
      console.error('Error logging activity:', error)
    } else {
      setActivities([data[0], ...activities])
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
      setSteps('')
      setWorkout('')
      setWorkoutQuantity('')
      setWeight('')
      setDate(new Date())
    }
  }

  const handleEditActivity = (activity: Activity) => {
    setEditingActivity(activity)
    setSteps(activity.steps.toString())
    setWorkout(activity.workout)
    setWorkoutQuantity(activity.workout_quantity || '')
    setWeight(activity.weight.toString())
    setDate(new Date(activity.date))
  }

  const handleUpdateActivity = async () => {
    if (!editingActivity) return

    const updatedActivity = {
      ...editingActivity,
      date: date?.toISOString() || new Date().toISOString(),
      steps: parseInt(steps),
      workout,
      workout_quantity: workoutQuantity,
      weight: parseFloat(weight),
    }

    const { data, error } = await supabase
      .from('activities')
      .update(updatedActivity)
      .eq('id', editingActivity.id)
      .select()

    if (error) {
      console.error('Error updating activity:', error)
    } else {
      setActivities(activities.map(a => a.id === editingActivity.id ? data[0] : a))
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
      setEditingActivity(null)
      // Reset form fields
      setSteps('')
      setWorkout('')
      setWorkoutQuantity('')
      setWeight('')
      setDate(new Date())
    }
  }

  const handleDeleteActivity = async (activityId: string) => {
    const { error } = await supabase
      .from('activities')
      .delete()
      .eq('id', activityId)

    if (error) {
      console.error('Error deleting activity:', error)
    } else {
      setActivities(activities.filter(a => a.id !== activityId))
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{editingActivity ? 'Edit Activity' : 'Log Your Activity'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="steps" className="flex items-center">
                <Footprints className="h-5 w-5 mr-2" />
                Steps
              </Label>
              <Input id="steps" type="number" value={steps} onChange={(e) => setSteps(e.target.value)} placeholder="Enter steps" />
            </div>
            <div>
              <Label htmlFor="workout" className="flex items-center">
                <Dumbbell className="h-5 w-5 mr-2" />
                Workout
              </Label>
              <Select value={workout} onValueChange={setWorkout}>
                <SelectTrigger>
                  <SelectValue placeholder="Select workout" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="running">
                    <div className="flex items-center">
                      <Footprints className="h-5 w-5 mr-2" />
                      Running
                    </div>
                  </SelectItem>
                  <SelectItem value="cycling">
                    <div className="flex items-center">
                      <Bike className="h-5 w-5 mr-2" />
                      Cycling
                    </div>
                  </SelectItem>
                  <SelectItem value="swimming">
                    <div className="flex items-center">
                      <Waves className="h-5 w-5 mr-2" />
                      Swimming
                    </div>
                  </SelectItem>
                  <SelectItem value="weightlifting">
                    <div className="flex items-center">
                      <Dumbbell className="h-5 w-5 mr-2" />
                      Weightlifting
                    </div>
                  </SelectItem>
                  <SelectItem value="yoga">
                    <div className="flex items-center">
                      <PersonStanding className="h-5 w-5 mr-2" />
                      Yoga
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Input field for weight */}
            <div>
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input id="weight" type="number" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="Enter weight" />
            </div>
            {/* Date picker */}
            <div>
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            {workout && (
              <div>
                <Label htmlFor="workoutQuantity">{getWorkoutQuantityDetails(workout).label}</Label>
                <Input
                  id="workoutQuantity"
                  type="number"
                  step="0.01"
                  value={workoutQuantity}
                  onChange={(e) => setWorkoutQuantity(e.target.value)}
                  placeholder={getWorkoutQuantityDetails(workout).placeholder}
                />
              </div>
            )}
          </div>
          <Button 
            onClick={editingActivity ? handleUpdateActivity : handleLogActivity} 
            className="w-full mt-4"
          >
            {editingActivity ? 'Update Activity' : 'Log Activity'}
          </Button>
          {editingActivity && (
            <Button 
              onClick={() => setEditingActivity(null)} 
              variant="outline" 
              className="w-full mt-2"
            >
              Cancel Edit
            </Button>
          )}
          {/* Success message */}
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
        <CardContent>
          {activities.length === 0 ? (
            <p>No activities logged yet.</p>
          ) : (
            <ul className="space-y-4">
              {activities.map((activity) => (
                <li key={activity.id} className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{format(new Date(activity.date), "PPP")}</h3>
                      <p className="text-gray-600 flex items-center">
                        <Footprints className="h-5 w-5 mr-2" />
                        Steps: {activity.steps}
                      </p>
                      {activity.workout && (
                        <p className="text-gray-600 flex items-center">
                          {getWorkoutIcon(activity.workout)}
                          <span className="ml-2">
                            Workout: {activity.workout}
                            {activity.workout_quantity && ` (${activity.workout_quantity} ${
                              activity.workout === 'running' || activity.workout === 'cycling' ? 'km' :
                              activity.workout === 'swimming' ? 'm' : 'min'
                            })`}
                          </span>
                        </p>
                      )}
                      <p className="text-gray-600 flex items-center">
                        <Weight className="h-5 w-5 mr-2" />
                        Weight: {activity.weight} kg
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditActivity(activity)}>
                          <Edit2 className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteActivity(activity.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default ActivityContent
