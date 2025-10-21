import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { headers } from 'next/headers'

async function getTopics() {
  const h = await headers()
  const host = h.get('x-forwarded-host') ?? h.get('host')
  const proto = h.get('x-forwarded-proto') ?? 'http'
  const base = `${proto}://${host}`
  const res = await fetch(`${base}/api/topics`, { cache: 'no-store' })
  if (!res.ok) return { topics: [], categories: [] }
  const json = await res.json()
  return {
    topics: json.topics ?? [],
    categories: json.categories ?? [],
  }
}

export default async function TopicsPage() {
  const { topics, categories } = await getTopics()

  if (topics.length === 0) {
    return <p className="opacity-70">No topics yet. Seed your database.</p>
  }

  let grouped = categories.length
    ? categories
        .map((cat: any) => ({
          category: cat,
          topics: topics.filter((topic: any) =>
            (topic.categories ?? []).some(
              (c: any) => c.category_id === cat.category_id,
            ),
          ),
        }))
        .filter((entry: any) => entry.topics.length > 0)
    : []

  const uncategorized = topics.filter(
    (topic: any) => (topic.categories ?? []).length === 0,
  )
  if (uncategorized.length) {
    grouped = [...grouped, { category: null, topics: uncategorized }]
  }

  return (
    <div className="grid gap-8">
      {grouped.map(({ category, topics: list }: any) => (
        <section
          key={category?.category_id ?? 'uncategorized'}
          className="grid gap-4"
        >
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">
              {category?.name ?? 'General Topics'}
            </h2>
            {category?.description && (
              <p className="text-sm opacity-70">{category.description}</p>
            )}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {list.map((t: any) => (
              <Card key={t.topic_id}>
                <CardHeader>
                  <h3 className="text-base font-semibold">{t.title}</h3>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="opacity-80">{t.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {(t.categories ?? []).map((cat: any) => (
                      <Badge key={cat.category_id}>{cat.name}</Badge>
                    ))}
                    {(!t.categories || t.categories.length === 0) && (
                      <Badge className="bg-white/5">General</Badge>
                    )}
                  </div>
                  <Link
                    className="inline-flex text-sm underline underline-offset-4"
                    href={`/topics/${t.topic_id}`}
                  >
                    Open
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
