import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProfileForm } from '@/components/features/settings/profile-form'

import { getAuthCookie } from '@/lib/auth'

export default async function ProfilePage() {
  const userId = await getAuthCookie()
  if (!userId) redirect('/login')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">
          Manage your personal information and preferences.
        </p>
      </div>
      
      <ProfileForm userId={userId} />
      
    </div>
  )
}
