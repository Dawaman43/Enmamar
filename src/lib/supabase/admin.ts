import { createClient, SupabaseClient } from '@supabase/supabase-js'

let adminClient: SupabaseClient | null | undefined

export function createSupabaseAdminClient(): SupabaseClient | null {
  if (adminClient !== undefined) return adminClient

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceKey) {
    adminClient = null
    return adminClient
  }

  adminClient = createClient(supabaseUrl, serviceKey)
  return adminClient
}
