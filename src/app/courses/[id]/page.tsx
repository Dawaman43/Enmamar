import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { headers } from 'next/headers'

async function getCourse(id: string) {
  const h = await headers()
  const host = h.get('x-forwarded-host') ?? h.get('host')
  const proto = h.get('x-forwarded-proto') ?? 'http'
  const base = `${proto}://${host}`
  const res = await fetch(`${base}/api/courses/${id}`, { cache: 'no-store' })
  if (!res.ok) return null
  const json = await res.json()
  return json.course
}

export default async function CourseDetail({
  params,
}: {
  params: { id: string }
}) {
  const course = await getCourse(params.id)
  if (!course) return <p className="opacity-70">Course not found.</p>
  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">{course.title}</h2>
        </CardHeader>
        <CardContent>
          <p className="opacity-80 mb-3">{course.description}</p>
          <div className="grid gap-2">
            {(course.topics ?? []).map((t: any, idx: number) => (
              <div key={t.topic_id} className="flex items-center gap-3">
                <div className="w-6 text-sm opacity-70">{idx + 1}.</div>
                <Link
                  className="underline underline-offset-4"
                  href={`/topics/${t.topic_id}`}
                >
                  {t.title}
                </Link>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
