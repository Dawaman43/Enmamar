'use client'
import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { signUpAction, type AuthState } from '@/app/actions/auth'
import { useFormState } from 'react-dom'
import { useState } from 'react'

export default function SignUpPage() {
  const [state, action] = useFormState<AuthState, FormData>(signUpAction, {})
  const [show, setShow] = useState(false)
  return (
    <main className="mx-auto max-w-md">
      <Card>
        <CardHeader>
          <h1 className="text-lg font-semibold">Create account</h1>
        </CardHeader>
        <CardContent>
          <form className="grid gap-3" action={action}>
            <Input name="name" placeholder="Full name (optional)" />
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
            <Button type="submit">Sign up</Button>
          </form>
          <p className="mt-3 text-sm opacity-80">
            Already have an account?{' '}
            <Link href="/sign-in" className="underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
