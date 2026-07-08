'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Profile } from '@/types/supabase'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export function ProfileForm({ userId }: { userId: string }) {
  const supabase = createClient()
  const queryClient = useQueryClient()

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      const { data, error } = await (supabase as any).from('app_users').select('*').eq('id', userId).maybeSingle()
      if (error) throw error
      return data || {}
    }
  })

  const [formData, setFormData] = useState({
    name: '',
    phone_number: '',
    username: '',
    country: '',
    time_zone: 'UTC',
    language: 'en',
    age: '',
    weight: ''
  })

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        phone_number: profile.phone_number || '',
        username: profile.username || '',
        country: profile.country || '',
        time_zone: profile.time_zone || 'UTC',
        language: profile.language || 'en',
        age: profile.age?.toString() || '',
        weight: profile.weight?.toString() || ''
      })
    }
  }, [profile])

  const updateProfile = useMutation({
    mutationFn: async () => {
      const { error } = await (supabase as any).from('app_users')
        .update({
          name: formData.name,
          username: formData.username,
          country: formData.country,
          time_zone: formData.time_zone,
          language: formData.language,
          age: formData.age ? parseInt(formData.age, 10) : null,
          weight: formData.weight ? parseFloat(formData.weight) : null,
        })
        .eq('id', userId)

      if (error) throw error
    },
    onSuccess: () => {
      toast.success('Profile updated successfully')
      queryClient.invalidateQueries({ queryKey: ['profile', userId] })
    },
    onError: (error: any) => {
      toast.error('Failed to update profile: ' + error.message)
    }
  })

  if (isLoading) return <div>Loading...</div>

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Details</CardTitle>
        <CardDescription>Update your personal information and preferences.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); updateProfile.mutate(); }} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone" 
                value={formData.phone_number} 
                disabled 
                className="bg-zinc-100 dark:bg-zinc-800 text-zinc-500 cursor-not-allowed"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input 
                id="age" 
                type="number"
                value={formData.age} 
                onChange={e => setFormData({...formData, age: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input 
                id="weight" 
                type="number"
                step="0.1"
                value={formData.weight} 
                onChange={e => setFormData({...formData, weight: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username" 
                value={formData.username} 
                onChange={e => setFormData({...formData, username: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input 
                id="country" 
                value={formData.country} 
                onChange={e => setFormData({...formData, country: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time_zone">Time Zone</Label>
              <Select value={formData.time_zone} onValueChange={v => setFormData({...formData, time_zone: v || ''})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC">UTC (GMT)</SelectItem>
                  <SelectItem value="America/New_York">Eastern Time (US)</SelectItem>
                  <SelectItem value="Europe/London">London (GMT)</SelectItem>
                  <SelectItem value="Asia/Dubai">Dubai (GST)</SelectItem>
                  <SelectItem value="Asia/Jakarta">Jakarta (WIB)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select value={formData.language} onValueChange={v => setFormData({...formData, language: v || ''})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ar">Arabic</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="ur">Urdu</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button type="submit" disabled={updateProfile.isPending} className="mt-6 bg-emerald-600 hover:bg-emerald-700 text-white">
            {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
