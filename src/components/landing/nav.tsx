"use client"

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

/**
 * Landing-page top nav. Client component because we need to flip the
 * primary CTA depending on whether the visitor is already signed in.
 * "Auth pending" renders a placeholder (a pair of muted pill shapes)
 * so the CTA doesn't pop in jarringly after hydration.
 */
type AuthState = 'pending' | 'signed-in' | 'signed-out'

const LINKS = [
  { href: '/solutions', label: 'Solutions' },
  { href: '/industries', label: 'Industries' },
  { href: '/products', label: 'Products' },
  { href: '/docs', label: 'Docs' },
  { href: '/company', label: 'Company' },
]

export function LandingNav() {
  const [auth, setAuth] = useState<AuthState>('pending')
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    // Quick auth check — no realtime needed, just the initial state.
    const supabase = createClient()
    let cancelled = false
    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return
      setAuth(data.session?.user ? 'signed-in' : 'signed-out')
    })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full border-b transition-colors',
        scrolled
          ? 'border-border bg-background backdrop-blur'
          : 'border-transparent bg-transparent',
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6">
        <Link
          href="/"
          className="flex items-center gap-2"
          aria-label="Nexabilis home"
        >
          <span className="text-xl font-bold tracking-tight text-foreground uppercase">
            NEXA<span className="text-primary">BILIS</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <NavCtas auth={auth} />
        </div>

        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground md:hidden"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-background backdrop-blur md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-border pt-3">
              <NavCtas auth={auth} mobile />
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

function NavCtas({ auth, mobile = false }: { auth: AuthState; mobile?: boolean }) {
  const btnBase =
    'inline-flex items-center gap-2 justify-center rounded-lg px-5 py-2.5 text-sm font-semibold transition-all'
  
  const secondary = cn(
    btnBase,
    'text-muted-foreground hover:text-foreground hover:bg-accent/50',
    mobile && 'justify-center',
  )
  const primary = cn(
    btnBase,
    'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20 hover:-translate-y-0.5',
    mobile && 'justify-center',
  )

  if (auth === 'pending') {
    // Neutral placeholder that matches the eventual button sizes so
    // nothing shifts once auth resolves.
    return (
      <>
        <span className={cn(btnBase, 'w-16 bg-muted text-transparent shadow-none')}>·</span>
        <span
          className={cn(btnBase, 'w-32 bg-muted text-transparent shadow-none')}
        >
          ·
        </span>
      </>
    )
  }

  if (auth === 'signed-in') {
    return (
      <Link href="/dashboard" className={primary}>
        Go to Dashboard
      </Link>
    )
  }

  return (
    <>
      <Link href="/login" className={secondary}>
        Sign In
      </Link>
      <Link href="/signup" className={primary}>
        Get Started Free
      </Link>
    </>
  )
}
