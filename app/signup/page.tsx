'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signup } from '@/app/login/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function SignupPage({
  searchParams,
}: {
  searchParams: { error?: string, message?: string }
}) {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
      <Card className="w-full max-w-md shadow-xl border-zinc-200 dark:border-zinc-800">
        <CardHeader className="space-y-2 text-center pb-6">
          <div className="mx-auto bg-emerald-600 rounded-xl p-3 w-12 h-12 flex items-center justify-center mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white w-6 h-6"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="19" y1="8" x2="19" y2="14"></line><line x1="22" y1="11" x2="16" y2="11"></line></svg>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Create an Account</CardTitle>
          <CardDescription className="text-sm text-zinc-500 dark:text-zinc-400">
            Join DeenDash to start tracking your daily progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="signup-form" className="space-y-4">
            <div className="space-y-2 text-left">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="John Doe"
                required
                className="bg-zinc-100/50 dark:bg-zinc-900/50"
              />
            </div>
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
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                className="bg-zinc-100/50 dark:bg-zinc-900/50"
              />
            </div>
            {searchParams.error && <p className="text-sm font-medium text-destructive text-center mt-2">{searchParams.error}</p>}
            {searchParams.message && <p className="text-sm font-medium text-emerald-600 text-center mt-2">{searchParams.message}</p>}
            
            <Button formAction={signup} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white mt-6">
              Sign Up
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t p-4">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Already have an account?{' '}
            <Link href="/login" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
