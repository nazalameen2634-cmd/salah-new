import { login } from './actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <div className="flex h-screen w-full items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
      <Card className="w-full max-w-sm shadow-xl border-zinc-200 dark:border-zinc-800">
        <CardHeader className="space-y-1 text-center pb-8">
          <CardTitle className="text-2xl font-semibold tracking-tight">DeenDash</CardTitle>
          <CardDescription className="text-sm text-zinc-500 dark:text-zinc-400">
            Enter your PIN to access your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="login-form" action={login} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pin" className="sr-only">PIN</Label>
              <Input
                id="pin"
                name="pin"
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="****"
                required
                autoFocus
                className="text-center text-2xl tracking-widest bg-zinc-100/50 dark:bg-zinc-900/50 focus-visible:ring-emerald-500 py-6"
              />
            </div>
            {error && <p className="text-sm font-medium text-destructive text-center">{error}</p>}
          </form>
        </CardContent>
        <CardFooter>
          <Button form="login-form" type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
            Enter
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
