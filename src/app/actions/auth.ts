'use server'

import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'

export type AuthState = { error?: string | null }

export async function signInAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')
  const supabase = await createSupabaseServerClient()
  let { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    const needsConfirmation = error.message?.toLowerCase().includes('confirm')
    if (!needsConfirmation) return { error: error.message }

    const admin = createSupabaseAdminClient()
    if (!admin) {
      return {
        error:
          'Email not confirmed. Provide SUPABASE_SERVICE_ROLE_KEY to auto-confirm or confirm via email.',
      }
    }

    const { data: list } = await admin.auth.admin.listUsers()
    const candidate = list?.users?.find(
      (u) => u.email?.toLowerCase() === email.toLowerCase(),
    )
    if (!candidate) return { error: error.message }

    await admin.auth.admin.updateUserById(candidate.id, {
      email_confirm: true,
    })

    const retry = await supabase.auth.signInWithPassword({ email, password })
    if (retry.error) return { error: retry.error.message }
    data = retry.data
  }

  // Ensure user profile exists
  const { data: userResp } = await supabase.auth.getUser()
  const user = userResp.user ?? data?.user ?? null
  if (user) {
    await supabase.from('users').upsert(
      {
        user_id: user.id,
        email: user.email,
      },
      { onConflict: 'user_id' as any },
    )
  }

  redirect('/dashboard')
}

export async function signUpAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')
  const name = String(formData.get('name') ?? '')
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) return { error: error.message }

  let user = data.user

  if (!user) {
    const { data: signInData, error: signInError } =
      await supabase.auth.signInWithPassword({ email, password })
    if (signInError) return { error: signInError.message }
    user = signInData.user
  }

  if (!user) return { error: 'Unable to complete sign-up' }

  await supabase.from('users').upsert(
    {
      user_id: user.id,
      email: user.email,
      name,
    },
    { onConflict: 'user_id' as any },
  )

  return redirect('/dashboard') as never
}

export async function signOutAction(): Promise<void> {
  const supabase = await createSupabaseServerClient()
  await supabase.auth.signOut()
  redirect('/')
}
