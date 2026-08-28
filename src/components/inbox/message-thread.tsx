'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import type {
  Conversation,
  Message,
  Contact,
  ConversationStatus,
} from '@/types';
import {
  MessageSquare,
  MessageSquarePlus,
  ChevronDown,
  UserPlus,
  Clock,
  ArrowLeft,
  PanelRight,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { format, isToday, isYesterday, differenceInHours } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageBubble } from './message-bubble';
import { MessageComposer } from './message-composer';
import { SendTemplateModal } from './send-template-modal';
import { toast } from 'sonner';

interface MessageThreadProps {
  conversation: Conversation | null;
  contact: Contact | null;
  messages: Message[];
  onMessagesLoaded: (messages: Message[]) => void;
  onNewMessage: (message: Message) => void;
  onUpdateMessage: (id: string, updates: Partial<Message>) => void;
  onDeleteMessage?: (id: string) => void;
  onStatusChange: (conversationId: string, status: ConversationStatus) => void;
  /**
   * On mobile, the thread is shown full-screen with the conversation list
   * hidden. This callback lets the page deselect the active conversation
   * and reveal the list again. Rendered as a back-arrow in the header on
   * mobile only.
   */
  onBack?: () => void;
  showContactSidebar?: boolean;
  onToggleContactSidebar?: () => void;
}

function formatDateSeparator(dateStr: string): string {
  const date = new Date(dateStr);
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'MMMM d, yyyy');
}

function groupMessagesByDate(messages: Message[]) {
  const groups: { date: string; messages: Message[] }[] = [];
  let currentDate = '';

  for (const msg of messages) {
    const day = format(new Date(msg.created_at), 'yyyy-MM-dd');
    if (day !== currentDate) {
      currentDate = day;
      groups.push({ date: msg.created_at, messages: [msg] });
    } else {
      groups[groups.length - 1].messages.push(msg);
    }
  }

  return groups;
}

const STATUS_OPTIONS: {
  label: string;
  value: ConversationStatus;
  color: string;
}[] = [
  { label: 'Open', value: 'open', color: 'text-primary' },
  { label: 'Pending', value: 'pending', color: 'text-amber-400' },
  { label: 'Closed', value: 'closed', color: 'text-muted-foreground' },
];

