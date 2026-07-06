'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, MoonStar, Activity, BarChart2, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

const routes = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/',
  },
  {
    label: 'Salah',
    icon: MoonStar,
    href: '/salah',
  },
  {
    label: 'Habits',
    icon: Activity,
    href: '/habits',
  },
  {
    label: 'Reports',
    icon: BarChart2,
    href: '/reports',
  },
  {
    label: 'Calendar',
    icon: Calendar,
    href: '/calendar',
  },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 z-50 w-full h-16 bg-card border-t border-border md:hidden">
      <div className="grid h-full max-w-lg grid-cols-5 mx-auto font-medium">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "inline-flex flex-col items-center justify-center px-5 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800",
              pathname === route.href 
                ? "text-emerald-600 dark:text-emerald-500" 
                : "text-muted-foreground"
            )}
          >
            <route.icon className="w-5 h-5 mb-1" />
            <span className="text-[10px]">{route.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
