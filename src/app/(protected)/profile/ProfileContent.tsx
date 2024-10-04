'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { supabase } from '@/lib/supabaseClient'

interface UserProfile {
  id: string
  display_name: string
  email: string
  avatar_url: string
  bio: string
}

export default function ProfileContent() {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [updatedProfile, setUpdatedProfile] = useState<UserProfile | null>(null)

  useEffect(() => {
    async function fetchProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (error) {
          console.error("Error fetching profile:", error)
        } else if (data) {
          setUser(data)
          setUpdatedProfile(data)
        }
      } else {
        router.push('/login')
      }
      setLoading(false)
    }

    fetchProfile()
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUpdatedProfile(prev => prev ? { ...prev, [name]: value } : null)
  }

  const handleSave = async () => {
    if (user && updatedProfile) {
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: updatedProfile.display_name,
          bio: updatedProfile.bio,
        })
        .eq('id', user.id)

      if (error) {
        console.error("Error updating profile:", error)
      } else {
        setUser(updatedProfile)
        setEditMode(false)
      }
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="w-24 h-24">
              <AvatarImage src={user?.avatar_url} alt={user?.display_name} />
              <AvatarFallback>{user?.display_name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="space-y-2 w-full">
              <Label htmlFor="display_name">Name</Label>
              <Input
                id="display_name"
                name="display_name"
                value={editMode ? updatedProfile?.display_name : user?.display_name}
                onChange={handleInputChange}
                disabled={!editMode}
              />
            </div>
            <div className="space-y-2 w-full">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                value={user?.email}
                disabled
              />
            </div>
            <div className="space-y-2 w-full">
              <Label htmlFor="bio">Bio</Label>
              <Input
                id="bio"
                name="bio"
                value={editMode ? updatedProfile?.bio : user?.bio}
                onChange={handleInputChange}
                disabled={!editMode}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          {editMode ? (
            <>
              <Button variant="outline" onClick={() => setEditMode(false)} className="mr-2">Cancel</Button>
              <Button onClick={handleSave}>Save</Button>
            </>
          ) : (
            <Button onClick={() => setEditMode(true)}>Edit</Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
