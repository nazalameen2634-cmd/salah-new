import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { format } from 'date-fns'
import { FitnessTracker } from '@/components/features/fitness/fitness-tracker'
import { getAuthCookie } from '@/lib/auth'

export const metadata = {
  title: 'Fitness Tracker | Islamic Productivity',
  description: 'Track your daily fitness activities',
}

export default async function FitnessPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>
}) {
  const supabase = await createClient()

  // Get current date or date from query params
  const { date } = await searchParams
  const currentDate = date || format(new Date(), 'yyyy-MM-dd')

  const userId = await getAuthCookie()
  if (!userId) redirect('/login')

  // Fetch fitness log for the date
  const { data: initialLog } = await supabase
    .from('fitness_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('date', currentDate)
    .single()

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <FitnessTracker 
        date={currentDate} 
        initialLog={initialLog}
        userId={userId}
      />
    </div>
  )
}
