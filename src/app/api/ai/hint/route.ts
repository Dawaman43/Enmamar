import { NextRequest } from 'next/server'
import { HintSchema } from '@/lib/validators'
import { generateText } from '@/lib/ai/gemini'
import {
  createSupabaseServerClient,
  getAuthUserId,
} from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { problem, context } = HintSchema.parse(body)

    const system = `You are an assistant that provides helpful hints for DSA problems.
Give a logical hint that nudges the learner without revealing the full solution.`
    const user = `Problem: ${problem}
Context: ${context ?? 'N/A'}
Provide 1-2 hints, not the full solution.`

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
