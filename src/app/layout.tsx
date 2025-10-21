import './globals.css'
import type { ReactNode } from 'react'

export const metadata = {
  title: 'Enmamar — Learn DSA with AI',
  description: 'Personalized learning assistant for mastering DSA',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
