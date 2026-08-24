import type { Metadata } from 'next'
import Link from 'next/link'
import { LandingNav } from '@/components/landing/nav'
import { Footer } from '@/components/landing/footer'
import { CtaBanner } from '@/components/landing/cta-banner'
import { SITE_NAME } from '@/lib/seo/site-config'
import { Briefcase, ArrowRight, MapPin, Clock, Sparkles, Shield, Heart, Laptop } from 'lucide-react'

export const metadata: Metadata = {
  title: `Careers — ${SITE_NAME}`,
  description: 'Join the Nexabilis team. Explore open roles in AI engineering, product design, and customer growth.',
}

const ROLES = [
  {
    title: 'Senior AI / LLM Engineer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
  },
  {
    title: 'Full-Stack Next.js Developer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
  },
  {
    title: 'Enterprise AI Solutions Architect',
    department: 'Customer Success',
    location: 'Remote / Hybrid',
    type: 'Full-time',
  },
  {
    title: 'Growth & Product Marketing Lead',
    department: 'Marketing',
    location: 'Remote',
    type: 'Full-time',
  },
]

const PERKS = [
  {
    icon: Laptop,
    title: '100% Remote-First',
    description: 'Work from anywhere in the world with flexible hours designed around output, not clock-watching.',
  },
  {
    icon: Sparkles,
    title: 'Cutting-Edge AI Tech Stack',
    description: 'Build with Next.js 16, Supabase, Meta Cloud APIs, and real-time Voice AI models.',
  },
  {
    icon: Heart,
    title: 'Comprehensive Health & Care',
    description: 'Full medical, dental, and wellness coverage for you and your dependents.',
  },
  {
    icon: Shield,
    title: 'Equity & Growth',
    description: 'Competitive compensation packages with early-stage stock options and annual learning stipends.',
  },
]

export default function CareersPage() {
  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col">
      <LandingNav />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative py-24 md:py-32 border-b border-border bg-background">
          <div className="mx-auto max-w-5xl px-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-md border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground mb-8">
              Join Our Team
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground leading-tight">
              Build the Autonomous AI Future With Us
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              We are a team of engineers, designers, and builders passionate about creating human-grade AI agents and modern CRM software.
            </p>
          </div>
        </section>

        {/* Perks */}
        <section className="py-24 mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Why Work at Nexabilis?</h2>
            <p className="mt-4 text-muted-foreground text-lg">We take care of our team so they can build exceptional products.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PERKS.map((perk) => (
              <div key={perk.title} className="group rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-muted/50 text-foreground mb-5">
                  <perk.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{perk.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{perk.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Open Roles */}
        <section className="py-24 mx-auto max-w-5xl px-6 border-t border-border">
          <div className="mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Open Opportunities</h2>
          </div>

          <div className="space-y-4">
            {ROLES.map((role) => (
              <div
                key={role.title}
                className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{role.title}</h3>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5"><Briefcase className="h-4 w-4" /> {role.department}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {role.location}</span>
                    <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {role.type}</span>
                  </div>
                </div>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-md bg-foreground px-5 py-2.5 text-sm font-medium text-background hover:bg-foreground/90 transition-colors"
                >
                  Apply Now
                  <ArrowRight className="h-4 w-4" />
                </Link>
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
