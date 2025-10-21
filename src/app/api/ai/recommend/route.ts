import { NextRequest } from 'next/server'
import { RecommendSchema } from '@/lib/validators'
import { generateText } from '@/lib/ai/gemini'
import {
  createSupabaseServerClient,
  getAuthUserId,
} from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { history } = RecommendSchema.parse(body)

    const system = `You are a curriculum guide for DSA.
Based on completed topics, suggest the next 1-3 topics to learn with short rationales.`
    const user = `Completed topics: ${history.join(', ') || 'None'}
Suggest next topics and why.`

    const content = await generateText(system, user)

    const supabase = await createSupabaseServerClient()
    const userId = await getAuthUserId()
    await supabase
      .from('ai_logs')
      .insert({ user_id: userId, prompt: user, response: content })

    return Response.json({ ok: true, content })
  } catch (e: any) {
    return Response.json(
      { ok: false, error: e?.message ?? 'Invalid request' },
      { status: 400 },
    )
  }
}
