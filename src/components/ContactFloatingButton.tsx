import { useLocation } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import EarlyAccessDialog from "@/components/EarlyAccessDialog";

/**
 * Floating "Questions? Talk to a founder" launcher.
 *
 * Mirrors the geo-platform `FeedbackButton` placement (bottom-right pill)
 * but reuses the existing `EarlyAccessDialog mode="founder"` so the
 * contact form, analytics, lead-intake, and success toast are all the
 * same surface the inline pricing CTAs already use. No duplicate form.
 *
 * Passes `compact` so this ambient, mixed-intent surface shows a lighter
 * form (Name + Company + Email required, optional Message; no Website /
 * Phone) — a quick question, not a full sales intake. The full 6-field
 * founder form stays on the high-intent pricing page (geo-platform).
 *
 * Visibility rules:
 *   - Hidden on `/pricing` (already has inline "Talk to a founder" CTAs;
 *     a floating button would compete with the primary pricing CTAs).
 *   - Visible everywhere else, including homepage, /resources/<slug>,
 *     /customers, /news, /about. The widget is for sales-led conversion
 *     of buyers who are not ready for the self-serve free audit funnel.
 *
 * Z-index: 40, one below the navbar (z-50) so it never covers the
 * fixed nav drop-shadow on scroll.
 */
const HIDDEN_PREFIXES = ["/pricing"];

function isHiddenPath(pathname: string): boolean {
  return HIDDEN_PREFIXES.some(
    (p) => pathname === p || pathname === `${p}/` || pathname.startsWith(`${p}/`),
  );
}

const ContactFloatingButton = () => {
  const { pathname } = useLocation();

  if (isHiddenPath(pathname)) return null;

  return (
    <EarlyAccessDialog mode="founder" surface="floating_contact" compact>
      <button
        type="button"
        aria-label="Questions? Talk to a SolCrys founder"
        title="Questions? Talk to a SolCrys founder"
        className="fixed right-4 bottom-4 z-40 inline-flex items-center gap-2 px-4 py-2.5 rounded-full shadow-floating-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
      >
        <MessageCircle className="h-4 w-4" aria-hidden="true" />
        Questions? Talk to a founder
      </button>
    </EarlyAccessDialog>
  );
};

export default ContactFloatingButton;
