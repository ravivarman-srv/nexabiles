'use client';

import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import type { Message } from '@/types';
import {
  Clock,
  Check,
  CheckCheck,
  XCircle,
  FileText,
  MapPin,
  LayoutTemplate,
  ImageOff,
  ChevronDown,
  Copy,
  Forward,
  Trash2,
  Reply,
  StickyNote,
} from 'lucide-react';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

import { toast } from 'sonner';

interface MessageBubbleProps {
  message: Message;
  onDelete?: (id: string) => void;
  onAddToNotes?: (text: string) => void;
  onReply?: (text: string) => void;
  onResend?: (message: Message) => void;
}

function StatusIcon({ status }: { status: Message['status'] }) {
  switch (status) {
    case 'sending':
      return <Clock className="text-muted-foreground h-3 w-3" />;
    case 'sent':
      return <Check className="text-muted-foreground h-3 w-3" />;
    case 'delivered':
      return <CheckCheck className="text-muted-foreground h-3 w-3" />;
    case 'read':
      return <CheckCheck className="h-3 w-3 text-blue-400" />;
    case 'failed':
      return <XCircle className="h-3 w-3 text-red-400" />;
    default:
      return null;
  }
}

function MediaUnavailable({ label }: { label: string }) {
  return (
    <div className="bg-muted text-muted-foreground flex items-center gap-2 rounded-lg px-3 py-2 text-xs">
      <ImageOff className="text-muted-foreground h-4 w-4 shrink-0" />
      <span>{label} unavailable</span>
    </div>
  );
}

