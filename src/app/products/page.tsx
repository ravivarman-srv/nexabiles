import type { Metadata } from 'next'
import Link from 'next/link'
import { LandingNav } from '@/components/landing/nav'
import { Footer } from '@/components/landing/footer'
import { CtaBanner } from '@/components/landing/cta-banner'
import { SITE_NAME } from '@/lib/seo/site-config'
import { InboxMock } from '@/components/landing/mock/inbox-mock'
import { PipelineMock } from '@/components/landing/mock/pipeline-mock'
import { AutomationMock } from '@/components/landing/mock/automation-mock'
import { AnalyticsMock } from '@/components/landing/mock/analytics-mock'
import { Layers, MessageSquare, Workflow, Kanban, BarChart2, Radio } from 'lucide-react'

export const metadata: Metadata = {
  title: `Products — ${SITE_NAME}`,
  description: 'Explore Nexabilis products: Shared Inbox, No-Code Automations, Sales Pipelines, Broadcast Engine, and Analytics.',
}

const PRODUCTS = [
  {
    icon: MessageSquare,
    title: 'Shared Multi-Agent Inbox',
    description: 'Empower your whole customer team to manage incoming WhatsApp conversations seamlessly without double-replying or dropping context.',
    mock: <InboxMock />,
  },
  {
    icon: Workflow,
    title: 'No-Code Automation Builder',
    description: 'Design smart multi-step automated workflows with visual triggers, delay steps, conditional logic, and custom API webhooks.',
    mock: <AutomationMock />,
  },
  {
    icon: Kanban,
    title: 'Visual Sales Pipelines',
    description: 'Track deal stages with an intuitive Kanban view, link customer chats directly to deal cards, and monitor pipeline value in real time.',
    mock: <PipelineMock />,
  },
  {
    icon: BarChart2,
    title: 'Real-Time Performance Analytics',
    description: 'Measure first-response times, daily volume, sales pipeline velocity, and team conversion rates with automated reports.',
    mock: <AnalyticsMock />,
  },
]

export default function ProductsPage() {
  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col">
      <LandingNav />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative py-24 md:py-32 border-b border-border bg-background">
          <div className="mx-auto max-w-5xl px-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-md border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground mb-8">
              Product Suite
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground leading-tight">
              Everything You Need to Automate Sales & Support
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Explore the tightly integrated suite of features engineered to transform how your company communicates, manages leads, and closes deals.
            </p>
          </div>
        </section>

        {/* Product Modules Showcase */}
        <section className="py-24 mx-auto max-w-7xl px-6 space-y-32">
          {PRODUCTS.map((prod, idx) => (
            <div
              key={prod.title}
              className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-20 ${
                idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              <div className="flex-1 space-y-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-border bg-muted/50 text-foreground">
                  <prod.icon className="h-5 w-5" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">{prod.title}</h2>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {prod.description}
                </p>
                <div className="pt-2">
                  <Link
                    href="/signup"
                    className="inline-flex items-center gap-2 rounded-md bg-foreground px-6 py-3 text-sm font-medium text-background hover:bg-foreground/90 transition-colors"
                  >
                    Try this feature live →
                  </Link>
                </div>
              </div>
              <div className="flex-1 w-full max-w-2xl rounded-xl border border-border bg-muted/20 p-2 overflow-hidden shadow-sm">
                <div className="rounded-lg border border-border bg-background shadow-sm overflow-hidden">
                  {prod.mock}
                </div>
              </div>
            </div>
          ))}
        </section>

        <CtaBanner />
      </main>
      <Footer />
    </div>
  )
}
