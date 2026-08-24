"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { MessageTemplate } from "@/types";

interface SendTemplateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conversationId: string;
  onSuccess: () => void;
}

export function SendTemplateModal({ open, onOpenChange, conversationId, onSuccess }: SendTemplateModalProps) {
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (open) {
      fetchTemplates();
      setSelectedTemplateId("");
    }
  }, [open]);

  async function fetchTemplates() {
    setLoading(true);
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from("message_templates")
        .select("*")
        .eq("status", "Approved")
        .order("name", { ascending: true });
        
      if (error) throw error;
      setTemplates(data || []);
    } catch (err) {
      console.error("Failed to load templates:", err);
      toast.error("Failed to load templates");
    } finally {
      setLoading(false);
    }
  }

  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId);

  async function handleSend() {
    if (!selectedTemplateId || !selectedTemplate) {
      toast.error("Please select a template");
      return;
    }

    setSending(true);
    try {
      const res = await fetch("/api/whatsapp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversation_id: conversationId,
          message_type: "template",
          template_name: selectedTemplate.name,
          content_text: selectedTemplate.body_text,
          template_params: [], // Hardcoded to no params for now to simplify
        }),
      });

      const payload = await res.json().catch(() => ({}));

      if (!res.ok) {
        const reason = payload?.error || `HTTP ${res.status}`;
        throw new Error(reason);
      }

      toast.success("Template sent");
      onSuccess();
      onOpenChange(false);
    } catch (err) {
      console.error("Failed to send template:", err);
      toast.error(`Failed to send: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setSending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">Send Template</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Select a pre-approved template to re-engage the customer.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-muted-foreground">Select Template</Label>
            {loading ? (
              <div className="flex h-10 items-center justify-center rounded-md border border-border bg-muted">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <Select value={selectedTemplateId} onValueChange={(val) => setSelectedTemplateId(val || "")}>
                <SelectTrigger className="w-full bg-muted border-border text-foreground">
                  <SelectValue placeholder={templates.length === 0 ? "No approved templates found" : "Select a template"} />
                </SelectTrigger>
                <SelectContent className="bg-muted border-border max-h-60">
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id} className="text-foreground focus:bg-muted focus:text-foreground">
                      {template.name} ({template.language})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            
            {templates.length === 0 && !loading && (
              <p className="text-xs text-muted-foreground mt-1">
                You must have approved templates in Settings &gt; Templates.
              </p>
            )}
          </div>

          {selectedTemplate && (
            <div className="rounded-md border border-border bg-muted p-3">
              <p className="whitespace-pre-wrap text-sm text-foreground">
                {selectedTemplate.body_text}
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="bg-card border-border">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="border-border text-muted-foreground hover:bg-muted">
            Cancel
          </Button>
          <Button 
            onClick={handleSend} 
            disabled={!selectedTemplateId || sending || templates.length === 0}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {sending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
