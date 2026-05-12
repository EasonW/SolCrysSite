import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
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
import {
  trackEvent,
  type AuditSurface,
  type PricingAudience,
  type PricingPlanKey,
} from "@/lib/analytics";

interface TrialSignupDialogProps {
  children: React.ReactNode;
  surface: AuditSurface;
  planKey: PricingPlanKey;
  planLabel: string;
  audience: PricingAudience;
}

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xojnjoda";

const TrialSignupDialog = ({
  children,
  surface,
  planKey,
  planLabel,
  audience,
}: TrialSignupDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOpenChange = (next: boolean) => {
    if (next && !open) {
      trackEvent("pricing_trial_open", { surface, plan: planKey, audience });
    }
    setOpen(next);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        trackEvent("pricing_trial_submit", { surface, plan: planKey, audience });
        toast.success("Thanks. We'll follow up about this plan.");
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
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle>{planLabel} plan request</DialogTitle>
          <DialogDescription>
            Tell us where to start. We will follow up with the right onboarding path for this plan.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <input type="hidden" name="form_type" value="pricing_trial_request" />
          <input type="hidden" name="plan" value={planKey} />
          <input type="hidden" name="plan_label" value={planLabel} />
          <input type="hidden" name="audience" value={audience} />
          <input type="hidden" name="surface" value={surface} />

          <div className="grid gap-2">
            <Label htmlFor={`${planKey}-name`}>
              Name <span className="text-destructive">*</span>
            </Label>
            <Input id={`${planKey}-name`} name="name" placeholder="Jane Doe" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`${planKey}-company`}>
              {audience === "agency" ? "Agency" : "Company"}{" "}
              <span className="text-destructive">*</span>
            </Label>
            <Input
              id={`${planKey}-company`}
              name="company"
              placeholder={audience === "agency" ? "Acme Agency" : "Acme Inc."}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`${planKey}-website`}>Website</Label>
            <Input
              id={`${planKey}-website`}
              name="website"
              type="url"
              placeholder="https://example.com"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`${planKey}-email`}>
              Work email <span className="text-destructive">*</span>
            </Label>
            <Input
              id={`${planKey}-email`}
              name="email"
              type="email"
              placeholder="jane@company.com"
              required
            />
          </div>
          {audience === "agency" ? (
            <div className="grid gap-2">
              <Label htmlFor={`${planKey}-clients`}>How many clients today?</Label>
              <Input
                id={`${planKey}-clients`}
                name="client_count"
                type="number"
                min={1}
                placeholder="e.g. 8"
              />
            </div>
          ) : (
            <div className="grid gap-2">
              <Label htmlFor={`${planKey}-brands`}>How many brands or product lines?</Label>
              <Input
                id={`${planKey}-brands`}
                name="brand_count"
                type="number"
                min={1}
                placeholder="e.g. 1"
              />
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor={`${planKey}-notes`}>Anything we should know? (optional)</Label>
            <Textarea
              id={`${planKey}-notes`}
              name="notes"
              placeholder={
                audience === "agency"
                  ? "Verticals, geographies, AEO services you offer..."
                  : "Top competitors, key prompts, AI surfaces that matter most..."
              }
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {loading ? "Submitting..." : `Request ${planLabel}`}
          </Button>
          <p className="px-4 text-center text-xs text-muted-foreground">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TrialSignupDialog;
