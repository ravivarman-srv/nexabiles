'use client';

import { useState, useRef, useCallback, useEffect, KeyboardEvent } from 'react';
import { Send, LayoutTemplate, X, CornerUpLeft, Paperclip, Image as ImageIcon, FileText, Smile, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const COMMON_EMOJIS = [
  '😀', '😂', '🥰', '😍', '😎', '😭', '🥺', '😡', '🤔', '👍',
  '👎', '🙏', '❤️', '🔥', '✨', '🎉', '👏', '🙌', '💯', '✅'
];

interface MessageComposerProps {
  conversationId: string;
  sessionExpired: boolean;
  onSend: (text: string) => void;
  onOpenTemplates: () => void;
  replyQuote?: string | null;
  onClearReply?: () => void;
}

export function MessageComposer({
  conversationId,
  sessionExpired,
  onSend,
  onOpenTemplates,
  replyQuote,
  onClearReply,
}: MessageComposerProps) {
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [attachOpen, setAttachOpen] = useState(false);
  const [emojiOpen, setEmojiOpen] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus textarea when a reply is triggered
  useEffect(() => {
    if (replyQuote && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [replyQuote]);

  const adjustHeight = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    // Max 4 lines (~96px)
    el.style.height = `${Math.min(el.scrollHeight, 96)}px`;
  }, []);

  const handleSend = useCallback(async () => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    setSending(true);
    try {
      onSend(trimmed);
      setText('');
      onClearReply?.(); // clear reply context after sending
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    } finally {
      setSending(false);
    }
  }, [text, sending, onSend, onClearReply]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setText(e.target.value);
      adjustHeight();
    },
    [adjustHeight]
  );

  const handleEmojiClick = (emoji: string) => {
    setText((prev) => prev + emoji);
    setEmojiOpen(false);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'document') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSending(true);
    setAttachOpen(false);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('conversationId', conversationId);
      formData.append('type', type);
      if (text.trim()) {
        formData.append('caption', text.trim());
      }

      const res = await fetch('/api/whatsapp/send/media', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to upload media');
      }

      setText('');
      onClearReply?.();
      toast.success(`${type === 'image' ? 'Image' : 'Document'} sent successfully!`);
    } catch (err: any) {
      console.error('Upload error:', err);
      toast.error(err.message || 'Failed to send media');
    } finally {
      setSending(false);
      e.target.value = ''; // Reset input
    }
  };

  // When session is expired, show a blocker banner instead of the full composer
  if (sessionExpired) {
    return (
      <div className="bg-[#f0f2f5] dark:bg-[#202c33] border-t border-border">
        {/* Hidden file inputs still needed */}
        <input type="file" accept="image/*" className="hidden" ref={imageInputRef} onChange={(e) => handleFileUpload(e, 'image')} />
        <input type="file" accept=".pdf,.doc,.docx,.txt,.xls,.xlsx" className="hidden" ref={documentInputRef} onChange={(e) => handleFileUpload(e, 'document')} />

        <div className="flex flex-col items-center gap-3 px-4 py-4">
          <div className="flex items-start gap-3 w-full max-w-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300/60 rounded-lg px-4 py-3">
            <span className="text-amber-500 text-lg mt-0.5">⚠️</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                WhatsApp session expired
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                The 24-hour messaging window has closed. You can only re-engage this contact using a pre-approved WhatsApp template message.
              </p>
            </div>
          </div>
          <Button
            variant="default"
            className="gap-2"
            onClick={onOpenTemplates}
          >
            <LayoutTemplate className="h-4 w-4" />
            Send Template Message
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f0f2f5] dark:bg-[#202c33] flex flex-col justify-center">
      {/* Hidden file inputs */}
      <input 
        type="file" 
        accept="image/*" 
        className="hidden" 
        ref={imageInputRef} 
        onChange={(e) => handleFileUpload(e, 'image')} 
      />
      <input 
        type="file" 
        accept=".pdf,.doc,.docx,.txt,.xls,.xlsx" 
        className="hidden" 
        ref={documentInputRef} 
        onChange={(e) => handleFileUpload(e, 'document')} 
      />

      {/* Reply quote banner */}
      {replyQuote && (
        <div className="flex items-start gap-2 border-l-4 border-primary bg-white/50 dark:bg-black/20 px-4 py-2 mx-3 mt-2 rounded-lg">
          <CornerUpLeft className="h-4 w-4 text-primary mt-0.5 shrink-0" />
          <p className="flex-1 text-xs text-muted-foreground line-clamp-2 break-words">{replyQuote}</p>
          <button onClick={onClearReply} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
      <div className="flex items-center gap-2 p-3">
        <Popover open={emojiOpen} onOpenChange={setEmojiOpen}>
          <PopoverTrigger
            className="inline-flex items-center justify-center text-[#54656f] dark:text-[#8696a0] hover:bg-black/5 dark:hover:bg-white/5 h-10 w-10 shrink-0 rounded-full p-0"
            title="Emojis"
          >
            <Smile className="h-6 w-6" />
          </PopoverTrigger>
          <PopoverContent side="top" align="start" className="w-64 p-2">
            <div className="grid grid-cols-5 gap-2">
              {COMMON_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleEmojiClick(emoji)}
                  className="text-2xl hover:bg-muted rounded-md p-1"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <Popover open={attachOpen} onOpenChange={setAttachOpen}>
          <PopoverTrigger
            className="inline-flex items-center justify-center text-[#54656f] dark:text-[#8696a0] hover:bg-black/5 dark:hover:bg-white/5 h-10 w-10 shrink-0 rounded-full p-0 disabled:opacity-40 disabled:pointer-events-none"
            title="Attach"
            disabled={sending}
          >
            {sending ? <Loader2 className="h-5 w-5 animate-spin text-primary" /> : <Paperclip className="h-6 w-6" />}
          </PopoverTrigger>
          <PopoverContent side="top" align="start" className="w-48 p-2">
            <div className="flex flex-col gap-1">
              <Button 
                variant="ghost" 
                className="justify-start gap-3 w-full"
                onClick={() => imageInputRef.current?.click()}
              >
                <ImageIcon className="h-5 w-5 text-blue-500" /> Image
              </Button>
              <Button 
                variant="ghost" 
                className="justify-start gap-3 w-full"
                onClick={() => documentInputRef.current?.click()}
              >
                <FileText className="h-5 w-5 text-purple-500" /> Document
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <Button
          variant="ghost"
          size="sm"
          className="text-[#54656f] dark:text-[#8696a0] hover:bg-black/5 dark:hover:bg-white/5 h-10 w-10 shrink-0 rounded-full p-0"
          onClick={onOpenTemplates}
          title="Send template"
        >
          <LayoutTemplate className="h-6 w-6" />
        </Button>

        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={replyQuote ? "Type your reply..." : "Type a message"}
          rows={1}
          className={cn(
            'bg-white dark:bg-[#2a3942] text-foreground flex-1 resize-none rounded-lg px-4 py-2.5 text-[15px] placeholder-[#8696a0] outline-none max-h-[100px]'
          )}
        />

        <Button
          variant="ghost"
          size="sm"
          className="text-[#54656f] dark:text-[#8696a0] hover:bg-black/5 dark:hover:bg-white/5 h-10 w-10 shrink-0 rounded-full p-0 disabled:opacity-40"
          disabled={!text.trim() || sending}
          onClick={handleSend}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
