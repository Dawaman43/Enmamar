import { NextRequest } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

const courses = [
  {
    slug: 'web-developer-foundations',
    title: 'Web Developer Foundations',
    level: 'beginner',
    description:
      'Start building modern websites: semantic HTML, responsive CSS, JS fundamentals, and performance basics.',
    topics: [
      'Semantic HTML',
      'Responsive Layouts with CSS',
      'Accessibility Fundamentals',
      'Modern JavaScript (ES6+)',
      'Web Performance Basics',
    ],
  },
  {
    slug: 'fullstack-react-with-nextjs',
    title: 'Fullstack React with Next.js',
    level: 'intermediate',
    description:
      'Build production-grade fullstack apps with React, Next.js routing, data fetching, and testing.',
    topics: [
      'React Fundamentals',
      'State Management Patterns',
      'Next.js for Production',
      'Testing React Applications',
      'Authentication and Authorization',
    ],
  },
  {
    slug: 'backend-apis-with-node',
    title: 'Backend APIs with Node.js',
    level: 'intermediate',
    description:
      'Design and implement robust REST/GraphQL APIs with Node.js, Express, and security best practices.',
    topics: [
      'Node.js with Express',
      'REST API Design',
      'GraphQL Basics',
      'Authentication and Authorization',
      'Monitoring and Observability',
    ],
  },
  {
    slug: 'devops-and-cloud-primer',
    title: 'DevOps & Cloud Primer',
    level: 'intermediate',
    description:
      'Learn CI/CD, containers, Kubernetes, and essential cloud services to deploy and operate at scale.',
    topics: [
      'Version Control with Git',
      'Continuous Integration Pipelines',
      'Containerization with Docker',
      'Kubernetes Fundamentals',
      'AWS Core Services',
    ],
  },
]

export async function POST(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token || token !== process.env.ADMIN_TOKEN)
    return Response.json({ ok: false, error: 'Unauthorized' }, { status: 401 })

  const supabase = await createSupabaseServerClient()

  const { error: upsertCoursesError } = await supabase.from('courses').upsert(
    courses.map(({ slug, title, description, level }) => ({
      slug,
      title,
      description,
      level,
    })),
    { onConflict: 'slug' },
  )
  if (upsertCoursesError)
    return Response.json(
      { ok: false, error: upsertCoursesError.message },
      { status: 500 },
    )

  const { data: courseRows, error: courseFetchError } = await supabase
    .from('courses')
    .select('course_id,slug')
  if (courseFetchError)
    return Response.json(
      { ok: false, error: courseFetchError.message },
      { status: 500 },
    )

  const slugToCourseId = new Map<string, string>()
  for (const c of courseRows ?? []) slugToCourseId.set(c.slug, c.course_id)

  let links = [] as Array<{
    course_id: string
    topic_id: string
    order_index: number
  }>

  for (const course of courses) {
    const courseId = slugToCourseId.get(course.slug)
    if (!courseId) continue
    const titles = course.topics
    const { data: topicRows, error: topicFetchError } = await supabase
      .from('topics')
      .select('topic_id,title')
      .in('title', titles)
    if (topicFetchError)
      return Response.json(
        { ok: false, error: topicFetchError.message },
        { status: 500 },
      )
    const orderMap = new Map<string, number>()
    titles.forEach((t, i) => orderMap.set(t, i))
    for (const t of topicRows ?? []) {
      links.push({
        course_id: courseId,
        topic_id: t.topic_id,
        order_index: orderMap.get(t.title) ?? 0,
      })
    }
  }

  if (links.length) {
    const { error: linkError } = await supabase
      .from('course_topics')
      .upsert(links, { onConflict: 'course_id,topic_id' as any })
    if (linkError)
      return Response.json(
        { ok: false, error: linkError.message },
        { status: 500 },
      )
  }

  return Response.json({
    ok: true,
    courses: courses.length,
    links: links.length,
  })
}
