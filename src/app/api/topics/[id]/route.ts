import { NextRequest } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const supabase = await createSupabaseServerClient()
  const withJoin = await supabase
    .from('topics')
    .select(
      'topic_id,title,description,difficulty,topic_categories(categories:categories(category_id,slug,name,description))',
    )
    .eq('topic_id', params.id)
    .maybeSingle()
  if (!withJoin.error) {
    if (!withJoin.data)
      return Response.json({ ok: false, error: 'Not found' }, { status: 404 })
    const { topic_categories, ...rest } = withJoin.data as any
    const categories = (topic_categories ?? [])
      .map((tc: any) => tc.categories)
      .filter(Boolean)
    return Response.json({ ok: true, topic: { ...rest, categories } })
  }

  // Fallback: no categories join
  const plain = await supabase
    .from('topics')
    .select('topic_id,title,description,difficulty')
    .eq('topic_id', params.id)
    .maybeSingle()
  if (plain.error)
    return Response.json(
      { ok: false, error: plain.error.message },
      { status: 500 },
    )
  if (!plain.data)
    return Response.json({ ok: false, error: 'Not found' }, { status: 404 })
  return Response.json({ ok: true, topic: { ...plain.data, categories: [] } })
}
