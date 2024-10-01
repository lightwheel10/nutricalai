'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Crown, Shield } from 'lucide-react'

const SettingsPage = () => {
  const [username, setUsername] = useState('John Doe')
  const [email, setEmail] = useState('john.doe@example.com')
  const [notifications, setNotifications] = useState(true)
  const [theme, setTheme] = useState('light')
  const [weight, setWeight] = useState('70')
  const [height, setHeight] = useState('175')
  const [activityLevel, setActivityLevel] = useState('moderate')
  const [maintenanceCalories, setMaintenanceCalories] = useState('2500')
  const [numberSystem, setNumberSystem] = useState('metric')
  const [profilePhoto, setProfilePhoto] = useState('https://via.placeholder.com/150')
  const [plan, setPlan] = useState('free')

  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          setProfilePhoto(event.target.result)
        }
      }
      reader.readAsDataURL(e.target.files[0])
    }
  }

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={profilePhoto} alt="User Avatar" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div>
              <Label htmlFor="profile-photo">Profile Photo</Label>
              <Input id="profile-photo" type="file" accept="image/*" onChange={handleProfilePhotoChange} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input id="weight" value={weight} onChange={(e) => setWeight(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="height">Height (cm)</Label>
              <Input id="height" value={height} onChange={(e) => setHeight(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="activity-level">Activity Level</Label>
              <Select value={activityLevel} onValueChange={(value) => setActivityLevel(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select activity level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">Sedentary</SelectItem>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="very-active">Very Active</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="maintenance-calories">Maintenance Calories</Label>
              <Input id="maintenance-calories" value={maintenanceCalories} onChange={(e) => setMaintenanceCalories(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="number-system">Number System</Label>
              <Select value={numberSystem} onValueChange={(value) => setNumberSystem(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select number system" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="metric">Metric</SelectItem>
                  <SelectItem value="imperial">Imperial</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button className="w-full mt-4">Save Changes</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            {plan === 'free' && <Star className="h-6 w-6 text-gray-500" />}
            {plan === 'pro' && <Crown className="h-6 w-6 text-yellow-500" />}
            {plan === 'lifetime' && <Shield className="h-6 w-6 text-green-500" />}
            <div>
              <div className="text-lg font-medium">{plan.charAt(0).toUpperCase() + plan.slice(1)} Plan</div>
              <div className="text-sm text-gray-500">You are currently on the {plan} plan.</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="notifications">Enable Notifications</Label>
            <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>App Theme</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={theme} onValueChange={(value) => setTheme(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Subscription Plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Current Plan: {plan}</span>
            <Button onClick={() => setPlan('pro')} className="bg-blue-500 text-white">
              Upgrade to Pro
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SettingsPage