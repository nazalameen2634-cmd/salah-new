import { createClient } from '@/lib/supabase/server'
import { HabitList } from '@/components/features/habits/habit-list'

export default async function HabitsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // Fetch active habits
  const { data: habits } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', user.id)
    .eq('active', true)
    .order('created_at', { ascending: true })

  // Fetch today's habit logs
  const today = new Date().toISOString().split('T')[0]
  const { data: habitLogs } = await supabase
    .from('habit_logs')
    .select('*')
    .eq('user_id', user.id)
    .eq('date', today)

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Habit Tracker</h1>
          <p className="text-muted-foreground">
            Build good habits, break bad ones.
          </p>
        </div>
      </div>

      <HabitList 
        initialHabits={habits || []} 
        initialLogs={habitLogs || []} 
        userId={user.id} 
        date={today} 
      />
    </div>
  )
}
