import { NextRequest } from 'next/server'
import { QuizSchema } from '@/lib/validators'
import { generateText } from '@/lib/ai/gemini'
import {
  createSupabaseServerClient,
  getAuthUserId,
} from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { topic, count } = QuizSchema.parse(body)

    const system = `You are a DSA quiz generator.
Return ${count} short multiple-choice questions in JSON array with fields: question, options (A-D), answer (A-D), explanation.`
    const user = `Topic: ${topic}. Keep questions concise and test understanding.`

    const content = await generateText(system, user)

    const supabase = await createSupabaseServerClient()
    const userId = await getAuthUserId()
    await supabase
      .from('ai_logs')
      .insert({ user_id: userId, prompt: user, response: content })

    // Best-effort parse if model returned JSON
    try {
      const parsed = JSON.parse(content)
      return Response.json({ ok: true, items: parsed })
    } catch {
      return Response.json({ ok: true, content })
    }
  } catch (e: any) {
    return Response.json(
      { ok: false, error: e?.message ?? 'Invalid request' },
      { status: 400 },
    )
  }
}
