import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Users, Phone, CalendarDays } from 'lucide-react'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const { data: users, error } = await (supabase as any)
    .from('app_users')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <div className="p-6 text-red-400 bg-red-950/20 border border-red-900/50 rounded-lg">
        Failed to load users: {error.message}
      </div>
    )
  }

  const totalUsers = users?.length || 0

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard Overview</h1>
        <p className="text-zinc-400">
          Manage and monitor DeenDash platform activity.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-zinc-900 border-zinc-800 text-zinc-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-300">Total Registered Users</CardTitle>
            <Users className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-zinc-900 border-zinc-800 text-zinc-100">
        <CardHeader>
          <CardTitle>Registered Users</CardTitle>
          <CardDescription className="text-zinc-400">
            A complete list of users who have signed up.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {users && users.length > 0 ? (
            <div className="rounded-md border border-zinc-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-zinc-400 uppercase bg-zinc-950/50 border-b border-zinc-800">
                    <tr>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Phone Number</th>
                      <th className="px-4 py-3">User ID</th>
                      <th className="px-4 py-3">Joined Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user: any) => (
                      <tr key={user.id} className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                        <td className="px-4 py-3 font-medium text-white flex items-center">
                          <div className="h-8 w-8 rounded-full bg-red-900/30 text-red-400 flex items-center justify-center mr-3 uppercase font-bold text-xs">
                            {user.name.substring(0, 2)}
                          </div>
                          {user.name}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center text-zinc-300">
                            <Phone className="h-3 w-3 mr-2 text-zinc-500" />
                            {user.phone_number}
                          </div>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-zinc-500">
                          {user.id}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center text-zinc-300">
                            <CalendarDays className="h-3 w-3 mr-2 text-zinc-500" />
                            {new Date(user.created_at).toLocaleDateString()}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-zinc-500 bg-zinc-950/50 rounded-lg border border-dashed border-zinc-800">
              <Users className="h-8 w-8 mx-auto mb-3 opacity-20" />
              <p>No users have registered yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
