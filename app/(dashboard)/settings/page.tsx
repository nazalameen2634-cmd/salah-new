import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProfileForm } from '@/components/features/settings/profile-form'

import { getAuthCookie } from '@/lib/auth'

export default async function SettingsPage() {
  const userId = await getAuthCookie()
  if (!userId) redirect('/login')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>
      
      <ProfileForm userId={userId} />
      
    </div>
  )
}
