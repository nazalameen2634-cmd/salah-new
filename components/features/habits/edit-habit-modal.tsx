'use client'

import { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Habit } from '@/types/supabase'
import { createClient } from '@/lib/supabase/client'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'

interface EditHabitModalProps {
  isOpen: boolean
  onClose: () => void
  habit: Habit | null
  onSuccess: (habit: Habit) => void
}

export function EditHabitModal({ isOpen, onClose, habit, onSuccess }: EditHabitModalProps) {
  const supabase = createClient()
  const queryClient = useQueryClient()
  
  const [name, setName] = useState('')
  const [category, setCategory] = useState('Personal')

  useEffect(() => {
    if (habit) {
      setName(habit.name)
      setCategory(habit.category || 'Personal')
    }
  }, [habit])

  const editHabit = useMutation({
    mutationFn: async () => {
      if (!habit) throw new Error("No habit selected")
      const { data, error } = await (supabase.from('habits') as any)
        .update({
          name,
          category,
        })
        .eq('id', habit.id)
        .select()
        .single()
        
      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      toast.success('Habit updated successfully')
      onSuccess(data)
      queryClient.invalidateQueries({ queryKey: ['habits'] })
      handleClose()
    },
    onError: (error) => {
      toast.error('Failed to update habit: ' + error.message)
    }
  })

  const handleClose = () => {
    onClose()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    editHabit.mutate()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Habit</DialogTitle>
            <DialogDescription>
              Update your habit details.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Habit Name</Label>
              <Input
                id="edit-name"
                placeholder="e.g. Read Quran for 15 mins"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-category">Category</Label>
              <Select value={category} onValueChange={(val) => setCategory(val as string)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Islam">Islam</SelectItem>
                  <SelectItem value="Health">Health</SelectItem>
                  <SelectItem value="Learning">Learning</SelectItem>
                  <SelectItem value="Fitness">Fitness</SelectItem>
                  <SelectItem value="Work">Work</SelectItem>
                  <SelectItem value="Personal">Personal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim() || editHabit.isPending} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              {editHabit.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
