'use client'
import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { signInAction, type AuthState } from '@/app/actions/auth'
import { useFormState } from 'react-dom'
import { useState } from 'react'

export default function SignInPage() {
  const [state, action] = useFormState<AuthState, FormData>(signInAction, {})
  const [show, setShow] = useState(false)
  return (
    <main className="mx-auto max-w-md">
      <Card>
        <CardHeader>
          <h1 className="text-lg font-semibold">Sign in</h1>
        </CardHeader>
        <CardContent>
          <form className="grid gap-3" action={action}>
            <Input name="email" type="email" placeholder="Email" required />
            <div className="relative">
              <Input
                name="password"
                type={show ? 'text' : 'password'}
                placeholder="Password"
                required
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs opacity-80"
                onClick={() => setShow((v) => !v)}
              >
                {show ? 'Hide' : 'Show'}
              </button>
            </div>
            {state?.error && (
              <div className="text-sm text-red-500">{state.error}</div>
            )}
            <Button type="submit">Sign in</Button>
          </form>
          <p className="mt-3 text-sm opacity-80">
            No account?{' '}
            <Link href="/sign-up" className="underline">
              Create one
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
