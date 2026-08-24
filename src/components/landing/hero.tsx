import Link from 'next/link'
import { ShieldCheck, ArrowRight, Play } from 'lucide-react'
import { InboxMock } from './mock/inbox-mock'

/**
 * Above-the-fold hero. Two-column on desktop (copy + product visual),
 * stacks on mobile. The product miniature doubles as proof of what
 * the app actually looks like — better than a generic illustration.
 */
export function Hero() {
  return (
    <div className="relative overflow-hidden">
      {/* Soft radial glow behind the hero. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-60"
        style={{
          background:
            'radial-gradient(1000px circle at 50% -10%, var(--primary) / 0.15, transparent 60%)',
        }}
      />

      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 py-20 sm:py-28 lg:grid-cols-2 lg:gap-16">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground shadow-sm">
            <span className="font-medium text-foreground">Nexabilis 2.0 Released</span>
            <span className="text-border">|</span>
            Enterprise Voice AI & Smart CRM
            <ArrowRight className="h-3 w-3" />
          </div>

          <h1 className="mt-6 text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-6xl xl:text-7xl">
            Automate Your Business with{' '}
            <span className="bg-gradient-to-r from-blue-500 to-primary bg-clip-text text-transparent">
              Intelligent AI Solutions
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg text-muted-foreground leading-relaxed">
            Nexabilis transforms high-growth companies with autonomous Voice AI agents,
            automated WhatsApp sales, unified CRM architecture, and custom AI software
            engineered for exponential scale.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:bg-primary/90 hover:scale-[1.02]"
            >
              Book Free AI Consultation
            </Link>
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent hover:text-accent-foreground shadow-sm"
            >
              <Play className="h-4 w-4 text-primary" fill="currentColor" />
              Watch Interactive Demo
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-xs font-medium text-muted-foreground">
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              ISO 27001 & GDPR Compliant
            </span>
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              99.4% Customer Retention
            </span>
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Over 1.5M+ Automations Run
            </span>
          </div>
        </div>

        <div className="lg:justify-self-end w-full">
          <InboxMock />
        </div>
      </div>
    </div>
  )
}
