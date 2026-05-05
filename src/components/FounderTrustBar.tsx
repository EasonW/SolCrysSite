import siteContent from "@/content/siteContent.json";
import gwenImg from "@/assets/gwen-chen.jpg";
import easonImg from "@/assets/eason-wang.jpg";
import jiaImg from "@/assets/jia-chang.jpg";

const founderImages: Record<string, string> = {
  "gwen-chen.jpg": gwenImg,
  "eason-wang.jpg": easonImg,
  "jia-chang.jpg": jiaImg,
};

const FounderTrustBar = () => {
  const { founders } = siteContent.home;

  return (
    <div className="mt-10 pt-8 border-t border-white/5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 max-w-4xl mx-auto">
        <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium md:whitespace-nowrap">
          Built by
        </p>
        <div className="flex flex-wrap justify-center md:justify-end items-center gap-x-7 gap-y-3">
          {founders.map((founder) => (
            <a
              key={founder.name}
              href={founder.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2.5 transition-opacity hover:opacity-100 opacity-90"
            >
              <span className="h-9 w-9 overflow-hidden rounded-full border border-border/50 bg-muted shrink-0">
                {founderImages[founder.image] ? (
                  <img
                    src={founderImages[founder.image]}
                    alt={founder.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-xs font-bold text-muted-foreground">
                    {founder.initials}
                  </span>
                )}
              </span>
              <span className="text-left">
                <span className="block text-sm font-medium text-foreground/90 group-hover:text-foreground transition-colors leading-tight">
                  {founder.name}
                </span>
                <span className="block text-[11px] text-muted-foreground leading-tight">
                  {founder.background}
                </span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FounderTrustBar;
