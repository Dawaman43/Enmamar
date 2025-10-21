import HeaderClient from './header.client'
import { getAuthUserId } from '@/lib/supabase/server'
import { signOutAction } from '@/app/actions/auth'

export default async function Header() {
  const userId = await getAuthUserId()
  return <HeaderClient isAuthenticated={!!userId} onSignOut={signOutAction} />
}
