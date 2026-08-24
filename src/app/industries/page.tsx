import type { Metadata } from 'next'
import Link from 'next/link'
import { LandingNav } from '@/components/landing/nav'
import { Footer } from '@/components/landing/footer'
import { CtaBanner } from '@/components/landing/cta-banner'
import { SITE_NAME } from '@/lib/seo/site-config'
import { ShoppingCart, Building2, Stethoscope, Landmark, GraduationCap, Laptop, ArrowRight, CheckCircle2 } from 'lucide-react'

export const metadata: Metadata = {
  title: `Industries — ${SITE_NAME}`,
  description: 'See how Nexabilis empowers E-commerce, Real Estate, Healthcare, Finance, Education, and SaaS companies.',
}

const INDUSTRIES = [
  {
    icon: ShoppingCart,
    title: 'E-commerce & Retail',
    description: 'Recover abandoned carts, send automated dispatch alerts, and handle customer exchanges natively over WhatsApp.',
    highlights: ['Cart abandonment flows', 'Order status lookup', 'Personalized broadcast deals'],
  },
  {
    icon: Building2,
    title: 'Real Estate & Property',
    description: 'Qualify buyer intent instantly, book site visits autonomously via Voice AI, and nurture high-value property deals.',
    highlights: ['Lead intent scoring', 'Automated calendar booking', 'Multi-channel inquiry triage'],
  },
  {
    icon: Stethoscope,
    title: 'Healthcare & Clinics',
    description: 'Reduce no-shows with automated appointment reminders and allow patients to reschedule via simple WhatsApp replies.',
    highlights: ['HIPAA/GDPR compliant patterns', 'Appointment confirmations', 'Patient intake workflows'],
  },
  {
    icon: Landmark,
    title: 'Financial & Insurance',
    description: 'Automate policy renewals, deliver instant quotes, and route claim inquiries securely to specialized advisory teams.',
    highlights: ['Automated renewal notices', 'Secure document collection', 'Instant loan eligibility triage'],
  },
  {
    icon: GraduationCap,
    title: 'Education & EdTech',
    description: 'Streamline admissions inquiries, send automated webinar alerts, and keep enrolled students updated on schedules.',
    highlights: ['Admissions Q&A automation', 'Fee payment notifications', 'Course reminder broadcasts'],
  },
  {
    icon: Laptop,
    title: 'SaaS & B2B Tech',
    description: 'Accelerate product-led growth by scheduling demos automatically and qualifying trial signups instantly.',
    highlights: ['Interactive demo booking', 'Trial onboarding sequences', 'Customer success routing'],
  },
]

export default function IndustriesPage() {
  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col">
      <LandingNav />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative py-24 md:py-32 overflow-hidden border-b border-border/50 bg-background">
          <div className="absolute top-0 left-1/2 -z-10 h-[300px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[100px] pointer-events-none" />
          
          <div className="mx-auto max-w-5xl px-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary mb-8 shadow-sm">
              Industry Solutions
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
              Built for Your Industry’s <span className="text-primary">Unique Workflow Needs</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Discover how leading companies in your vertical leverage Nexabilis to automate sales conversations, slash response times, and optimize retention.
            </p>
          </div>
        </section>

        {/* Industry Grid */}
        <section className="py-24 mx-auto max-w-7xl px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-5 pointer-events-none" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
            {INDUSTRIES.map((ind) => (
              <div
                key={ind.title}
                className="group rounded-2xl border border-border/80 bg-card p-8 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 flex flex-col"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shadow-sm mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  <ind.icon className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">{ind.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-8">
                  {ind.description}
                </p>
                <div className="mt-auto space-y-3">
                  {ind.highlights.map((hl) => (
                    <div key={hl} className="flex items-center text-sm font-medium text-foreground/80 gap-3">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
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
