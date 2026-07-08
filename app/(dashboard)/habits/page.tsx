import { createClient } from '@/lib/supabase/server'
import { HabitList } from '@/components/features/habits/habit-list'
import { DateNavigator } from '@/components/shared/date-navigator'
import { getAuthCookie } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function HabitsPage(props: { searchParams: Promise<{ date?: string }> }) {
  const searchParams = await props.searchParams
  const supabase = await createClient()

  const today = new Date().toISOString().split('T')[0]
  const date = searchParams.date || today

  const userId = await getAuthCookie()
  if (!userId) redirect('/login')

  // Fetch habits and today's logs in parallel
  const [habitsResponse, logsResponse] = await Promise.all([
    supabase
      .from('habits')
      .select('*')
      .eq('user_id', userId)
      .eq('active', true)
      .order('created_at'),
    supabase
      .from('habit_logs')
      .select('*')
      .eq('user_id', userId)
      .eq('date', date)
  ])

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Habit Tracker</h1>
          <p className="text-muted-foreground">
            Build good habits, break bad ones.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <DateNavigator currentDate={date} />
        </div>
      </div>

      <HabitList 
        initialHabits={habitsResponse.data || []} 
        initialLogs={logsResponse.data || []}
        date={date}
        userId={userId}
      />
    </div>
  )
}
