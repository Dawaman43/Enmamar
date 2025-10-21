'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function AiExplain({ topic }: { topic: string }) {
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState<string>('')
  const [error, setError] = useState<string>('')

  const run = async () => {
    setLoading(true)
    setError('')
    setContent('')
    try {
      const res = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ topic }),
      })
      const json = await res.json()
      if (!res.ok || !json.ok) throw new Error(json.error || 'Failed')
      setContent(String(json.content ?? ''))
    } catch (e: any) {
      setError(e?.message ?? 'Failed to get explanation')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-2">
      <Button onClick={run} disabled={loading}>
        {loading ? 'Explaining…' : 'Explain'}
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
