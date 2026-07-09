'use client'

import { useState } from 'react'
import { Phone, CalendarDays, KeyRound, AlertCircle, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { generateTempPassword } from '@/app/admindash/(dashboard)/actions'

export function UserTable({ initialUsers }: { initialUsers: any[] }) {
  const [users, setUsers] = useState(initialUsers)
  const [loading, setLoading] = useState<string | null>(null)
  const [tempPassword, setTempPassword] = useState<{id: string, pass: string} | null>(null)

  const handleGenerateTempPassword = async (userId: string) => {
    if (!confirm('Generate a new temporary password for this user? This will overwrite their existing password.')) {
      return
    }
    
    setLoading(userId)
    try {
      const result = await generateTempPassword(userId)
      if (result.error) {
        toast.error(result.error)
      } else if (result.tempPassword) {
        setTempPassword({ id: userId, pass: result.tempPassword })
        toast.success("Temporary password generated!")
        setUsers(users.map(u => u.id === userId ? { ...u, reset_requested: false, is_temp_password: true } : u))
      }
    } catch (err: any) {
      toast.error(err.message || 'An error occurred')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="rounded-md border border-zinc-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-zinc-400 uppercase bg-zinc-950/50 border-b border-zinc-800">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Phone Number</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: any) => (
              <tr key={user.id} className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                <td className="px-4 py-3 font-medium text-white flex items-center">
                  <div className="h-8 w-8 rounded-full bg-red-900/30 text-red-400 flex items-center justify-center mr-3 uppercase font-bold text-xs">
                    {user.name.substring(0, 2)}
                  </div>
                  <div>
                    {user.name}
                    <div className="text-xs text-zinc-500 font-normal flex items-center mt-1">
                      <CalendarDays className="h-3 w-3 mr-1" />
                      Joined {new Date(user.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center text-zinc-300">
                    <Phone className="h-3 w-3 mr-2 text-zinc-500" />
                    {user.phone_number}
                  </div>
                </td>
                <td className="px-4 py-3">
                  {user.reset_requested ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20">
                      <AlertCircle className="w-3 h-3 mr-1" /> Reset Requested
                    </span>
                  ) : user.is_temp_password ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      <KeyRound className="w-3 h-3 mr-1" /> Temp Password Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <Check className="w-3 h-3 mr-1" /> Secure
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  {tempPassword?.id === user.id ? (
                    <div className="flex flex-col items-end">
                      <div className="text-xs text-amber-500 mb-1">Temp Password:</div>
                      <code className="bg-amber-500/10 text-amber-400 px-2 py-1 rounded font-mono text-sm border border-amber-500/20 select-all">
                        {tempPassword!.pass}
                      </code>
                    </div>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleGenerateTempPassword(user.id)}
                      disabled={loading === user.id}
                      className={user.reset_requested ? "border-amber-500/50 text-amber-500 hover:bg-amber-500/10 hover:text-amber-400" : "border-zinc-700 text-zinc-300 hover:bg-zinc-800"}
                    >
                      {loading === user.id ? "Generating..." : "Generate Temp Password"}
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
