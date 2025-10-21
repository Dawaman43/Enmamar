export default function HomePage() {
  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-4xl font-bold">Enmamar</h1>
      <p className="opacity-80 max-w-xl">
        Personalized learning assistant for mastering Data Structures &
        Algorithms — powered by Next.js, Supabase, and Gemini.
      </p>
      <div className="flex gap-4">
        <a className="underline underline-offset-4" href="/dashboard">
          Go to Dashboard
        </a>
        <a className="underline underline-offset-4" href="/topics">
          Browse Topics
        </a>
      </div>
    </main>
  )
}
