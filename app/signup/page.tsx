'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { UserPlus } from 'lucide-react'
import { signup } from '@/app/login/actions'
import { Check, Loader2 } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const SECURITY_QUESTIONS = [
  "What was the name of your first pet?",
  "What is your mother's maiden name?",
  "What city were you born in?",
  "What was your childhood nickname?",
  "What is the name of your favorite teacher?",
]

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)
    const result = await signup(formData)
    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
      <Card className="w-full max-w-md shadow-lg border-emerald-100 dark:border-emerald-900/30">
        <CardHeader className="space-y-2 text-center pb-6">
          <div className="flex justify-center mb-2">
            <div className="h-12 w-12 bg-emerald-600 rounded-xl flex items-center justify-center shadow-md">
              <UserPlus className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Create an Account</CardTitle>
          <CardDescription>
            Enter your details to get started with DeenDash
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Ahmed Ali"
                required
                className="h-11"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                pattern="^[0-9]{10}$"
                title="Please enter a valid 10-digit Indian phone number"
                required
                className="h-11"
              />
              <p className="text-xs text-muted-foreground">
                You will use this number to log in later.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                className="h-11"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirm_password">Confirm Password</Label>
              <Input
                id="confirm_password"
                name="confirm_password"
                type="password"
                required
                className="h-11"
              />
            </div>

            <div className="pt-2 pb-1">
              <h3 className="text-sm font-medium border-b pb-2">Security Questions</h3>
              <p className="text-xs text-muted-foreground mt-1">Used for password recovery</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="security_q1">Question 1</Label>
              <Select name="security_q1" required defaultValue={SECURITY_QUESTIONS[0]}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select a question" />
                </SelectTrigger>
                <SelectContent>
                  {SECURITY_QUESTIONS.map((q) => (
                    <SelectItem key={q} value={q}>{q}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="security_a1">Answer 1</Label>
              <Input
                id="security_a1"
                name="security_a1"
                type="text"
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2 mt-4">
              <Label htmlFor="security_q2">Question 2</Label>
              <Select name="security_q2" required defaultValue={SECURITY_QUESTIONS[1]}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select a question" />
                </SelectTrigger>
                <SelectContent>
                  {SECURITY_QUESTIONS.map((q) => (
                    <SelectItem key={q} value={q}>{q}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="security_a2">Answer 2</Label>
              <Input
                id="security_a2"
                name="security_a2"
                type="text"
                required
                className="h-11"
              />
            </div>
            
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-400 rounded-md border border-red-100 dark:border-red-900/50">
                {error}
              </div>
            )}

            <Button 
              className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-medium mt-2" 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pt-4 border-t">
          <div className="text-sm text-center text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-emerald-600 hover:text-emerald-500 font-medium">
              Log in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
