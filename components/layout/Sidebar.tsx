'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signout } from '@/app/login/actions'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Calendar,
  Activity,
  BarChart3,
  LogOut,
  Moon,
  Sun,
  Flame,
  User
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const routes = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/',
  },
  {
    label: "Today's Salah",
    icon: Moon, // Custom icon for Salah
    href: '/salah',
  },
  {
    label: 'Habit Tracker',
    icon: Activity,
    href: '/habits',
  },
  {
    label: 'Fitness Tracker',
    icon: Flame,
    href: '/fitness',
  },
  {
    label: 'Reports',
    icon: BarChart3,
    href: '/reports',
  },
  {
    label: 'Calendar',
    icon: Calendar,
    href: '/calendar',
  },
  {
    label: 'Profile',
    icon: User,
    href: '/profile',
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-zinc-50 dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100">
      <div className="px-3 py-2 flex-1">
        <Link href="/" className="flex items-center pl-3 mb-14">
          <div className="relative h-8 w-8 mr-4 bg-emerald-600 rounded-lg flex items-center justify-center shadow-md">
            <Moon className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">DeenDash</h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                'text-sm group flex p-3 w-full justify-start font-medium cursor-pointer rounded-lg transition-colors',
                pathname === route.href
                  ? 'bg-zinc-200/50 dark:bg-zinc-800/50 text-emerald-600 dark:text-emerald-400'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn('h-5 w-5 mr-3', pathname === route.href ? 'text-emerald-600 dark:text-emerald-400' : '')} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-auto px-3 py-4 border-t border-zinc-200 dark:border-zinc-800">
        <form action={signout}>
          <button
            type="submit"
            className="text-sm group flex p-3 w-full justify-start font-medium cursor-pointer rounded-lg transition-colors text-zinc-500 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
          >
            <div className="flex items-center flex-1">
              <LogOut className="h-5 w-5 mr-3" />
              Sign Out
            </div>
          </button>
        </form>
      </div>
    </div>
  )
}
