import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { headers } from 'next/headers'
import { ProgressControls } from '@/components/progress-controls'
import { AiExplain } from '@/components/ai-explain'
import { AiHint } from '@/components/ai-hint'
import { Badge } from '@/components/ui/badge'

async function getTopic(id: string) {
  const h = await headers()
  const host = h.get('x-forwarded-host') ?? h.get('host')
  const proto = h.get('x-forwarded-proto') ?? 'http'
  const base = `${proto}://${host}`
  const res = await fetch(`${base}/api/topics/${id}`, { cache: 'no-store' })
  if (!res.ok) return null
  const json = await res.json()
  return json.topic as {
    title: string
    description?: string
    difficulty?: string
    categories?: Array<{ name: string; category_id: string }>
  }
}

export default async function TopicDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const topic = await getTopic(params.id)

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">{topic?.title ?? 'Topic'}</h2>
            <ProgressControls topicId={params.id} />
          </div>
        </CardHeader>
        <CardContent>
          {topic?.categories && topic.categories.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {topic.categories.map((cat) => (
                <Badge key={cat.category_id}>{cat.name}</Badge>
              ))}
            </div>
          )}
          <p className="opacity-80 mb-3">
            {topic?.description ??
              'Use the Explain button below to generate an explanation.'}
          </p>
          <div className="flex items-start gap-4">
            <AiExplain topic={topic?.title ?? params.id} />
            <a
              className="underline underline-offset-4"
              href={`/topics/${params.id}/quiz`}
            >
              Start Quiz
            </a>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="font-semibold">Ask for a hint</h3>
        </CardHeader>
        <CardContent>
          <AiHint />
        </CardContent>
      </Card>
    </div>
  )
}
