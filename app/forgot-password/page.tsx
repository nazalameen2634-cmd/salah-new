'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { KeyRound, ArrowRight, Loader2, Phone, Check } from 'lucide-react'
import { checkPhoneAndGetQuestions, verifyAnswers, requestAdminReset, resetPassword } from '@/app/login/actions'

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  const [phone, setPhone] = useState('')
  const [questions, setQuestions] = useState<{q1: string, q2: string} | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [tempToken, setTempToken] = useState<string | null>(null)

  // Form states
  const [a1, setA1] = useState('')
  const [a2, setA2] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      const result = await checkPhoneAndGetQuestions(phone)
      if (result.error) {
        setError(result.error)
      } else if (result.questions) {
        setQuestions(result.questions)
        setUserId(result.userId || null)
        setStep(2)
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleAnswersSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) return

    setLoading(true)
    setError(null)
    
    try {
      const result = await verifyAnswers(userId, a1, a2)
      if (result.error) {
        setError(result.error)
      } else if (result.token) {
        setTempToken(result.token)
        setStep(3) // Move to password reset
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleAdminRequest = async () => {
    if (!userId) return
    setLoading(true)
    setError(null)
    
    try {
      const result = await requestAdminReset(userId)
      if (result.error) {
        setError(result.error)
      } else {
        setStep(4) // Move to success page
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId || !tempToken) return

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      const result = await resetPassword(userId, tempToken, newPassword)
      if (result.error) {
        setError(result.error)
      }
      // If success, the action redirects to login automatically
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-950">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-emerald-600 p-3 rounded-full mb-4">
            <KeyRound className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Recover Account
          </h1>
        </div>

        <Card className="border-0 shadow-lg dark:border dark:border-zinc-800">
          <CardHeader>
            <CardTitle>
              {step === 1 && "Find Your Account"}
              {step === 2 && "Security Questions"}
              {step === 3 && "Set New Password"}
              {step === 4 && "Request Sent"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Enter your phone number to find your account."}
              {step === 2 && "Answer your security questions to reset your password."}
              {step === 3 && "Please choose a strong new password."}
              {step === 4 && "The admin has been notified."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Step 1: Phone */}
            {step === 1 && (
              <form onSubmit={handlePhoneSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      pattern="^[0-9]{10}$"
                      required
                      className="pl-9 h-11"
                      placeholder="10-digit number"
                    />
                  </div>
                </div>
                {error && <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/30 rounded-md border border-red-100 dark:border-red-900/50">{error}</div>}
                <Button type="submit" className="w-full h-11 bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            )}

            {/* Step 2: Questions */}
            {step === 2 && questions && (
              <form onSubmit={handleAnswersSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>{questions.q1}</Label>
                  <Input
                    required
                    value={a1}
                    onChange={(e) => setA1(e.target.value)}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label>{questions.q2}</Label>
                  <Input
                    required
                    value={a2}
                    onChange={(e) => setA2(e.target.value)}
                    className="h-11"
                  />
                </div>
                {error && <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/30 rounded-md border border-red-100 dark:border-red-900/50">{error}</div>}
                <Button type="submit" className="w-full h-11 bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Verify Answers
                </Button>
                
                <div className="mt-4 pt-4 border-t text-center">
                  <p className="text-sm text-muted-foreground mb-3">Forgot your answers?</p>
                  <Button type="button" variant="outline" className="w-full h-11" onClick={handleAdminRequest} disabled={loading}>
                    Request Admin Help
                  </Button>
                </div>
              </form>
            )}

            {/* Step 3: New Password */}
            {step === 3 && (
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new_password">New Password</Label>
                  <Input
                    id="new_password"
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm_password">Confirm New Password</Label>
                  <Input
                    id="confirm_password"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-11"
                  />
                </div>
                {error && <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/30 rounded-md border border-red-100 dark:border-red-900/50">{error}</div>}
                <Button type="submit" className="w-full h-11 bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Save New Password
                </Button>
              </form>
            )}

            {/* Step 4: Admin Requested */}
            {step === 4 && (
              <div className="text-center py-4 space-y-4">
                <div className="bg-emerald-100 dark:bg-emerald-900/30 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                  <Check className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <p className="text-muted-foreground">
                  Your request has been sent to the admin. Please contact them directly, and they will provide you with a temporary password to log in.
                </p>
                <Button className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 mt-4" onClick={() => window.location.href = '/login'}>
                  Return to Login
                </Button>
              </div>
            )}
          </CardContent>
          <CardFooter className="justify-center border-t border-zinc-100 dark:border-zinc-900 pt-6">
            <p className="text-sm text-zinc-500">
              Remember your password?{' '}
              <Link href="/login" className="text-emerald-600 hover:text-emerald-700 font-medium hover:underline">
                Log in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
