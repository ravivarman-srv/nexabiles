import type { Metadata } from 'next'
import Link from 'next/link'
import { LandingNav } from '@/components/landing/nav'
import { Footer } from '@/components/landing/footer'
import { CtaBanner } from '@/components/landing/cta-banner'
import { SITE_NAME } from '@/lib/seo/site-config'
import { Target, Users, Shield, Zap, Sparkles, HeartHandshake, Globe } from 'lucide-react'

export const metadata: Metadata = {
  title: `Company — ${SITE_NAME}`,
  description: 'Learn about Nexabilis mission, values, and vision for autonomous AI sales & customer management.',
}

const VALUES = [
  {
    icon: Target,
    title: 'Customer First Architecture',
    description: 'Every feature we design stems from solving real sales velocity and support latency issues faced by growing businesses.',
  },
  {
    icon: Zap,
    title: 'Autonomous Innovation',
    description: 'We build intelligent AI agents that execute complex workflows independently, freeing humans to focus on relationships.',
  },
  {
    icon: Shield,
    title: 'Uncompromising Security',
    description: 'Bank-grade encryption for access tokens, strict data privacy controls, and full GDPR compliance baked into our core.',
  },
  {
    icon: Globe,
    title: 'Global Accessibility',
    description: 'Empowering businesses across North America, Europe, Asia, and Latin America to communicate seamlessly in any language.',
  },
]

export default function CompanyPage() {
  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col">
      <LandingNav />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative py-24 md:py-32 border-b border-border bg-background">
          <div className="mx-auto max-w-5xl px-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-md border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground mb-8">
              About Nexabilis
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground leading-tight">
              Reimagining Business Communication with Autonomous AI
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Nexabilis was founded on a simple premise: high-growth businesses shouldn’t lose revenue or leads simply because human teams can’t respond instantaneously 24/7.
            </p>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="py-24 mx-auto max-w-4xl px-6">
          <div className="text-center">
            <Sparkles className="h-8 w-8 text-muted-foreground mx-auto mb-8" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight text-foreground leading-snug">
              "Our mission is to empower every enterprise with autonomous Voice AI and automated messaging that turns every lead into a loyal customer."
            </h2>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-24 mx-auto max-w-7xl px-6 border-t border-border bg-muted/20">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Our Core Principles</h2>
            <p className="mt-4 text-muted-foreground text-lg">What guides our team, product, and platform engineering.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {VALUES.map((val) => (
              <div key={val.title} className="group rounded-xl border border-border bg-card p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-border bg-muted/50 text-foreground mb-6">
                  <val.icon className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{val.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{val.description}</p>
              </div>
            ))}
          </div>
        </section>

        <CtaBanner />
      </main>
      <Footer />
    </div>
  )
}
