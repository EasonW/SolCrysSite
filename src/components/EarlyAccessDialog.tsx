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

interface EarlyAccessDialogProps {
  children: React.ReactNode;
}

const EarlyAccessDialog = ({ children }: EarlyAccessDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // PLACEHOLDER: Replace this with your actual Formspree endpoint
  const FORMSPREE_ENDPOINT = "https://formspree.io/f/xojnjoda"; 

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
        toast.success("Thanks for joining! We'll be in touch soon.");
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Get Early Access</DialogTitle>
          <DialogDescription>
            Join the waitlist to be among the first to experience SolCrys AI.
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
            <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
            <Input id="email" name="email" type="email" placeholder="john@company.com" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone (Optional)</Label>
            <Input id="phone" name="phone" type="tel" placeholder="+1 (555) 000-0000" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea id="message" name="message" placeholder="Tell us about your needs..." />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {loading ? "Joining..." : "Join Waitlist"}
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
