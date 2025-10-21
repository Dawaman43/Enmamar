import { NextRequest } from 'next/server'
import { z } from 'zod'
import { ExplainSchema } from '@/lib/validators'
import { generateText } from '@/lib/ai/gemini'
import {
  createSupabaseServerClient,
  getAuthUserId,
} from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { topic, level } = ExplainSchema.parse(body)

    const system = `You are a helpful DSA tutor.
Explain concepts with clarity and examples. Tailor the complexity to the user level.`
    const user = `Explain the DSA topic: ${topic}. Level: ${level}. Include:
- brief overview
- key ideas
- simple example
- common pitfalls`

    const content = await generateText(system, user)

    // Log
    const supabase = await createSupabaseServerClient()
    const userId = await getAuthUserId()
    await supabase
      .from('ai_logs')
      .insert({ user_id: userId, prompt: user, response: content })

    return Response.json({ ok: true, content })
  } catch (e: any) {
    const message = e?.message ?? 'Unknown error'
    return Response.json({ ok: false, error: message }, { status: 400 })
  }
}
