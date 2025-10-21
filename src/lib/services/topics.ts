import { createSupabaseServerClient } from '@/lib/supabase/server'
import { Topic } from '@/types/domain'

export async function getAllTopics(): Promise<Topic[]> {
  const supabase = await createSupabaseServerClient()
  const { data } = await supabase
    .from('topics')
    .select(
      'topic_id,title,description,difficulty,topic_categories(categories:categories(category_id,slug,name,description))',
    )
    .order('title')
  return (data ?? []).map((row: any) => {
    const { topic_categories, ...rest } = row
    const categories = (topic_categories ?? [])
      .map((tc: any) => tc.categories)
      .filter(Boolean)
    return { ...rest, categories }
  }) as Topic[]
}

export async function getTopicById(id: string): Promise<Topic | null> {
  const supabase = await createSupabaseServerClient()
  const { data } = await supabase
    .from('topics')
    .select(
      'topic_id,title,description,difficulty,topic_categories(categories:categories(category_id,slug,name,description))',
    )
    .eq('topic_id', id)
    .maybeSingle()
  if (!data) return null
  const { topic_categories, ...rest } = data as any
  const categories = (topic_categories ?? [])
    .map((tc: any) => tc.categories)
    .filter(Boolean)
  return { ...rest, categories }
}
