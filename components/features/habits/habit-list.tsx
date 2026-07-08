'use client'

import { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Habit, HabitLog } from '@/types/supabase'
import { createClient } from '@/lib/supabase/client'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Activity, MoreVertical, Pencil, Trash2 } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { CreateHabitModal } from './create-habit-modal'
import { EditHabitModal } from './edit-habit-modal'

interface HabitListProps {
  initialHabits: Habit[]
  initialLogs: HabitLog[]
  date: string
  userId: string
}

export function HabitList({ initialHabits, initialLogs, date, userId }: HabitListProps) {
  const supabase = createClient()
  const queryClient = useQueryClient()
  
  const [habits, setHabits] = useState<Habit[]>(initialHabits)
  const [logs, setLogs] = useState<HabitLog[]>(initialLogs)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)

  useEffect(() => {
    setHabits(initialHabits)
    setLogs(initialLogs)
  }, [initialHabits, initialLogs])

  const deleteHabit = useMutation({
    mutationFn: async (habitId: string) => {
      // Delete logs first just in case there's no cascade delete
      await supabase.from('habit_logs').delete().eq('habit_id', habitId)
      const { error } = await supabase.from('habits').delete().eq('id', habitId)
      if (error) throw error
      return habitId
    },
    onSuccess: (deletedId) => {
      setHabits(current => current.filter(h => h.id !== deletedId))
      setLogs(current => current.filter(l => l.habit_id !== deletedId))
      toast.success("Habit deleted successfully")
      queryClient.invalidateQueries({ queryKey: ['habits'] })
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete habit")
    }
  })

  const handleDelete = (habitId: string) => {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      deleteHabit.mutate(habitId)
    }
  }

  const toggleHabit = useMutation({
    mutationFn: async ({ habitId, completed }: { habitId: string, completed: boolean }) => {
      const existingLog = logs.find(l => l.habit_id === habitId)
      
      if (existingLog && !existingLog.id.toString().startsWith('temp-')) {
        const { data, error } = await (supabase.from('habit_logs') as any)
          .update({ completed })
          .eq('user_id', userId)
          .eq('habit_id', habitId)
          .eq('date', date)
          .select()
          .single()
        
        if (error) throw error
        return data as HabitLog
      } else {
        const { data, error } = await (supabase.from('habit_logs') as any)
          .upsert({
            habit_id: habitId,
            user_id: userId,
            date,
            completed,
          }, { onConflict: 'habit_id,user_id,date' })
          .select()
          .single()
          
        if (error) throw error
        return data as HabitLog
      }
    },
    onMutate: async (variables) => {
      setLogs(current => {
        const existing = current.find(l => l.habit_id === variables.habitId)
        if (existing) {
          return current.map(l => l.habit_id === variables.habitId ? { ...l, completed: variables.completed } : l)
        } else {
          return [...current, {
            id: 'temp-' + Date.now(),
            habit_id: variables.habitId,
            user_id: userId,
            date,
            completed: variables.completed,
            notes: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }]
        }
      })
    },
    onSuccess: (data) => {
      setLogs(current => {
        const exists = current.find(l => l.habit_id === data.habit_id)
        if (exists) {
          return current.map(l => l.habit_id === data.habit_id ? data : l)
        }
        return [...current, data]
      })
      queryClient.invalidateQueries({ queryKey: ['habit_logs', date] })
    },
    onError: (error: any) => {
      console.error(error)
      toast.error(error.message || "Failed to update habit status")
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Habits</h2>
        <Button onClick={() => setIsModalOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white">
          <Plus className="mr-2 h-4 w-4" /> New Habit
        </Button>
      </div>

      {habits.length === 0 ? (
        <Card className="p-12 flex flex-col items-center justify-center text-center border-dashed">
          <Activity className="h-12 w-12 text-zinc-300 dark:text-zinc-700 mb-4" />
          <h3 className="text-lg font-medium">No habits yet</h3>
          <p className="text-sm text-muted-foreground mt-2 max-w-sm">
            Start tracking your daily goals by creating your first habit.
          </p>
          <Button onClick={() => setIsModalOpen(true)} className="mt-6" variant="outline">
            Create Habit
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {habits.map((habit) => {
              const log = logs.find((l) => l.habit_id === habit.id)
              const isCompleted = log?.completed || false

              return (
                <motion.div
                  key={habit.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className={`overflow-hidden transition-all duration-300 border ${
                    isCompleted 
                      ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800' 
                      : 'bg-card border-border'
                  }`}>
                    <div className="p-6 flex items-center space-x-4">
                      <Checkbox
                        id={`habit-${habit.id}`}
                        checked={isCompleted}
                        onCheckedChange={(checked) => {
                          toggleHabit.mutate({ 
                            habitId: habit.id, 
                            completed: checked as boolean 
                          })
                        }}
                        className={`h-6 w-6 rounded-full transition-all ${
                          isCompleted ? 'data-[state=checked]:bg-emerald-600 data-[state=checked]:text-white data-[state=checked]:border-emerald-600' : ''
                        }`}
                      />
                      <div className="flex-1 flex justify-between items-center">
                        <div>
                          <Label
                            htmlFor={`habit-${habit.id}`}
                            className={`text-lg font-medium cursor-pointer transition-colors ${
                              isCompleted ? 'text-emerald-700 dark:text-emerald-400 line-through decoration-emerald-300' : ''
                            }`}
                          >
                            {habit.name}
                          </Label>
                          <p className="text-xs text-muted-foreground mt-1 capitalize">{habit.category || 'General'}</p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent">
                            <MoreVertical className="h-4 w-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setEditingHabit(habit)}>
                              <Pencil className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(habit.id)} className="text-destructive focus:text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}

      <CreateHabitModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={(newHabit) => setHabits([...habits, newHabit])}
        userId={userId}
      />
      <EditHabitModal
        isOpen={!!editingHabit}
        onClose={() => setEditingHabit(null)}
        habit={editingHabit}
        onSuccess={(updatedHabit) => {
          setHabits(current => current.map(h => h.id === updatedHabit.id ? updatedHabit : h))
        }}
      />
    </div>
  )
}
