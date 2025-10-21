'use client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { ProgressStatus } from '@/types/domain'
import { fetchMyProgress, upsertMyProgress } from '@/lib/services/progress'

function label(status: ProgressStatus) {
  switch (status) {
    case 'not_started':
      return 'Not started'
    case 'in_progress':
      return 'In progress'
    case 'completed':
      return 'Completed'
  }
}

export function ProgressControls({ topicId }: { topicId: string }) {
  const [status, setStatus] = useState<ProgressStatus>('not_started')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const all = await fetchMyProgress()
      const cur = all.find((p) => p.topic_id === topicId)
      if (mounted && cur) setStatus(cur.status)
    })()
    return () => {
      mounted = false
    }
  }, [topicId])

  const set = async (s: ProgressStatus) => {
    setLoading(true)
    await upsertMyProgress(topicId, s)
    setStatus(s)
    setLoading(false)
  }

  return (
    <div className="flex items-center gap-2">
      <Badge>{label(status)}</Badge>
      <div className="ml-2 flex gap-2">
        <Button size="sm" disabled={loading} onClick={() => set('in_progress')}>
          Mark In Progress
        </Button>
        <Button size="sm" disabled={loading} onClick={() => set('completed')}>
          Mark Completed
        </Button>
      </div>
    </div>
  )
}
