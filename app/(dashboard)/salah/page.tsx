import { createClient } from '@/lib/supabase/server'
import { PrayerList } from '@/components/features/salah/prayer-list'

export default async function SalahPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // Fetch today's prayers for the user
  const today = new Date().toISOString().split('T')[0]
  
  const { data: prayers } = await supabase
    .from('prayers')
    .select('*')
    .eq('user_id', user.id)
    .eq('date', today)

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Today&apos;s Salah</h1>
        <p className="text-muted-foreground">
          Track your daily prayers and build consistency.
        </p>
      </div>

      <PrayerList initialPrayers={prayers || []} userId={user.id} date={today} />
    </div>
  )
}
