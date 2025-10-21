import { NextRequest } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from('courses')
    .select(
      'course_id,slug,title,description,level,course_topics(order_index,topics:topics(topic_id,title,description,difficulty))',
    )
    .eq('course_id', params.id)
    .maybeSingle()
  if (error)
    return Response.json({ ok: false, error: error.message }, { status: 500 })
  if (!data) {
    // Fallback: treat params.id as topic_id for topics(kind='course')
    const supabaseAny = supabase as any
    const tResp = await supabaseAny
      .from('topics')
      .select('topic_id,title,description,difficulty,kind')
      .eq('topic_id', params.id)
      .eq('kind', 'course')
      .maybeSingle()
    const t = tResp?.data as any
    const tErr = tResp?.error as any
    if (tErr)
      return Response.json({ ok: false, error: tErr.message }, { status: 500 })
    if (!t)
      return Response.json({ ok: false, error: 'Not found' }, { status: 404 })

    const { data: lessons, error: lErr } = await supabase
      .from('lessons')
      .select('title,slug,sort_order')
      .eq('topic_id', t.topic_id)
      .order('sort_order')
    if (lErr)
      return Response.json({ ok: false, error: lErr.message }, { status: 500 })

    const topics = (lessons ?? []).map((l: any, idx: number) => ({
      topic_id: `${t.topic_id}:${idx}`,
      title: l.title,
      description: null,
      difficulty: t.difficulty,
    }))
    return Response.json({
      ok: true,
      course: {
        course_id: t.topic_id,
        slug: slugify(t.title),
        title: t.title,
        description: t.description,
        level: t.difficulty,
        topics,
      },
    })
  }

  const { course_topics, ...rest } = data as any
  const topics = (course_topics ?? [])
    .sort((a: any, b: any) => (a.order_index ?? 0) - (b.order_index ?? 0))
    .map((ct: any) => ct.topics)
    .filter(Boolean)
  return Response.json({ ok: true, course: { ...rest, topics } })
}
