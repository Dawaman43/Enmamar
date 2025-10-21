'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

export function AiHint() {
  const [problem, setProblem] = useState('')
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState<string>('')
  const [error, setError] = useState<string>('')

  const run = async () => {
    if (!problem.trim()) return
    setLoading(true)
    setError('')
    setContent('')
    try {
      const res = await fetch('/api/ai/hint', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ problem }),
      })
      const json = await res.json()
      if (!res.ok || !json.ok) throw new Error(json.error || 'Failed')
      setContent(String(json.content ?? ''))
    } catch (e: any) {
      setError(e?.message ?? 'Failed to get hint')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-2">
      <Textarea
        value={problem}
        onChange={(e) => setProblem(e.target.value)}
        placeholder="Describe your problem"
      />
      <Button onClick={run} disabled={loading || !problem.trim()}>
        {loading ? 'Thinking…' : 'Get hint'}
      </Button>
      {error && <div className="text-sm text-red-500">{error}</div>}
      {content && (
        <div className="rounded-md border border-white/10 bg-white/5 p-3 text-sm whitespace-pre-wrap">
          {content}
        </div>
      )}
    </div>
  )
}
