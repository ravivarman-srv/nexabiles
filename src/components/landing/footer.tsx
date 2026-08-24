import Link from 'next/link'
import { MessageSquare } from 'lucide-react'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-8 px-6 py-12 sm:grid-cols-5">
        <div className="col-span-2 sm:col-span-2">
          <Link
            href="/"
            className="flex items-center gap-2"
            aria-label="Nexabilis home"
          >
            <span className="text-xl font-bold tracking-tight text-foreground uppercase">
              NEXA<span className="bg-gradient-to-r from-blue-500 to-primary bg-clip-text text-transparent">BILIS</span>
            </span>
          </Link>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            Nexabilis transforms high-growth companies with autonomous Voice AI agents,
            automated WhatsApp sales, unified CRM architecture, and custom AI software.
          </p>
        </div>

        <FooterColumn
          title="Product"
          links={[
            { href: '/solutions', label: 'Solutions' },
            { href: '/industries', label: 'Industries' },
            { href: '/products', label: 'Products' },
            { href: '/#faq', label: 'FAQ' },
          ]}
        />

        <FooterColumn
          title="Company"
          links={[
            { href: '/company', label: 'About Us' },
            { href: '/careers', label: 'Careers' },
            { href: '/contact', label: 'Contact' },
            { href: '/docs', label: 'Documentation' },
          ]}
        />

        <FooterColumn
          title="Legal"
          links={[
            { href: '/privacy', label: 'Privacy Policy' },
            { href: '/terms', label: 'Terms of Service' },
            { href: '/security', label: 'Security' },
          ]}
        />
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-3 px-6 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <span>© {year} Nexabilis. All rights reserved.</span>
          <span>Built on the official WhatsApp Business API.</span>
        </div>
        <div className="mx-auto w-full max-w-7xl px-6 pb-5 text-xs leading-relaxed text-muted-foreground/60">
          WhatsApp® is a registered trademark of Meta Platforms, Inc.
          Nexabilis is not affiliated with, endorsed by, or sponsored by
          Meta Platforms, Inc.
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({
  title,
  links,
}: {
  title: string
  links: { href: string; label: string; external?: boolean }[]
}) {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h4>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) =>
          l.external ? (
            <li key={l.href}>
              <a
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {l.label}
              </a>
            </li>
          ) : (
            <li key={l.href}>
              <Link
                href={l.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {l.label}
              </Link>
            </li>
          ),
        )}
      </ul>
    </div>
  )
}
