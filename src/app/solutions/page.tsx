import type { Metadata } from 'next'
import Link from 'next/link'
import { LandingNav } from '@/components/landing/nav'
import { Footer } from '@/components/landing/footer'
import { CtaBanner } from '@/components/landing/cta-banner'
import { SITE_NAME } from '@/lib/seo/site-config'
import { Bot, MessageSquare, Workflow, Cpu, Sparkles, ArrowRight, ShieldCheck, Zap, BarChart3 } from 'lucide-react'

export const metadata: Metadata = {
  title: `AI Solutions — ${SITE_NAME}`,
  description: 'Explore Nexabilis AI solutions: Autonomous Voice AI, WhatsApp Sales Automation, Unified CRM, and Custom AI Workflows.',
}

const SOLUTIONS = [
  {
    icon: Bot,
    title: 'Autonomous Voice AI Agents',
    description: 'Human-grade voice agents that handle inbound support calls, qualify outbound leads, and schedule appointments 24/7 without human fatigue.',
    badge: 'Popular',
    features: ['Natural conversational flow', 'Multi-language support', 'Instant CRM syncing', 'Call recording & sentiment analysis'],
  },
  {
    icon: MessageSquare,
    title: 'WhatsApp Sales Automation',
    description: 'Turn your WhatsApp channel into a high-converting automated sales machine with instant keyword triggers, auto-replies, and broadcasting.',
    badge: 'High Impact',
    features: ['Official Business API integration', 'Broadcast campaign engine', 'Interactive quick buttons', 'Automated follow-up sequences'],
  },
  {
    icon: Workflow,
    title: 'Unified CRM Architecture',
    description: 'Consolidate customer communications, team notes, contact history, and sales pipelines into a single high-performance workspace.',
    badge: 'Core Platform',
    features: ['Shared multi-agent team inbox', 'Visual Kanban sales pipelines', 'Custom tags & filtering', 'Role-based access control'],
  },
  {
    icon: Cpu,
    title: 'Enterprise AI Integrations',
    description: 'Seamlessly connect Nexabilis with your existing ERP, custom database, Supabase, or external webhook APIs for custom automated workflows.',
    badge: 'Enterprise',
    features: ['Custom webhook triggers', 'RESTful API access', 'Encrypted token security', 'High throughput processing'],
  },
]

export default function SolutionsPage() {
  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col">
      <LandingNav />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative py-24 md:py-32 overflow-hidden border-b border-border/50 bg-background">
          {/* Subtle top glow */}
          <div className="absolute top-0 left-1/2 -z-10 h-[300px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[100px] pointer-events-none" />
          
          <div className="mx-auto max-w-5xl px-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary mb-8 shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Enterprise AI Solutions
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
              Automate & Scale Your <span className="text-primary">Customer Engagement</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Nexabilis provides end-to-end AI software, automated messaging infrastructure, and Voice AI agents designed to multiply your revenue while slashing operational overhead.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all hover:-translate-y-0.5"
              >
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-7 py-3.5 text-sm font-semibold text-foreground shadow-sm hover:bg-accent hover:border-border/80 transition-all hover:-translate-y-0.5"
              >
                Book Custom Demo
              </Link>
            </div>
          </div>
        </section>

        {/* Solutions Grid */}
        <section className="py-24 mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center md:text-left md:flex md:items-end md:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">Capabilities Built for Growth</h2>
              <p className="mt-4 text-muted-foreground text-lg">Four powerful engines unified under one intelligent platform to drive sales and support.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {SOLUTIONS.map((item) => (
              <div
                key={item.title}
                className="group rounded-2xl border border-border/80 bg-card p-8 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 flex flex-col"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shadow-sm group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary border border-primary/20">
                    {item.badge}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  {item.description}
                </p>
                
                <div className="mt-auto">
                  <ul className="space-y-3 mb-8">
                    {item.features.map((feat) => (
                      <li key={feat} className="flex items-center text-sm font-medium text-foreground/80 gap-3">
                        <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-primary group-hover:translate-x-1 transition-transform"
                  >
                    Learn more <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Impact Metrics */}
        <section className="py-24 bg-gradient-to-b from-muted/30 to-background border-y border-border/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-5" />
          <div className="relative z-10 mx-auto max-w-7xl px-6 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            <div>
              <div className="text-4xl md:text-5xl font-black text-primary mb-3 tracking-tight">10x</div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Response Speed</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-black text-primary mb-3 tracking-tight">99.4%</div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Customer Satisfaction</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-black text-primary mb-3 tracking-tight">1.5M+</div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Automations Executed</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-black text-primary mb-3 tracking-tight">24/7</div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Autonomous Availability</div>
            </div>
          </div>
        </section>

        <CtaBanner />
      </main>
      <Footer />
    </div>
  )
}
