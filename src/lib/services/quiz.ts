import { QuizItem } from '@/types/domain'

export async function generateQuiz(
  topic: string,
  count = 5,
): Promise<{ items?: QuizItem[]; content?: string; error?: string }> {
  const res = await fetch('/api/ai/quiz', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ topic, count }),
  })
  if (!res.ok) return { error: 'Failed to generate quiz' }
  const json = await res.json()
  if (json.items) return { items: json.items as QuizItem[] }
  if (json.content) return { content: String(json.content) }
  return { error: 'No content' }
}
