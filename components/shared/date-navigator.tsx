'use client'

import * as React from 'react'
import { format, addDays, subDays, isToday, isYesterday } from 'date-fns'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

export function DateNavigator({ currentDate }: { currentDate: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Parse as local midnight to prevent timezone shifting
  const date = new Date(currentDate + 'T00:00:00')

  // Navigate to a specific date
  const navigateToDate = (newDate: Date) => {
    const params = new URLSearchParams(searchParams.toString())
    // Ensure we use the local date string (YYYY-MM-DD)
    const dateString = format(newDate, 'yyyy-MM-dd')
    
    // Always set explicitly to avoid UTC mismatch with server
    params.set('date', dateString)

    const query = params.toString()
    router.push(`${pathname}?${query}`, { scroll: false })
  }

  const goBack = () => navigateToDate(subDays(date, 1))
  const goForward = () => navigateToDate(addDays(date, 1))

  // Calculate if the current viewed date is today or in the future
  // We use format to compare YYYY-MM-DD safely
  const todayStr = format(new Date(), 'yyyy-MM-dd')
  const dateStr = format(date, 'yyyy-MM-dd')
  const isCurrentlyToday = dateStr === todayStr
  const isFuture = dateStr > todayStr

  const getDisplayFormat = () => {
    if (isCurrentlyToday) return 'Today'
    if (dateStr === format(subDays(new Date(), 1), 'yyyy-MM-dd')) return 'Yesterday'
    return format(date, 'MMM d, yyyy')
  }

  return (
    <div className="flex items-center space-x-2 bg-card border rounded-full p-1 shadow-sm w-fit">
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8 rounded-full" 
        onClick={goBack}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <Popover>
        <PopoverTrigger 
          className={cn(
            "inline-flex items-center w-[140px] justify-center text-left font-medium rounded-full h-8 hover:bg-accent hover:text-accent-foreground",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-emerald-600 dark:text-emerald-500" />
          {getDisplayFormat()}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="center">
          <Calendar
            mode="single"
            selected={date}
            disabled={(d) => d > new Date()} // Prevent selecting future dates
            onSelect={(newDate) => {
              if (newDate) {
                navigateToDate(newDate)
                document.dispatchEvent(new MouseEvent('mousedown'))
              }
            }}
          />
        </PopoverContent>
      </Popover>

      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8 rounded-full" 
        onClick={goForward}
        disabled={isCurrentlyToday} // Prevent going into the future for daily tracking
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
