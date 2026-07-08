'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { ShieldCheck } from 'lucide-react'
import { adminLogin } from './actions'

export default function AdminLoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)
    const result = await adminLogin(formData)
    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900 text-zinc-100 p-4">
      <Card className="w-full max-w-md shadow-2xl border-zinc-800 bg-zinc-950/50 backdrop-blur-xl">
        <CardHeader className="space-y-2 text-center pb-6">
          <div className="flex justify-center mb-2">
            <div className="h-12 w-12 bg-red-600/20 rounded-xl flex items-center justify-center shadow-inner border border-red-500/20">
              <ShieldCheck className="h-6 w-6 text-red-500" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-zinc-100">Admin Portal</CardTitle>
          <CardDescription className="text-zinc-400">
            Sign in to manage DeenDash users and settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-300">Admin Email</Label>
              <Input
                id="email"
                name="email"
                type="text"
                placeholder="admin@salahnazal"
                required
                className="h-11 bg-zinc-900/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-600"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-zinc-300">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                className="h-11 bg-zinc-900/50 border-zinc-800 text-zinc-100"
              />
            </div>
            
            {error && (
              <div className="p-3 text-sm text-red-400 bg-red-950/30 rounded-md border border-red-900/50">
                {error}
              </div>
            )}

            <Button 
              className="w-full h-11 bg-red-600 hover:bg-red-700 text-white font-medium mt-4 shadow-lg shadow-red-900/20" 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Authenticating..." : "Login to Dashboard"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pt-4 border-t border-zinc-800/50">
          <div className="text-sm text-center text-zinc-500">
            Secure administrative access only.
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
