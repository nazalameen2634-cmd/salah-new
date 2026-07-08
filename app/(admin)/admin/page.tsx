import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Activity } from 'lucide-react'

export default async function AdminPage() {
  const supabase = await createClient()

  // We call our securely defined RPC function to get aggregate stats
  // bypassing RLS for statistical purposes without leaking actual rows
  const { data: stats, error } = await supabase.rpc('get_platform_stats')
  
  const totalUsers = stats?.totalUsers || 0
  const activeUsers7d = stats?.activeUsers7d || 0

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Platform Overview</h1>
        <p className="text-muted-foreground">Monitor platform usage and health metrics.</p>
      </div>
      
      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-md">
          Error fetching stats: {error.message}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Registered Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              All time signups
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users (7d)</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeUsers7d}</div>
            <p className="text-xs text-muted-foreground">
              Users who logged data recently
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
