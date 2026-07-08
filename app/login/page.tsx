'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { login } from './actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string, message?: string }
}) {
  const [loading, setLoading] = useState(false)
  
  return (
    <div className="flex h-screen w-full items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
      <Card className="w-full max-w-md shadow-xl border-zinc-200 dark:border-zinc-800">
        <CardHeader className="space-y-2 text-center pb-6">
          <div className="mx-auto bg-emerald-600 rounded-xl p-3 w-12 h-12 flex items-center justify-center mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white w-6 h-6"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Welcome Back</CardTitle>
          <CardDescription className="text-sm text-zinc-500 dark:text-zinc-400">
            Enter your email and password to access your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="login-form" className="space-y-4">
            <div className="space-y-2 text-left">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                className="bg-zinc-100/50 dark:bg-zinc-900/50"
              />
            </div>
            <div className="space-y-2 text-left">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                required
                className="bg-zinc-100/50 dark:bg-zinc-900/50"
              />
            </div>
            {searchParams.error && <p className="text-sm font-medium text-destructive text-center mt-2">{searchParams.error}</p>}
            {searchParams.message && <p className="text-sm font-medium text-emerald-600 text-center mt-2">{searchParams.message}</p>}
            
            <Button formAction={login} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white mt-6">
              Sign In
            </Button>
          </form>
          
          <div className="mt-6 flex items-center justify-center space-x-2">
            <div className="h-px bg-border flex-1"></div>
            <span className="text-xs text-muted-foreground uppercase">or continue with</span>
            <div className="h-px bg-border flex-1"></div>
          </div>
          
          <Button variant="outline" className="w-full mt-4" onClick={() => alert('Google Sign in coming soon!')}>
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Google
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center border-t p-4">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Don't have an account?{' '}
            <Link href="/signup" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
