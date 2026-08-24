import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Section } from './section'

/**
 * Last push before the footer. Visually distinct (border, gradient
 * background) so it doesn't read as "just another section".
 */
export function CtaBanner() {
  return (
    <Section className="py-16 sm:py-20">
      <div
        className="relative overflow-hidden rounded-2xl border border-primary/20 bg-muted px-6 py-16 text-center shadow-sm sm:px-12 sm:py-20"
        style={{
          background:
            'radial-gradient(800px circle at 50% -40%, var(--primary) / 0.18, transparent 60%)',
        }}
      >
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Ready to stop switching between tools?
        </h2>
        <p className="mt-4 text-base text-muted-foreground">
          Bring your WhatsApp conversations, contacts, and deals into one place.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 shadow-sm"
          >
            Get started free
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-accent hover:text-accent-foreground shadow-sm"
          >
            Sign in
          </Link>
        </div>
      </div>
    </Section>
  )
}
