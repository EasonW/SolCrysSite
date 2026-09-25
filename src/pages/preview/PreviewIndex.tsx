import { PreviewRibbon, usePreviewPage } from "@/preview/PreviewChrome";

/** PREVIEW — index of homepage style variants. Same copy, different design. */
const VARIANTS = [
  {
    href: "/preview/home/",
    name: "A · Brand (current system)",
    refs: "Today's solcrys.com design system",
    note: "Lowest risk: same fonts, colors and components, new story and sections.",
  },
  {
    href: "/preview/editorial/",
    name: "B · Editorial",
    refs: "Granola, Resend",
    note: "Warm paper, large serif, real work collaged in the hero. Reads as a brand and story partner.",
  },
  {
    href: "/preview/technical/",
    name: "C · Technical lab",
    refs: "Factory",
    note: "Grid field, uppercase grotesk, monospace labels, bracket buttons. Reads as a measurement lab.",
  },
  {
    href: "/preview/cinematic/",
    name: "D · Cinematic dark",
    refs: "Legora, Sierra, Resend",
    note: "Full-bleed Motion work as the hero, floating client card, near-black. Shows the craft first.",
  },
];

const PreviewIndex = () => {
  usePreviewPage("Homepage style variants");
  return (
  <>
  <PreviewRibbon />
  <main className="mx-auto max-w-3xl px-6 py-20">
    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[hsl(var(--brand-accent-ink))]">Internal preview</p>
    <h1 className="mb-3 text-4xl font-bold tracking-tight">Homepage style variants</h1>
    <p className="mb-10 text-muted-foreground">
      All four use the same copy, the original Loop ring and the same Cornelis proof. Only the visual language changes.
    </p>
    <ul className="grid gap-4">
      {VARIANTS.map((v) => (
        <li key={v.href}>
          <a href={v.href} className="block rounded-xl border border-border/40 p-6 transition-colors hover:border-border">
            <p className="text-lg font-semibold">{v.name}</p>
            <p className="mt-1 text-sm text-[hsl(var(--brand-accent-ink))]">Reference: {v.refs}</p>
            <p className="mt-2 text-sm text-muted-foreground">{v.note}</p>
          </a>
        </li>
      ))}
    </ul>
  </main>
  </>
  );
};

export default PreviewIndex;
