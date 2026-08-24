import Link from 'next/link'
import { ArrowRight, BookOpen, Server } from 'lucide-react'
import { Section, SectionHeader } from './section'
import { GithubIcon } from './github-icon'

const REPO_URL = 'https://github.com/ArnasDon/wacrm'
const HOSTINGER_URL = 'https://www.hostinger.com/web-apps-hosting'

export function OpenSource() {
  return (
    <Section id="self-host">
      <SectionHeader
        eyebrow="Open source"
        title="Fork it, brand it, host it"
        description="This CRM template for WhatsApp is a template you can take and make your own. Grab the source on GitHub and self-host — we recommend Hostinger Managed Node.js Hosting for a zero-ops deploy."
      />

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-5 md:grid-cols-2">
        <a
          href={REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col rounded-xl border border-border bg-card p-6 transition-colors hover:border-border hover:bg-card"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-foreground">
            <GithubIcon className="h-5 w-5" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-foreground">
            Source on GitHub
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            Clone or fork the repository, tweak the code, ship your own build.
            MIT-style freedom with the full CRM underneath.
          </p>
          <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors group-hover:text-primary">
            ArnasDon/wacrm
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </a>

        <a
          href={HOSTINGER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col rounded-xl border border-primary/20 bg-card p-6 transition-colors hover:border-primary/40 hover:bg-card"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Server className="h-5 w-5" />
          </div>
          <h3 className="mt-4 flex flex-wrap items-center gap-2 text-base font-semibold text-foreground">
            Deploy on Hostinger
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
              Recommended
            </span>
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            Best fit for this template — connect your forked repo to
            Managed Node.js Hosting and your CRM is live in a few minutes. No
            servers to patch.
          </p>
          <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors group-hover:text-primary">
            Managed Node.js Hosting
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </a>
      </div>

      <div className="mx-auto mt-6 flex max-w-5xl items-center justify-center">
        <Link
          href="/docs"
          className="group inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-3 text-sm font-medium text-foreground transition-colors hover:border-border hover:bg-card hover:text-foreground"
        >
          <BookOpen className="h-4 w-4 text-primary" />
          Read the full documentation
          <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
        </Link>
      </div>
    </Section>
  )
}
