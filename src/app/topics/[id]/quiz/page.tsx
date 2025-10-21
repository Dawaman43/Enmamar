'use client'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { generateQuiz } from '@/lib/services/quiz'
import type { QuizItem } from '@/types/domain'

export default function TopicQuizPage({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<QuizItem[] | null>(null)
  const [fallback, setFallback] = useState<string | null>(null)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [score, setScore] = useState<number | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      setLoading(true)
      const res = await generateQuiz(params.id, 5)
      if (!mounted) return
      if (res.items) setItems(res.items)
      else if (res.content) setFallback(res.content)
      setLoading(false)
    })()
    return () => {
      mounted = false
    }
  }, [params.id])

  const submit = () => {
    if (!items) return
    let correct = 0
    items.forEach((q, i) => {
      if (answers[i] === q.answer) correct += 1
    })
    const pct = Math.round((correct / items.length) * 100)
    setScore(pct)
  }

  return (
    <main className="grid gap-4">
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Quiz</h2>
        </CardHeader>
        <CardContent>
          {loading && <p className="opacity-70">Generating questions…</p>}
          {!loading && items && (
            <div className="grid gap-4">
              {items.map((q, i) => (
                <div key={i} className="grid gap-2">
                  <div className="font-medium">{q.question}</div>
                  {(['A', 'B', 'C', 'D'] as const).map((k) => (
                    <label key={k} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`q${i}`}
                        value={k}
                        checked={answers[i] === k}
                        onChange={() => setAnswers((s) => ({ ...s, [i]: k }))}
                      />
                      <span>
                        {k}. {q.options[k]}
                      </span>
                    </label>
                  ))}
                </div>
              ))}
              <Button onClick={submit}>Submit</Button>
              {score !== null && (
                <div className="text-sm opacity-90">Score: {score}%</div>
              )}
            </div>
          )}
          {!loading && !items && fallback && (
            <pre className="whitespace-pre-wrap text-sm opacity-90">
              {fallback}
            </pre>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
