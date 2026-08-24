import type { Metadata } from 'next'
import { DocsShell } from '@/components/docs/shell'
import { listDocs } from '@/lib/docs/content'

export const metadata: Metadata = {
  title: {
    template: '%s — Nexabilis Docs',
    default: 'Nexabilis Docs',
  },
  description:
    'Setup, configuration, and deployment docs for Nexabilis.',
}

export default async function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pages = await listDocs()
  return <DocsShell pages={pages}>{children}</DocsShell>
}
