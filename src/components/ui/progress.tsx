export function Progress({ value }: { value: number }) {
  return (
    <div className="h-2 w-full rounded bg-white/10">
      <div
        className="h-2 rounded bg-white/70"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  )
}
