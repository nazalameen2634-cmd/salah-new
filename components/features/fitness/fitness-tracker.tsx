'use client'

import { useState, useEffect } from 'react'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { FitnessLog } from '@/types/supabase'
import { createClient } from '@/lib/supabase/client'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Flame, Activity, Footprints, Droplets } from 'lucide-react'
import { format } from 'date-fns'
import { DateNavigator } from '@/components/shared/date-navigator'

interface FitnessTrackerProps {
  date: string
  initialLog: FitnessLog | null
  userId: string
}

export function FitnessTracker({ date, initialLog, userId }: FitnessTrackerProps) {
  const supabase = createClient()
  const queryClient = useQueryClient()
  
  const [caloriesBurned, setCaloriesBurned] = useState(initialLog?.calories_burned?.toString() || '')
  const [activeMinutes, setActiveMinutes] = useState(initialLog?.active_minutes?.toString() || '')
  const [steps, setSteps] = useState(initialLog?.steps?.toString() || '')
  const [waterIntake, setWaterIntake] = useState(initialLog?.water_intake_ml?.toString() || '')

  useEffect(() => {
    if (initialLog) {
      setCaloriesBurned(initialLog.calories_burned?.toString() || '')
      setActiveMinutes(initialLog.active_minutes?.toString() || '')
      setSteps(initialLog.steps?.toString() || '')
      setWaterIntake(initialLog.water_intake_ml?.toString() || '')
    }
  }, [initialLog])

  const saveFitnessLog = useMutation({
    mutationFn: async () => {
      const logData = {
        user_id: userId,
        date,
        calories_burned: caloriesBurned ? parseInt(caloriesBurned) : 0,
        active_minutes: activeMinutes ? parseInt(activeMinutes) : 0,
        steps: steps ? parseInt(steps) : 0,
        water_intake_ml: waterIntake ? parseInt(waterIntake) : 0,
      }

      if (initialLog?.id) {
        const { data, error } = await (supabase.from('fitness_logs') as any)
          .update(logData)
          .eq('id', initialLog.id)
          .select()
          .single()
        if (error) throw error
        return data
      } else {
        const { data, error } = await (supabase.from('fitness_logs') as any)
          .upsert(logData, { onConflict: 'user_id,date' })
          .select()
          .single()
        if (error) throw error
        return data
      }
    },
    onSuccess: (data) => {
      toast.success('Fitness metrics saved successfully')
      queryClient.setQueryData(['fitness_log', date], data)
    },
    onError: (error: any) => {
      toast.error('Failed to save fitness metrics: ' + error.message)
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    saveFitnessLog.mutate()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Fitness Tracker</h2>
          <p className="text-muted-foreground">Track your physical activity for {format(new Date(date), 'MMMM do, yyyy')}</p>
        </div>
        <DateNavigator currentDate={date} />
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6 border bg-card hover:bg-accent/5 transition-colors">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <Flame className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <Label htmlFor="calories" className="text-base font-medium">Calories Burned</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  id="calories"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={caloriesBurned}
                  onChange={(e) => setCaloriesBurned(e.target.value)}
                  className="text-lg"
                />
                <span className="text-muted-foreground font-medium">kcal</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 border bg-card hover:bg-accent/5 transition-colors">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <Label htmlFor="activeMinutes" className="text-base font-medium">Active Minutes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  id="activeMinutes"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={activeMinutes}
                  onChange={(e) => setActiveMinutes(e.target.value)}
                  className="text-lg"
                />
                <span className="text-muted-foreground font-medium">min</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 border bg-card hover:bg-accent/5 transition-colors">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                  <Footprints className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <Label htmlFor="steps" className="text-base font-medium">Steps Taken</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  id="steps"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={steps}
                  onChange={(e) => setSteps(e.target.value)}
                  className="text-lg"
                />
                <span className="text-muted-foreground font-medium">steps</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 border bg-card hover:bg-accent/5 transition-colors">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg">
                  <Droplets className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                </div>
                <Label htmlFor="water" className="text-base font-medium">Water Intake</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  id="water"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={waterIntake}
                  onChange={(e) => setWaterIntake(e.target.value)}
                  className="text-lg"
                />
                <span className="text-muted-foreground font-medium">ml</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-8 flex justify-end">
          <Button 
            type="submit" 
            size="lg" 
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
            disabled={saveFitnessLog.isPending}
          >
            {saveFitnessLog.isPending ? 'Saving...' : 'Save Metrics'}
          </Button>
        </div>
      </form>
    </div>
  )
}
