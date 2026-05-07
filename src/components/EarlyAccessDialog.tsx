import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { trackEvent, type AuditSurface } from "@/lib/analytics";

export type EarlyAccessMode = "audit" | "founder";

interface EarlyAccessDialogProps {
  children: React.ReactNode;
  surface: AuditSurface;
  mode?: EarlyAccessMode;
}

const COPY: Record<EarlyAccessMode, {
  title: string;
  description: string;
  submitLabel: string;
  submitLoading: string;
  formType: string;
  openEvent: string;
  submitEvent: string;
  successToast: string;
  messagePlaceholder: string;
}> = {
  audit: {
    title: "Get Your Free AI Visibility Audit",
    description:
      "Tell us where to start and we will review priority prompts, citations, competitors, and answer accuracy. Free, no commitment.",
    submitLabel: "Get My Free Audit",
    submitLoading: "Submitting...",
    formType: "audit_request",
    openEvent: "request_audit_open",
    submitEvent: "request_audit_submit",
    successToast: "Thanks. We'll follow up about your audit.",
    messagePlaceholder: "Tell us which AI surfaces, competitors, or prompts matter most...",
  },
  founder: {
    title: "Talk to a SolCrys founder",
    description:
      "Tell us about your AEO priorities and we'll set up a 20-minute call. No pitch, just useful guidance.",
    submitLabel: "Request a chat",
    submitLoading: "Sending...",
    formType: "founder_chat",
    openEvent: "founder_chat_open",
    submitEvent: "founder_chat_submit",
    successToast: "Thanks. We'll reach out to schedule a call.",
    messagePlaceholder: "What brings you to SolCrys? Team size, AI surfaces, or biggest AEO question...",
  },
};

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xojnjoda";

const EarlyAccessDialog = ({ children, surface, mode = "audit" }: EarlyAccessDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const copy = COPY[mode];

  const handleOpenChange = (next: boolean) => {
    if (next && !open) trackEvent(copy.openEvent, { surface, mode });
    setOpen(next);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
      });

      if (response.ok) {
        trackEvent(copy.submitEvent, { surface, mode });
        toast.success(copy.successToast);
        setOpen(false);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to submit. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{copy.title}</DialogTitle>
          <DialogDescription>{copy.description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <input type="hidden" name="form_type" value={copy.formType} />
          <input type="hidden" name="surface" value={surface} />

          <div className="grid gap-2">
            <Label htmlFor="name">Name <span className="text-destructive">*</span></Label>
            <Input id="name" name="name" placeholder="John Doe" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="company">Company <span className="text-destructive">*</span></Label>
            <Input id="company" name="company" placeholder="Acme Inc." required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="website">Company Website</Label>
            <Input id="website" name="website" type="url" placeholder="https://example.com" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
            <Input id="email" name="email" type="email" placeholder="john@company.com" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone (Optional)</Label>
            <Input id="phone" name="phone" type="tel" placeholder="+1 (555) 000-0000" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea id="message" name="message" placeholder={copy.messagePlaceholder} />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {loading ? copy.submitLoading : copy.submitLabel}
          </Button>
          <p className="text-xs text-muted-foreground text-center px-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EarlyAccessDialog;
