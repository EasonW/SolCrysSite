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
import { submitLeadIntake } from "@/lib/lead-intake";

interface TrialSignupDialogProps {
  children: React.ReactNode;
  surface: AuditSurface;
  planKey: PricingPlanKey;
  planLabel: string;
  audience: PricingAudience;
}

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
    const get = (key: string): string =>
      (formData.get(key) as string | null)?.trim() ?? "";

    // Audience-conditional structured field. Server stores everything we
    // pass in form_payload so we keep both keys explicit here.
    const clientCount = get("client_count");
    const brandCount = get("brand_count");

    try {
      const result = await submitLeadIntake({
        form_type: "pricing_trial_request",
        source: `marketing:pricing_trial_request@pricing:${planKey}`,
        full_name: get("name"),
        work_email: get("email"),
        company_name: get("company"),
        website: get("website") || undefined,
        message: get("notes") || undefined,
        honeypot: get("company_website_url"),
        form_payload: {
          plan: planKey,
          plan_label: planLabel,
          audience,
          surface,
          ...(clientCount ? { client_count: Number(clientCount) } : {}),
          ...(brandCount ? { brand_count: Number(brandCount) } : {}),
        },
      });

      if (result.ok) {
        trackEvent("pricing_trial_submit", { surface, plan: planKey, audience });
        toast.success("Thanks. We'll follow up about this plan.");
        setOpen(false);
      } else {
        console.error("Submission error:", result.error);
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
          {/* Honeypot — see EarlyAccessDialog for full pattern explanation. */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              left: "-10000px",
              top: "auto",
              width: "1px",
              height: "1px",
              overflow: "hidden",
            }}
          >
            <Label htmlFor={`${planKey}-company_website_url`}>
              Company website URL
            </Label>
            <Input
              id={`${planKey}-company_website_url`}
              name="company_website_url"
              type="text"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

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