export function MessageThread({
  conversation,
  contact,
  messages,
  onMessagesLoaded,
  onNewMessage,
  onUpdateMessage,
  onDeleteMessage,
  onStatusChange,
  onBack,
  showContactSidebar,
  onToggleContactSidebar,
}: MessageThreadProps) {
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);

  // 24-hour session timer
  const sessionInfo = useMemo(() => {
    if (!messages.length) return { expired: false, remaining: '' };

    // Find last customer message
    const lastCustomerMsg = [...messages]
      .reverse()
      .find((m) => m.sender_type === 'customer');

    if (!lastCustomerMsg)
      return { expired: true, remaining: 'No customer messages' };

    const hoursSince = differenceInHours(
      new Date(),
      new Date(lastCustomerMsg.created_at)
    );
    const expired = hoursSince >= 24;

    if (expired) {
      return { expired: true, remaining: 'Expired' };
    }

    const hoursLeft = 24 - hoursSince;
    const remaining =
      hoursLeft >= 1
        ? `${Math.floor(hoursLeft)}h remaining`
        : `${Math.floor(hoursLeft * 60)}m remaining`;

    return { expired, remaining };
  }, [messages]);

  // Store latest callback in a ref so fetchMessages doesn't need to
  // depend on `onMessagesLoaded` — otherwise parent re-renders cause
  // fetchMessages to change → useEffect re-fires → refetch → realtime
  // UPDATE on conversations.unread_count → parent re-renders → LOOP.
  // The ref is written inside an effect so the mutation doesn't happen
  // during render (React 19 refs rule); consumers only read `.current`
  // inside the async fetch completion, which runs after the render.
  const onMessagesLoadedRef = useRef(onMessagesLoaded);
  useEffect(() => {
    onMessagesLoadedRef.current = onMessagesLoaded;
  });

  const conversationId = conversation?.id;
  const hasUnread = (conversation?.unread_count ?? 0) > 0;

  // Fetch messages whenever the selected conversation changes. Kept
  // separate from the unread-reset effect so that incoming messages
  // arriving while the thread is open don't trigger a full refetch —
  // they only flip hasUnread, which only the reset effect listens to.
  useEffect(() => {
    if (!conversationId) return;

    const supabase = createClient();
    let cancelled = false;

    (async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (cancelled) return;

      if (error) {
        console.error('Failed to fetch messages:', error);
      } else {
        onMessagesLoadedRef.current(data ?? []);
      }

      if (!cancelled) setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [conversationId]);

  // Reset the server-side unread_count to 0 whenever an unread count
  // surfaces on the active conversation — covers both (a) opening a
  // conversation that had unread messages and (b) new messages arriving
  // while the user is already viewing the thread (webhook server-bumps
  // unread_count to N+1; the realtime UPDATE propagates it into the
  // client, which re-runs this effect and flips it back to 0).
  //
  // Guarding on hasUnread prevents the eq-update loop: once unread_count
  // is 0 the condition is false, so no further UPDATE is issued.
  useEffect(() => {
    if (!conversationId || !hasUnread) return;
    const supabase = createClient();
    supabase
      .from('conversations')
      .update({ unread_count: 0 })
      .eq('id', conversationId)
      .then(({ error }) => {
        if (error) console.error('Failed to reset unread_count:', error);
      });
  }, [conversationId, hasUnread]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      const el = scrollRef.current;
      el.scrollTop = el.scrollHeight;
    }
  }, [messages]);

  const [replyText, setReplyText] = useState<string | null>(null);

  const handleReply = useCallback((text: string) => {
    setReplyText(text);
  }, []);

  const handleResend = useCallback(
    async (msg: Message) => {
      if (!conversation) return;

      // Capture what we need BEFORE removing the failed bubble
      const textToSend = msg.content_text ?? '';
      const replyToText = msg.reply_to_text;

      // Step 1: Remove the failed message from local state immediately
      onDeleteMessage?.(msg.id);

      // Step 2: Also delete from DB if it was persisted (temp IDs start with "temp-")
      if (!msg.id.startsWith('temp-')) {
        const supabase = createClient();
        await supabase.from('messages').delete().eq('id', msg.id);
      }

      // Step 3: Re-send from scratch — creates a fresh optimistic bubble + new DB row
      const tempId = `temp-${Date.now()}`;
      const optimisticMsg: Message = {
        id: tempId,
        conversation_id: conversation.id,
        sender_type: 'agent',
        content_type: msg.content_type,
        content_text: textToSend,
        status: 'sending',
        reply_to_text: replyToText,
        created_at: new Date().toISOString(),
      };
      onNewMessage(optimisticMsg);

      try {
        const res = await fetch('/api/whatsapp/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            conversation_id: conversation.id,
            message_type: msg.content_type,
            content_text: textToSend,
            reply_to_text: replyToText,
          }),
        });

        const payload = await res.json().catch(() => ({}));

        if (!res.ok) {
          const reason = payload?.error || `HTTP ${res.status}`;
          toast.error(`Resend failed: ${reason}`);
          onUpdateMessage(tempId, { status: 'failed' });
        } else {
          // Realtime will replace temp bubble; flip status immediately as fallback
          onUpdateMessage(tempId, { status: 'sent' });
        }
      } catch (err) {
        const reason = err instanceof Error ? err.message : 'network error';
        toast.error(`Resend failed: ${reason}`);
        onUpdateMessage(tempId, { status: 'failed' });
      }
    },
    [conversation, onDeleteMessage, onNewMessage, onUpdateMessage]
  );

  const handleAddToNotes = useCallback(
    async (text: string) => {
      if (!contact) return;
      
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;

      const { error } = await supabase.from('contact_notes').insert({
        contact_id: contact.id,
        user_id: user?.id,
        note_text: text,
      });

      if (error) {
        console.error('Failed to add note:', error);
        toast.error('Failed to add note');
      } else {
        toast.success('Message added to notes');
      }
    },
    [contact]
  );

  const handleDelete = useCallback(
    (id: string) => {
      setMessageToDelete(id);
    },
    []
  );

  const confirmDeleteForMe = useCallback(async () => {
    if (!messageToDelete) return;
    const id = messageToDelete;
    setMessageToDelete(null);

    // Optimistic UI removal
    onDeleteMessage?.(id);

    const supabase = createClient();
    const { error } = await supabase.from('messages').delete().eq('id', id);

    if (error) {
      console.error('Failed to delete message:', error);
      toast.error('Failed to delete message');
    } else {
      toast.success('Message deleted from CRM');
    }
  }, [messageToDelete, onDeleteMessage]);

  const confirmDeleteForEveryone = useCallback(async () => {
    if (!messageToDelete) return;
    const id = messageToDelete;
    setMessageToDelete(null);

    // Optimistic UI update
    onUpdateMessage?.(id, { content_text: '🚫 You deleted this message', media_url: undefined });

    const supabase = createClient();
    const { error } = await supabase
      .from('messages')
      .update({ content_text: '🚫 You deleted this message', media_url: null })
      .eq('id', id);

    if (error) {
      console.error('Failed to update message:', error);
      toast.error('Failed to delete message');
    } else {
      toast.success('Message deleted (Note: Meta API does not remove it from customer device)');
    }
  }, [messageToDelete, onUpdateMessage]);

  const handleSend = useCallback(
    async (text: string) => {
      if (!conversation) return;

      const tempId = `temp-${Date.now()}`;

      // Optimistic update — shows the message immediately with "sending" status
      const optimisticMsg: Message = {
        id: tempId,
        conversation_id: conversation.id,
        sender_type: 'agent',
        content_type: 'text',
        content_text: text,
        status: 'sending',
        reply_to_text: replyText ?? undefined,
        created_at: new Date().toISOString(),
      };
      onNewMessage(optimisticMsg);

      try {
        const res = await fetch('/api/whatsapp/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            conversation_id: conversation.id,
            message_type: 'text',
            content_text: text,
            reply_to_text: replyText ?? undefined,
          }),
        });

        const payload = await res.json().catch(() => ({}));

        if (!res.ok) {
          const reason = payload?.error || `HTTP ${res.status}`;
          console.error('Failed to send message:', reason);

          fetch('/api/logs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              level: 'error',
              source: 'message_thread',
              message: `HTTP Error: ${reason}`,
              context: {
                status: res.status,
                payload,
                conversationId: conversation.id,
              },
            }),
          }).catch(console.error);

          toast.error(`Failed to send: ${reason}`);
          // Mark the optimistic bubble as failed so the user sees what happened
          onUpdateMessage(tempId, { status: 'failed' });
          return;
        }

        // Success — the realtime INSERT event will replace the temp bubble
        // with the real DB row. If realtime hasn't arrived yet, at least
        // flip status to 'sent' so the UI stops showing "sending".
        onUpdateMessage(tempId, { status: 'sent' });
      } catch (err) {
        console.error('Failed to send message:', err);
        const reason = err instanceof Error ? err.message : 'network error';

        fetch('/api/logs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            level: 'error',
            source: 'message_thread',
            message: reason,
            context: {
              error: err instanceof Error ? err.stack : String(err),
              conversationId: conversation.id,
            },
          }),
        }).catch(console.error);

        toast.error(`Failed to send: ${reason}`);
        onUpdateMessage(tempId, { status: 'failed' });
      }
    },
    [conversation, onNewMessage, onUpdateMessage]
  );

  const handleStatusChange = useCallback(
    async (status: ConversationStatus) => {
      if (!conversation) return;

      const supabase = createClient();
      await supabase
        .from('conversations')
        .update({ status })
        .eq('id', conversation.id);

      onStatusChange(conversation.id, status);
    },
    [conversation, onStatusChange]
  );

  const handleOpenTemplates = useCallback(() => {
    setTemplateModalOpen(true);
    // Template modal implementation would go here
  }, []);

  // Empty state
  if (!conversation || !contact) {
    return (
      <div className="bg-background flex flex-1 flex-col items-center justify-center p-6">
        <div className="bg-muted flex h-16 w-16 items-center justify-center rounded-full">
          <MessageSquare className="text-muted-foreground h-8 w-8" />
        </div>
        <h3 className="text-foreground mt-4 text-sm font-medium">
          No conversation selected
        </h3>
        <p className="text-muted-foreground mt-1 max-w-sm text-center text-sm">
          Choose an existing conversation from the list, or start a new one from
          your contacts.
        </p>
        <Button
          asChild
          className="bg-primary hover:bg-primary/90 text-primary-foreground mt-6"
        >
          <Link href="/contacts">
            <MessageSquarePlus className="mr-2 size-4" />
            New Conversation
          </Link>
        </Button>
      </div>
    );
  }

  const displayName = contact.name || contact.phone;
  const messageGroups = groupMessagesByDate(messages);
  const currentStatus = STATUS_OPTIONS.find(
    (s) => s.value === conversation.status
  );

  return (
    <div className="bg-background flex flex-1 flex-col">
      {/* Header */}
      <div className="border-border flex items-center justify-between gap-2 border-b bg-[#f0f2f5] px-3 py-3 sm:px-4 dark:bg-[#202c33]">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          {/* Back-to-list button — mobile only. Hidden on lg+ where the
              conversation list is always visible next to the thread. */}
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              aria-label="Back to conversations"
              className="text-muted-foreground hover:bg-muted hover:text-foreground flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md lg:hidden"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <div className="bg-muted text-foreground flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-sm font-medium">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h2 className="text-foreground truncate text-sm font-semibold">
              {displayName}
            </h2>
            <p className="text-muted-foreground truncate text-xs">
              {contact.phone}
            </p>
          </div>
          {/* Session timer badge — hidden on the narrowest phones so
              the name + back arrow keep their room. */}
          <Badge
            variant="outline"
            className={cn(
              'border-border ml-1 hidden gap-1 text-[10px] sm:ml-2 sm:inline-flex',
              sessionInfo.expired ? 'text-red-400' : 'text-primary'
            )}
          >
            <Clock className="h-3 w-3" />
            {sessionInfo.remaining}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          {/* Status dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                'hover:bg-muted inline-flex h-7 items-center justify-center gap-1 rounded-md px-2 text-xs',
                currentStatus?.color ?? 'text-muted-foreground'
              )}
            >
              {currentStatus?.label ?? 'Status'}
              <ChevronDown className="h-3 w-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="border-border bg-muted">
              {STATUS_OPTIONS.map((opt) => (
                <DropdownMenuItem
                  key={opt.value}
                  onClick={() => handleStatusChange(opt.value)}
                  className={cn('text-sm', opt.color)}
                >
                  {opt.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Assign button */}
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground h-7 gap-1 text-xs"
          >
            <UserPlus className="h-3 w-3" />
            Assign
          </Button>

          {/* Contact Details Toggle */}
          {onToggleContactSidebar && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onToggleContactSidebar}
              className={cn(
                'text-muted-foreground hover:text-foreground hidden h-7 w-7 lg:flex',
                showContactSidebar && 'bg-muted text-foreground'
              )}
              title={showContactSidebar ? 'Hide details' : 'Show details'}
            >
              <PanelRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div
        ref={scrollRef}
        className="relative flex-1 overflow-y-auto bg-[#efeae2] px-4 py-4 dark:bg-[#0b141a]"
      >
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="border-primary h-5 w-5 animate-spin rounded-full border-2 border-t-transparent" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground text-sm">No messages yet</p>
            <p className="text-muted-foreground text-xs">
              Send a template to start the conversation
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messageGroups.map((group) => (
              <div key={group.date}>
                {/* Date separator */}
                <div className="mb-4 flex items-center justify-center">
                  <span className="rounded-lg bg-white/90 px-3 py-1.5 text-[12.5px] font-medium text-[#54656f] uppercase shadow-sm dark:bg-[#182229] dark:text-[#8696a0]">
                    {formatDateSeparator(group.date)}
                  </span>
                </div>
                {/* Messages */}
                <div className="space-y-2">
                  {group.messages.map((msg) => (
                    <MessageBubble key={msg.id} message={msg} onDelete={handleDelete} onAddToNotes={handleAddToNotes} onReply={handleReply} onResend={handleResend} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Composer */}
      <MessageComposer
        conversationId={conversation.id}
        sessionExpired={sessionInfo.expired}
        onSend={handleSend}
        onOpenTemplates={handleOpenTemplates}
        replyQuote={replyText}
        onClearReply={() => setReplyText(null)}
      />

      <SendTemplateModal
        open={templateModalOpen}
        onOpenChange={setTemplateModalOpen}
        conversationId={conversation.id}
        onSuccess={() => setTemplateModalOpen(false)}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!messageToDelete} onOpenChange={(open) => { if (!open) setMessageToDelete(null); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Message</DialogTitle>
            <DialogDescription>
              This will remove the message from your CRM records. Choose how you want to delete it.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 py-2">
            <Button
              variant="outline"
              className="w-full justify-start gap-2 border-border hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/50"
              onClick={confirmDeleteForMe}
            >
              <Trash2 className="h-4 w-4" />
              Delete for me (from CRM only)
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-2 border-border hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/50"
              onClick={confirmDeleteForEveryone}
            >
              <Trash2 className="h-4 w-4" />
              Delete for everyone
              <span className="ml-auto text-[10px] text-muted-foreground">Visually only</span>
            </Button>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setMessageToDelete(null)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
