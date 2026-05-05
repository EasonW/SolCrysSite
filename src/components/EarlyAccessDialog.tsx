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

interface EarlyAccessDialogProps {
  children: React.ReactNode;
  surface: AuditSurface;
}

const EarlyAccessDialog = ({ children, surface }: EarlyAccessDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const FORMSPREE_ENDPOINT = "https://formspree.io/f/xojnjoda";

  const handleOpenChange = (next: boolean) => {
    if (next && !open) trackEvent("request_audit_open", { surface });
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
        trackEvent("request_audit_submit", { surface });
        toast.success("Thanks. We'll follow up about your audit.");
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
          <DialogTitle>Get Your Free AI Visibility Audit</DialogTitle>
          <DialogDescription>
            Tell us where to start and we will review priority prompts, citations, competitors, and answer accuracy. Free, no commitment.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
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
            <Textarea id="message" name="message" placeholder="Tell us which AI surfaces, competitors, or prompts matter most..." />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {loading ? "Submitting..." : "Get My Free Audit"}
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
