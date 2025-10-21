import './globals.css'
import type { ReactNode } from 'react'
import Header from '@/components/header'

export const metadata = {
  title: 'Enmamar — Learn DSA with AI',
  description: 'Personalized learning assistant for mastering DSA',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Global header */}
        <Header />
        <main id="main" className="mx-auto max-w-6xl p-4">
          {children}
        </main>
      </body>
    </html>
  )
}
