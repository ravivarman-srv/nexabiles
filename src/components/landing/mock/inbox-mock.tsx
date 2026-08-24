import { MessageSquare, Search } from 'lucide-react'

/**
 * Miniature of the app's shared inbox. Pure CSS — no real data, no
 * supabase calls. Used in the hero and the inbox feature spotlight.
 * Kept stateless and presentational so the page renders fast.
 */
export function InboxMock() {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-border bg-background shadow-2xl">
      {/* Fake window chrome — makes the mock read as "a product", not
          an abstract component. */}
      <div className="flex items-center gap-1.5 border-b border-border bg-card px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-muted" />
        <span className="h-2.5 w-2.5 rounded-full bg-muted" />
        <span className="h-2.5 w-2.5 rounded-full bg-muted" />
        <span className="ml-3 text-[10px] text-muted-foreground">
          Inbox — CRM Template for WhatsApp
        </span>
      </div>

      <div className="grid grid-cols-[180px_1fr] lg:grid-cols-[220px_1fr]">
        {/* Conversation list */}
        <div className="border-r border-border bg-card">
          <div className="flex items-center gap-2 border-b border-border px-3 py-2">
            <Search className="h-3 w-3 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground">Search</span>
          </div>
          {[
            { name: 'Aisha', preview: 'Thanks! Received it.', unread: false, active: true },
            { name: 'Diego', preview: 'Do you ship to Brazil?', unread: true, active: false },
            { name: 'Yuki', preview: 'Price sheet attached.', unread: false, active: false },
            { name: 'Luca', preview: 'Got it, will test.', unread: false, active: false },
          ].map((c, i) => (
            <div
              key={i}
              className={`flex items-start gap-2 px-3 py-2.5 ${
                c.active ? 'border-l-2 border-primary bg-muted' : 'border-l-2 border-transparent'
              }`}
            >
              <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-medium text-primary">
                {c.name[0]}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-xs font-medium text-foreground">{c.name}</span>
                  {c.unread && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                </div>
                <p className="truncate text-[10px] text-muted-foreground">{c.preview}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Thread */}
        <div className="flex min-h-[280px] flex-col bg-background">
          <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-[10px] font-medium text-primary">
              A
            </span>
            <div>
              <div className="text-xs font-medium text-foreground">Aisha</div>
              <div className="text-[10px] text-muted-foreground">+44 7700 900123</div>
            </div>
            <div className="ml-auto inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] text-primary">
              Open
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-2 px-4 py-4">
            <div className="mr-auto max-w-[75%] rounded-2xl rounded-bl-sm bg-muted px-3 py-2 text-xs text-foreground">
              Hi! Is the kit available in large?
            </div>
            <div className="ml-auto max-w-[75%] rounded-2xl rounded-br-sm bg-primary px-3 py-2 text-xs text-primary-foreground">
              Yes — shipping today 📦
            </div>
            <div className="mr-auto max-w-[75%] rounded-2xl rounded-bl-sm bg-muted px-3 py-2 text-xs text-foreground">
              Thanks! Received it.
            </div>
          </div>

          <div className="flex items-center gap-2 border-t border-border bg-card px-4 py-2.5">
            <div className="flex h-8 flex-1 items-center rounded-lg border border-border bg-card px-3 text-[10px] text-muted-foreground">
              Type a message…
            </div>
            <button
              type="button"
              tabIndex={-1}
              aria-hidden
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"
            >
              <MessageSquare className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
