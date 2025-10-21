import { NextRequest } from 'next/server'
import {
  createSupabaseServerClient,
  getAuthUserId,
} from '@/lib/supabase/server'
import { ProgressUpsertSchema } from '@/lib/validators'

export async function GET() {
  const supabase = await createSupabaseServerClient()
  const userId = await getAuthUserId()
  if (!userId) return Response.json({ ok: true, progress: [] })
  const { data, error } = await supabase
    .from('progress')
    .select('*')
    .eq('user_id', userId)
  if (error)
    return Response.json({ ok: false, error: error.message }, { status: 500 })
  return Response.json({ ok: true, progress: data })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const payload = ProgressUpsertSchema.parse(body)
    const supabase = await createSupabaseServerClient()
    const userId = await getAuthUserId()
    if (!userId)
      return Response.json(
        { ok: false, error: 'Unauthorized' },
        { status: 401 },
      )

    const { data, error } = await supabase
      .from('progress')
      .upsert({ user_id: userId, ...payload })
      .select('*')
    if (error)
      return Response.json({ ok: false, error: error.message }, { status: 500 })
    return Response.json({ ok: true, progress: data })
  } catch (e: any) {
    return Response.json(
      { ok: false, error: e?.message ?? 'Invalid request' },
      { status: 400 },
    )
  }
}
