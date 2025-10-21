import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/sign-in' as any)
  // For MVP, keep server data minimal; client can fetch more if needed.
  return (
    <main className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Learning Streak</h2>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">0 days</div>
          <p className="opacity-70">
            Keep going! Come back daily to grow your streak.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Overall Progress</h2>
        </CardHeader>
        <CardContent>
          <Progress value={24} />
          <p className="mt-2 text-sm opacity-70">
            24% of selected topics completed
          </p>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <h2 className="text-lg font-semibold">What to Learn Next</h2>
        </CardHeader>
        <CardContent>
          <p className="opacity-80">
            Use AI to recommend your next topic based on history.
          </p>
          <Link
            href="/topics"
            className="underline underline-offset-4 opacity-90"
          >
            Explore Topics
          </Link>
        </CardContent>
      </Card>
    </main>
  )
}
