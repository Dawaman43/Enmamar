import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from('topics')
    .select('*')
    .order('title')
  if (error)
    return Response.json({ ok: false, error: error.message }, { status: 500 })
  return Response.json({ ok: true, topics: data })
}
