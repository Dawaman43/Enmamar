'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type ServerAction =
  | ((formData: FormData) => Promise<void>)
  | (() => Promise<void>)

export interface HeaderClientProps {
  isAuthenticated: boolean
  onSignOut: ServerAction
}

function NavLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isActive =
    pathname === href || (href !== '/' && pathname?.startsWith(href))
  return (
    <Link
      href={href as any}
      className={cn(
        'text-sm transition-opacity',
        isActive ? 'text-white' : 'opacity-80 hover:opacity-100',
      )}
    >
      {children}
    </Link>
  )
}

export default function HeaderClient({
  isAuthenticated,
  onSignOut,
}: HeaderClientProps) {
  const [open, setOpen] = useState(false)

  const NavItems = (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-5">
      <NavLink href="/dashboard">Dashboard</NavLink>
      <NavLink href="/topics">Topics</NavLink>
      <NavLink href="/courses">Courses</NavLink>
      <NavLink href="/practice">Practice</NavLink>
    </div>
  )

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/30 backdrop-blur supports-[backdrop-filter]:bg-black/20">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded focus:bg-black/60 focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:py-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="font-semibold tracking-tight">
            Enmamar
          </Link>
        </div>

        {/* Desktop nav */}
        <nav className="hidden items-center justify-between gap-6 md:flex">
          {NavItems}
          <div className="ml-6 flex items-center gap-3">
            {isAuthenticated ? (
              <form action={onSignOut as any}>
                <Button variant="link" className="opacity-80 hover:opacity-100">
                  Sign out
                </Button>
              </form>
            ) : (
              <div className="flex items-center gap-3">
                <NavLink href="/sign-in">Sign in</NavLink>
                <Link href="/sign-up">
                  <Button size="sm">Get started</Button>
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile toggle */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5"
            >
              {open ? (
                <path
                  fillRule="evenodd"
                  d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 11-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                  clipRule="evenodd"
                />
              ) : (
                <path
                  fillRule="evenodd"
                  d="M3.75 5.25a.75.75 0 000 1.5h16.5a.75.75 0 000-1.5H3.75zm0 6a.75.75 0 000 1.5h16.5a.75.75 0 000-1.5H3.75zm0 6a.75.75 0 000 1.5h16.5a.75.75 0 000-1.5H3.75z"
                  clipRule="evenodd"
                />
              )}
            </svg>
          </Button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="border-t border-white/10 md:hidden">
          <div className="mx-auto max-w-6xl px-4 py-3">
            <nav className="flex flex-col gap-3">
              {NavItems}
              <div className="pt-2">
                {isAuthenticated ? (
                  <form action={onSignOut as any}>
                    <Button className="w-full" variant="outline">
                      Sign out
                    </Button>
                  </form>
                ) : (
                  <div className="flex items-center gap-3">
                    <Link href="/sign-in" className="flex-1">
                      <Button className="w-full" variant="outline">
                        Sign in
                      </Button>
                    </Link>
                    <Link href="/sign-up" className="flex-1">
                      <Button className="w-full">Get started</Button>
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
