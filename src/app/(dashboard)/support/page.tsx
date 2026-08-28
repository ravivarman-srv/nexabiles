import { Mail, MessageCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SupportPage() {
  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Support</h1>
        <p className="mt-2 text-muted-foreground">
          Need help with Nexabilis? We are here to help you.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Contact Support */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Mail className="h-5 w-5 text-primary" />
          </div>
          <h3 className="mb-2 font-semibold text-foreground">Email Support</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Get in touch with our team directly. We typically respond within 24 hours.
          </p>
          <Button variant="outline" className="w-full">
            support@nexabilis.com
          </Button>
        </div>

        {/* Live Chat */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <MessageCircle className="h-5 w-5 text-primary" />
          </div>
          <h3 className="mb-2 font-semibold text-foreground">Live Chat</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Chat with our support team in real-time during business hours.
          </p>
          <Button className="w-full">
            Start Chat
          </Button>
        </div>

        {/* Documentation */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <h3 className="mb-2 font-semibold text-foreground">Documentation</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Browse our detailed guides and API documentation to learn more.
          </p>
          <Button variant="outline" className="w-full">
            View Docs
          </Button>
        </div>
      </div>
    </div>
  );
}
