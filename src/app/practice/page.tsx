'use client'
import { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function PracticePage() {
  const [code, setCode] = useState<string>(
    `// Write JavaScript code here\nfunction solve(input){\n  // TODO\n  return input;\n}\nconsole.log(solve('hello'))`,
  )
  const [output, setOutput] = useState<string>('')
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.data?.type === 'result') setOutput(String(e.data.payload ?? ''))
      if (e.data?.type === 'error')
        setOutput('Error: ' + String(e.data.payload ?? ''))
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  const run = () => {
    const iframe = iframeRef.current
    if (!iframe) return
    const srcDoc =
      `<!doctype html><html><body><script>\n` +
      `window.onerror = (m,s,l,c,e)=>parent.postMessage({type:'error',payload:m},'*');\n` +
      `try{const log=[];const orig=console.log;console.log=(...a)=>{log.push(a.join(' '));orig(...a)};\n` +
      `${code}\n` +
      `parent.postMessage({type:'result',payload:log.join('\n')},'*');}catch(e){parent.postMessage({type:'error',payload:e.message},'*');}\n` +
      `</script></body></html>`
    iframe.srcdoc = srcDoc
  }

  return (
    <main className="grid gap-4">
      <Card>
        <CardHeader>
          <h1 className="text-lg font-semibold">Practice IDE (JavaScript)</h1>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="h-80 w-full rounded-md border border-white/10 bg-white/5 p-3 font-mono text-sm"
            />
            <div className="grid gap-2">
              <iframe
                ref={iframeRef}
                className="h-64 w-full rounded-md bg-black"
              />
              <pre className="h-32 overflow-auto rounded-md bg-white/5 p-3 text-xs">
                {output}
              </pre>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <Button onClick={run}>Run</Button>
            <a className="underline underline-offset-4" href="/topics">
              Open Topics
            </a>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
