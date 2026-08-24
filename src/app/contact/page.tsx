"use client"

import type { Metadata } from 'next'
import Link from 'next/link'
import { LandingNav } from '@/components/landing/nav'
import { Footer } from '@/components/landing/footer'
import { SITE_NAME } from '@/lib/seo/site-config'
import { Mail, Phone, MapPin, MessageSquare, Send, Sparkles, CheckCircle } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col">
      <LandingNav />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative py-24 md:py-32 border-b border-border bg-background">
          <div className="mx-auto max-w-5xl px-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-md border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground mb-8">
              Get In Touch
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground leading-tight">
              Book a Free AI Strategy Call & Demo
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Have questions about integrating Voice AI agents or WhatsApp automation into your workflow? Speak directly with our solution architects.
            </p>
          </div>
        </section>

        {/* Contact Form & Cards */}
        <section className="py-24 mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Info Cards */}
            <div className="space-y-6">
              <div className="rounded-xl border border-border bg-card p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-muted/50 text-foreground mb-4">
                  <Mail className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Email Sales & Support</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Our team typically responds within 2 business hours.</p>
                <a href="mailto:support@nexabilis.com" className="inline-block mt-4 text-sm font-medium text-foreground hover:text-primary transition-colors">
                  support@nexabilis.com
                </a>
              </div>

              <div className="rounded-xl border border-border bg-card p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-muted/50 text-foreground mb-4">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">WhatsApp Instant Help</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Test our automated WhatsApp agent live in action.</p>
                <a href="https://wa.me/" target="_blank" rel="noreferrer" className="inline-block mt-4 text-sm font-medium text-foreground hover:text-primary transition-colors">
                  Chat on WhatsApp →
                </a>
              </div>

              <div className="rounded-xl border border-border bg-card p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-muted/50 text-foreground mb-4">
                  <MapPin className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Global Headquarters</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Serving clients worldwide with 99.9% uptime SLA guarantees.</p>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2 rounded-xl border border-border bg-card p-8 md:p-12 shadow-sm">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Send Us a Message</h2>
              <p className="text-sm text-muted-foreground mb-10">Fill out the details below and we will prepare a personalized live demo for your team.</p>

              <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                    <input
                      type="text"
                      placeholder="Jane Doe"
                      className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm outline-none focus:border-foreground focus:ring-1 focus:ring-foreground transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Work Email</label>
                    <input
                      type="email"
                      placeholder="jane@company.com"
                      className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm outline-none focus:border-foreground focus:ring-1 focus:ring-foreground transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Phone / WhatsApp</label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm outline-none focus:border-foreground focus:ring-1 focus:ring-foreground transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Company Name</label>
                    <input
                      type="text"
                      placeholder="Acme Corp"
                      className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm outline-none focus:border-foreground focus:ring-1 focus:ring-foreground transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">How can we help?</label>
                  <textarea
                    rows={4}
                    placeholder="Tell us about your automation requirements or team size..."
                    className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm outline-none focus:border-foreground focus:ring-1 focus:ring-foreground transition-all resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md bg-foreground px-8 py-3 text-sm font-medium text-background shadow-sm hover:bg-foreground/90 transition-colors"
                >
                  <Send className="h-4 w-4" />
                  Request Demo & Strategy Call
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
