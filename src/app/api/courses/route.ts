import { createSupabaseServerClient } from '@/lib/supabase/server'

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

export async function GET() {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from('courses')
    .select(
      'course_id,slug,title,description,level,course_topics(order_index,topics:topics(topic_id,title,description,difficulty))',
    )
    .order('title')
  if (error)
    return Response.json({ ok: false, error: error.message }, { status: 500 })

  let courses = (data ?? []).map((row: any) => {
    const { course_topics, ...rest } = row
    const topics = (course_topics ?? [])
      .sort((a: any, b: any) => (a.order_index ?? 0) - (b.order_index ?? 0))
      .map((ct: any) => ct.topics)
      .filter(Boolean)
    return { ...rest, topics }
  })

  // Fallback: derive courses from topics(kind='course') + lessons
  if (!courses.length) {
    const supabaseAny = supabase as any
    // Try with kind filter first, then without if that fails (e.g., missing column)
    let tResp = await supabaseAny
      .from('topics')
      .select('topic_id,title,description,difficulty,kind')
      .eq('kind', 'course')
      .order('title')
    const kindAvailable = !tResp.error
    if (tResp.error) {
      tResp = await supabaseAny
        .from('topics')
        .select('topic_id,title,description,difficulty')
        .order('title')
    }
    const tData = (tResp?.data ?? []) as any[]

    const fallbackCourses: any[] = []
    for (const t of tData ?? []) {
      // Attempt to read lessons; if the table doesn't exist or errors, skip topic
      const lResp = await supabaseAny
        .from('lessons')
        .select('title,slug,sort_order')
        .eq('topic_id', t.topic_id)
        .order('sort_order')
      const lessons = lResp.error ? [] : ((lResp.data ?? []) as any[])
      if (!kindAvailable && lessons.length === 0) continue

      // Map lessons into Topic-like items for current UI compatibility
      const lessonAsTopics = lessons.map((l: any, idx: number) => ({
        topic_id: `${t.topic_id}:${idx}`,
        title: l.title,
        description: null,
        difficulty: t.difficulty,
      }))

      fallbackCourses.push({
        course_id: t.topic_id,
        slug: slugify(t.title),
        title: t.title,
        description: t.description,
        level: t.difficulty,
        topics: lessonAsTopics,
      })
    }
    courses = fallbackCourses
  }

  return Response.json({ ok: true, courses })
}
