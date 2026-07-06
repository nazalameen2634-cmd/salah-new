import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, CalendarDays, Flame, Award } from 'lucide-react'
import { DateNavigator } from '@/components/shared/date-navigator'

export default async function DashboardPage(props: { searchParams: Promise<{ date?: string }> }) {
  const searchParams = await props.searchParams
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const today = new Date().toISOString().split('T')[0]
  const date = searchParams.date || today

  // Fetch data for the specified date
  const { data: prayersData } = await supabase
    .from('prayers')
    .select('*')
    .eq('user_id', user.id)
    .eq('date', date)

  const prayers = prayersData as any[] | null
  const completedPrayers = prayers?.filter(p => p.completed).length || 0
  const prayerPercentage = Math.round((completedPrayers / 5) * 100)

  // Fetch active habits
  const { data: activeHabits } = await supabase
    .from('habits')
    .select('id')
    .eq('user_id', user.id)
    .eq('active', true)

  const { data: habitLogsData } = await supabase
    .from('habit_logs')
    .select('*')
    .eq('user_id', user.id)
    .eq('date', date)

  const habitLogs = habitLogsData as any[] | null
  const totalHabits = activeHabits?.length || 0
  const completedHabits = habitLogs?.filter(l => l.completed).length || 0
  const habitPercentage = totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0

  // Calculate Daily Score
  // e.g. Prayers = 70%, Habits = 30% of total score
  const score = Math.round((prayerPercentage * 0.7) + (habitPercentage * 0.3))
  let tier = 'Bronze'
  if (score >= 90) tier = 'Elite'
  else if (score >= 75) tier = 'Diamond'
  else if (score >= 50) tier = 'Gold'
  else if (score >= 25) tier = 'Silver'

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your progress for {date === today ? 'today' : date}.
          </p>
        </div>
        <DateNavigator currentDate={date} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-emerald-100 dark:border-emerald-900/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prayer Completion</CardTitle>
            <Activity className="h-4 w-4 text-emerald-600 dark:text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{prayerPercentage}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {completedPrayers} of 5 prayers completed
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-emerald-100 dark:border-emerald-900/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Habit Completion</CardTitle>
            <CalendarDays className="h-4 w-4 text-emerald-600 dark:text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{habitPercentage}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {completedHabits} of {totalHabits} habits completed
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-emerald-100 dark:border-emerald-900/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Flame className="h-4 w-4 text-emerald-600 dark:text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1 days</div>
            <p className="text-xs text-muted-foreground mt-1">
              Keep the momentum going!
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-emerald-100 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Score</CardTitle>
            <Award className="h-4 w-4 text-emerald-600 dark:text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">{score} pts</div>
            <p className="text-xs text-emerald-600/80 dark:text-emerald-500/80 mt-1 font-medium">
              {tier} Tier
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 h-[400px] flex items-center justify-center border-dashed">
            <div className="text-center">
                <p className="text-muted-foreground">Activity charts will appear here</p>
                <p className="text-xs text-muted-foreground mt-2">Collect more data to generate insights</p>
            </div>
        </Card>
        <Card className="col-span-3 h-[400px] flex items-center justify-center border-dashed">
            <div className="text-center">
                <p className="text-muted-foreground">Recent Activity Timeline</p>
            </div>
        </Card>
      </div>
    </div>
  )
}
