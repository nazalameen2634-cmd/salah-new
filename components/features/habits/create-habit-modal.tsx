'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Habit } from '@/types/supabase'
import { createClient } from '@/lib/supabase/client'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'

interface CreateHabitModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  onSuccess: (habit: Habit) => void
}

export function CreateHabitModal({ isOpen, onClose, userId, onSuccess }: CreateHabitModalProps) {
  const supabase = createClient()
  const queryClient = useQueryClient()
  
  const [name, setName] = useState('')
  const [category, setCategory] = useState('Personal')

  const createHabit = useMutation({
    mutationFn: async () => {
      const { data, error } = await (supabase.from('habits') as any)
        .insert({
          user_id: userId,
          name,
          category,
          frequency: 'daily',
          target: 1,
          active: true
        })
        .select()
        .single()
        
      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      toast.success('Habit created successfully')
      onSuccess(data)
      queryClient.invalidateQueries({ queryKey: ['habits'] })
      handleClose()
    },
    onError: (error) => {
      toast.error('Failed to create habit: ' + error.message)
    }
  })

  const handleClose = () => {
    setName('')
    setCategory('Personal')
    onClose()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    createHabit.mutate()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Habit</DialogTitle>
            <DialogDescription>
              Add a new daily habit you want to build.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Habit Name</Label>
              <Input
                id="name"
                placeholder="e.g. Read Quran for 15 mins"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
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
            <Button type="submit" disabled={!name.trim() || createHabit.isPending} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              {createHabit.isPending ? 'Creating...' : 'Create Habit'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