function MediaImage({ url, alt }: { url: string; alt: string }) {
  const [src, setSrc] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadImage = useCallback(async () => {
    if (!url) return;

    // Proxy URLs need auth fetch to create blob URL
    if (url.startsWith('/api/whatsapp/media/')) {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to load media');
        const blob = await res.blob();
        const blobUrl = URL.createObjectURL(blob);
        setSrc(blobUrl);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    } else {
      setSrc(url);
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    loadImage();
    return () => {
      if (src?.startsWith('blob:')) {
        URL.revokeObjectURL(src);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadImage]);

  if (error) {
    return (
      <div className="bg-muted flex h-40 w-60 items-center justify-center rounded-lg">
        <ImageOff className="text-muted-foreground h-8 w-8" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-muted flex h-40 w-60 items-center justify-center rounded-lg">
        <div className="border-primary h-5 w-5 animate-spin rounded-full border-2 border-t-transparent" />
      </div>
    );
  }

  return (
    <img
      src={src ?? ''}
      alt={alt}
      className="max-h-64 max-w-60 rounded-lg object-cover"
      onError={() => setError(true)}
    />
  );
}

function MessageContent({
  message,
  isAgent,
}: {
  message: Message;
  isAgent: boolean;
}) {
  switch (message.content_type) {
    case 'text':
      return (
        <p className="text-sm break-words whitespace-pre-wrap">
          {message.content_text}
        </p>
      );

    case 'image':
      return (
        <div>
          {message.media_url ? (
            <MediaImage url={message.media_url} alt="Shared image" />
          ) : (
            <MediaUnavailable label="Image" />
          )}
          {message.content_text && (
            <p className="mt-1 text-sm break-words whitespace-pre-wrap">
              {message.content_text}
            </p>
          )}
        </div>
      );

    case 'video':
      return (
        <div>
          {message.media_url ? (
            <video
              src={message.media_url}
              controls
              className="max-h-64 max-w-60 rounded-lg"
            />
          ) : (
            <MediaUnavailable label="Video" />
          )}
          {message.content_text && (
            <p className="mt-1 text-sm break-words whitespace-pre-wrap">
              {message.content_text}
            </p>
          )}
        </div>
      );

    case 'audio':
      return (
        <div>
          {message.media_url ? (
            <audio src={message.media_url} controls className="max-w-60" />
          ) : (
            <MediaUnavailable label="Audio" />
          )}
        </div>
      );

    case 'document':
      if (!message.media_url) {
        return <MediaUnavailable label={message.content_text || 'Document'} />;
      }
      return (
        <a
          href={message.media_url}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'flex items-center gap-2 rounded-lg px-3 py-2 text-sm',
            isAgent
              ? 'bg-primary-foreground/10 hover:bg-primary-foreground/20'
              : 'bg-muted hover:bg-muted/80'
          )}
        >
          <FileText className="h-5 w-5 shrink-0" />
          <span className="truncate">{message.content_text || 'Document'}</span>
        </a>
      );

    case 'template':
      return (
        <div>
          <span
            className={cn(
              'mb-1 inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium',
              isAgent
                ? 'bg-black/5 text-[#111b21] dark:bg-black/20 dark:text-[#e9edef]'
                : 'bg-black/5 text-[#111b21] dark:bg-black/20 dark:text-[#e9edef]'
            )}
          >
            <LayoutTemplate className="h-3 w-3" />
            Template
          </span>
          <p className="mt-1 text-sm break-words whitespace-pre-wrap">
            {message.content_text ||
              (message.template_name
                ? `[Template: ${message.template_name}]`
                : '[Empty Template]')}
          </p>
        </div>
      );

    case 'location':
      return (
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 shrink-0" />
          <span>{message.content_text || 'Location shared'}</span>
        </div>
      );

    default:
      return (
        <p className="text-sm break-words whitespace-pre-wrap">
          {message.content_text || '[Unsupported message type]'}
        </p>
      );
  }
}

export function MessageBubble({ message, onDelete, onAddToNotes, onReply, onResend }: MessageBubbleProps) {
  const isAgent =
    message.sender_type === 'agent' || message.sender_type === 'bot';
  const time = format(new Date(message.created_at), 'h:mm aaa');
  const isFailed = message.status === 'failed';

  const comingSoon = () => toast.info('Feature coming soon!');

  return (
    <div
      className={cn(
        'group mb-1 flex w-full',
        isAgent ? 'justify-end' : 'justify-start'
      )}
    >
      <div className={cn('flex flex-col', isAgent ? 'items-end' : 'items-start', 'max-w-[75%]')}>
        {/* Failed banner above bubble */}
        {isFailed && (
          <div className="flex items-center gap-2 mb-1 px-1">
            <XCircle className="h-3.5 w-3.5 text-red-500 shrink-0" />
            <span className="text-[11px] text-red-500">Not delivered</span>
            {onResend && (
              <button
                onClick={() => onResend(message)}
                className="text-[11px] text-primary underline hover:no-underline"
              >
                Resend
              </button>
            )}
          </div>
        )}

        <div
          className={cn(
            'relative rounded-lg px-2.5 py-1.5 text-[14.2px] leading-[19px] shadow-sm w-full',
            isAgent
              ? isFailed
                ? 'rounded-tr-none bg-red-50 text-[#111b21] dark:bg-red-950/30 dark:text-[#e9edef] ring-1 ring-red-400/40'
                : 'rounded-tr-none bg-[#d9fdd3] text-[#111b21] dark:bg-[#005c4b] dark:text-[#e9edef]'
              : 'rounded-tl-none bg-white text-[#111b21] dark:bg-[#202c33] dark:text-[#e9edef]'
          )}
        >
          {/* Dropdown menu trigger */}
          <div className="absolute top-0 right-0 z-10 opacity-0 transition-opacity group-hover:opacity-100">
            <DropdownMenu>
              <DropdownMenuTrigger
                className={cn(
                  'rounded-bl-lg bg-gradient-to-bl p-1',
                  isAgent
                    ? isFailed
                      ? 'from-red-50 dark:from-red-950/30'
                      : 'from-[#d9fdd3] dark:from-[#005c4b]'
                    : 'from-white dark:from-[#202c33]',
                  'focus:outline-none'
                )}
              >
                <ChevronDown className="h-4 w-4 text-black/50 dark:text-white/50" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align={isAgent ? 'end' : 'start'}
                className="w-40"
              >
                <DropdownMenuItem
                  className="cursor-pointer gap-2 py-1.5 text-xs"
                  onClick={() => {
                    if (onReply) {
                      onReply(message.content_text || `[${message.content_type}]`);
                    }
                  }}
                >
                  <Reply className="h-3.5 w-3.5" /> Reply
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer gap-2 py-1.5 text-xs"
                  onClick={() => {
                    navigator.clipboard.writeText(message.content_text || '');
                    toast.success('Copied to clipboard');
                  }}
                >
                  <Copy className="h-3.5 w-3.5" /> Copy
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer gap-2 py-1.5 text-xs"
                  onClick={comingSoon}
                >
                  <Forward className="h-3.5 w-3.5" /> Forward
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer gap-2 py-1.5 text-xs"
                  onClick={() => {
                    if (onAddToNotes && message.content_text) {
                      onAddToNotes(message.content_text);
                    } else if (!message.content_text) {
                      toast.error("Message has no text to add");
                    } else {
                      comingSoon();
                    }
                  }}
                >
                  <StickyNote className="h-3.5 w-3.5" /> Add to notes
                </DropdownMenuItem>
                {isAgent && isFailed && onResend && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer gap-2 py-1.5 text-xs text-primary"
                      onClick={() => onResend(message)}
                    >
                      <Reply className="h-3.5 w-3.5" /> Resend
                    </DropdownMenuItem>
                  </>
                )}
                {isAgent && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer gap-2 py-1.5 text-xs text-red-500 focus:text-red-500"
                      onClick={() => onDelete?.(message.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* WhatsApp-style reply quote inside the bubble */}
          {message.reply_to_text && (
            <div
              className={cn(
                'mb-1.5 border-l-[3px] rounded-sm px-2 py-1 text-[12px] opacity-80',
                isAgent
                  ? 'border-primary/60 bg-black/10 dark:bg-white/10'
                  : 'border-primary/60 bg-black/5 dark:bg-white/10'
              )}
            >
              <p className="font-medium text-[10px] text-primary mb-0.5">
                {isAgent ? 'You' : 'Contact'}
              </p>
              <p className="line-clamp-3 break-words text-inherit/70">{message.reply_to_text}</p>
            </div>
          )}

          <MessageContent message={message} isAgent={isAgent} />
          <div
            className={cn(
              'mt-0.5 flex items-center gap-1 justify-end'
            )}
          >
            <span className="pt-1 text-[11px] text-black/45 dark:text-white/60">
              {time}
            </span>
            {isAgent && <StatusIcon status={message.status} />}
          </div>
        </div>
      </div>
    </div>
  );
}

