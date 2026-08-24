const fs = require('fs');
const pages = ['solutions', 'industries', 'products', 'company', 'careers', 'contact'];
pages.forEach(page => {
  const content = `import type { Metadata } from 'next'
import { LandingNav } from '@/components/landing/nav'
import { Footer } from '@/components/landing/footer'
import { SITE_NAME } from '@/lib/seo/site-config'

export const metadata: Metadata = {
  title: '${page.charAt(0).toUpperCase() + page.slice(1)} — ' + SITE_NAME,
}

export default function ${page.charAt(0).toUpperCase() + page.slice(1)}Page() {
  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col">
      <LandingNav />
      <main className="flex-1 flex items-center justify-center py-20">
        <div className="text-center px-6">
          <h1 className="text-4xl font-bold tracking-tight mb-4">${page.charAt(0).toUpperCase() + page.slice(1)}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our latest updates and information regarding ${page.charAt(0).toUpperCase() + page.slice(1)}. This page is currently under construction.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
`;
  fs.writeFileSync(`src/app/${page}/page.tsx`, content, 'utf8');
});
