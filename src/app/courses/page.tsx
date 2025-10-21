import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { headers } from 'next/headers'

async function getCourses() {
  const h = await headers()
  const host = h.get('x-forwarded-host') ?? h.get('host')
  const proto = h.get('x-forwarded-proto') ?? 'http'
  const base = `${proto}://${host}`
  const res = await fetch(`${base}/api/courses`, { cache: 'no-store' })
  if (!res.ok) return []
  const json = await res.json()
  return json.courses ?? []
}

export default async function CoursesPage() {
  const courses = await getCourses()
  if (courses.length === 0)
    return <p className="opacity-70">No courses yet. Seed your database.</p>
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {courses.map((c: any) => (
        <Card key={c.course_id}>
          <CardHeader>
            <h3 className="text-base font-semibold">{c.title}</h3>
          </CardHeader>
          <CardContent>
            <p className="opacity-80 mb-2">{c.description}</p>
            <Link
              className="underline underline-offset-4"
              href={`/courses/${c.course_id}` as any}
            >
              Open
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
