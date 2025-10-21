import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createSupabaseServerClient()
  // Try selecting with categories join; if it fails (e.g., tables not present), fall back to plain topics
  const withJoin = await supabase
    .from('topics')
    .select(
      'topic_id,title,description,difficulty,topic_categories(categories:categories(category_id,slug,name,description))',
    )
    .order('title')

  if (!withJoin.error) {
    const topics = (withJoin.data ?? []).map((row: any) => {
      const { topic_categories, ...rest } = row
      const categories = (topic_categories ?? [])
        .map((tc: any) => tc.categories)
        .filter(Boolean)
      return { ...rest, categories }
    })

    const categoriesMap = new Map<string, any>()
    topics.forEach((topic: any) => {
      ;(topic.categories ?? []).forEach((cat: any) => {
        categoriesMap.set(cat.category_id, cat)
      })
    })

    return Response.json({
      ok: true,
      topics,
      categories: Array.from(categoriesMap.values()),
    })
  }

  // Fallback: just return topics without categories
  const plain = await supabase
    .from('topics')
    .select('topic_id,title,description,difficulty')
    .order('title')
  if (plain.error)
    return Response.json(
      { ok: false, error: plain.error.message },
      { status: 500 },
    )
  return Response.json({ ok: true, topics: plain.data ?? [], categories: [] })
}
