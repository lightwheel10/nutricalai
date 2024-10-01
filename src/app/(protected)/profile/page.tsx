'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged } from 'firebase/auth'
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore'
import { auth } from '@/lib/firebase'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface UserProfile {
  displayName: string
  email: string
  photoURL: string
  bio: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [updatedProfile, setUpdatedProfile] = useState<UserProfile | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const db = getFirestore()
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid))
        if (userDoc.exists()) {
          const userData = userDoc.data() as UserProfile
          setUser(userData)
          setUpdatedProfile(userData)
        }
      } else {
        router.push('/login')
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUpdatedProfile(prev => prev ? { ...prev, [name]: value } : null)
  }

  const handleSave = async () => {
    if (user && updatedProfile && auth.currentUser) {
      const db = getFirestore()
      const updateData: Partial<UserProfile> = {}
      Object.entries(updatedProfile).forEach(([key, value]) => {
        if (key in updatedProfile) {
          updateData[key as keyof UserProfile] = value
        }
      })
      await updateDoc(doc(db, 'users', auth.currentUser.uid), updateData)
      setUser(updatedProfile)
      setEditMode(false)
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
              <AvatarImage src={user?.photoURL} alt={user?.displayName} />
              <AvatarFallback>{user?.displayName?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="space-y-2 w-full">
              <Label htmlFor="displayName">Name</Label>
              <Input
                id="displayName"
                name="displayName"
                value={editMode ? updatedProfile?.displayName : user?.displayName}
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
