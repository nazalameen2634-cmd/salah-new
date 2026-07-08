'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Prayer } from '@/types/supabase'
import { createClient } from '@/lib/supabase/client'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { Users } from 'lucide-react'

const DEFAULT_PRAYERS = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']

interface PrayerListProps {
  initialPrayers: Prayer[]
  date: string
}

export function PrayerList({ initialPrayers, date }: PrayerListProps) {
  const supabase = createClient()
  const queryClient = useQueryClient()
  
  // Local state for optimistic updates
  const [prayers, setPrayers] = useState<Prayer[]>(initialPrayers)

  const togglePrayer = useMutation({
    mutationFn: async ({ prayerName, completed, jamaah }: { prayerName: string, completed: boolean, jamaah?: boolean }) => {
      const existing = prayers.find(p => p.prayer_name === prayerName)
      
      if (existing && !existing.id.toString().startsWith('temp-')) {
        const { data, error } = await (supabase.from('prayers') as any)
          .update({ 
            completed, 
            completed_time: completed ? new Date().toISOString() : null,
            jamaah: jamaah !== undefined ? jamaah : existing.jamaah 
          })
          .eq('date', date)
          .eq('prayer_name', prayerName)
          .select()
          .single()
        
        if (error) throw error
        return data as Prayer
      } else {
        // If it was optimistic or doesn't exist, we upsert or insert
        // But since Supabase insert might fail if it already exists, we can use upsert based on the unique constraint
        const { data, error } = await (supabase.from('prayers') as any)
          .upsert({
            date,
            prayer_name: prayerName,
            completed,
            completed_time: completed ? new Date().toISOString() : null,
            jamaah: jamaah || false
          }, { onConflict: 'date,prayer_name' })
          .select()
          .single()
          
        if (error) throw error
        return data as Prayer
      }
    },
    onMutate: async (variables) => {
      // Instant Optimistic Update
      setPrayers(current => {
        const existing = current.find(p => p.prayer_name === variables.prayerName)
        if (existing) {
          return current.map(p => p.prayer_name === variables.prayerName ? { 
            ...p, 
            completed: variables.completed,
            jamaah: variables.jamaah !== undefined ? variables.jamaah : p.jamaah
          } : p)
        } else {
          return [...current, {
            id: 'temp-' + Date.now(),
            date,
            prayer_name: variables.prayerName,
            completed: variables.completed,
            completed_time: variables.completed ? new Date().toISOString() : null,
            jamaah: variables.jamaah || false,
            notes: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }]
        }
      })
    },
    onSuccess: (data) => {
      setPrayers(current => {
        const exists = current.find(p => p.prayer_name === data.prayer_name)
        if (exists) {
          return current.map(p => p.prayer_name === data.prayer_name ? data : p)
        }
        return [...current, data]
      })
      queryClient.invalidateQueries({ queryKey: ['prayers', date] })
    },
    onError: (error: any) => {
      console.error(error)
      toast.error(error.message || "Failed to update prayer status")
    }
  })

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {DEFAULT_PRAYERS.map((prayerName) => {
        const prayerRecord = prayers.find((p) => p.prayer_name === prayerName)
        const isCompleted = prayerRecord?.completed || false
        const isJamaah = prayerRecord?.jamaah || false

        return (
          <motion.div
            key={prayerName}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Card className={`overflow-hidden transition-all duration-300 border ${
              isCompleted 
                ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800' 
                : 'bg-card border-border'
            }`}>
              <div className="p-6 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Checkbox
                    id={`prayer-${prayerName}`}
                    checked={isCompleted}
                    onCheckedChange={(checked) => {
                      togglePrayer.mutate({ 
                        prayerName, 
                        completed: checked as boolean 
                      })
                    }}
                    className={`h-6 w-6 rounded-full transition-all ${
                      isCompleted ? 'data-[state=checked]:bg-emerald-600 data-[state=checked]:text-white data-[state=checked]:border-emerald-600' : ''
                    }`}
                  />
                  <div>
                    <Label
                      htmlFor={`prayer-${prayerName}`}
                      className={`text-lg font-medium cursor-pointer transition-colors ${
                        isCompleted ? 'text-emerald-700 dark:text-emerald-400' : ''
                      }`}
                    >
                      {prayerName}
                    </Label>
                    <AnimatePresence>
                      {isCompleted && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-xs text-emerald-600 dark:text-emerald-500 mt-1"
                        >
                          Completed
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <button
                    onClick={() => {
                      togglePrayer.mutate({ 
                        prayerName, 
                        completed: isCompleted,
                        jamaah: !isJamaah
                      })
                    }}
                    className={`p-2 rounded-full transition-colors ${
                      isJamaah 
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300' 
                        : 'text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                    title={isJamaah ? "Prayed in congregation" : "Mark as congregation"}
                  >
                    <Users className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}
