import { Progress, ProgressStatus } from '@/types/domain'

export async function fetchMyProgress(): Promise<Progress[]> {
  const res = await fetch('/api/progress', { cache: 'no-store' })
  if (!res.ok) return []
  const json = await res.json()
  return (json.progress as Progress[]) ?? []
}

export async function upsertMyProgress(
  topic_id: string,
  status: ProgressStatus,
  score?: number,
): Promise<Progress[] | null> {
  const res = await fetch('/api/progress', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ topic_id, status, score }),
  })
  if (!res.ok) return null
  const json = await res.json()
  return (json.progress as Progress[]) ?? null
}
