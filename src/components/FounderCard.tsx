interface FounderCardProps {
  image?: string;
  initials: string;
  name: string;
  title: string;
  background: string;
  expertise: string;
  linkedin?: string;
}

const FounderCard = ({ image, initials, name, title, background, expertise, linkedin }: FounderCardProps) => {
  return (
    <div className="fade-in-scroll group rounded-2xl border border-border/40 bg-card/60 backdrop-blur-sm p-6 text-center transition-all hover:-translate-y-1 hover:shadow-lg">
      <div className="mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full bg-muted border border-border/40 flex items-center justify-center">
        {image ? (
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
              (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
            }}
          />
        ) : null}
        <span className={`text-2xl font-bold text-muted-foreground ${image ? "hidden" : ""}`}>
          {initials}
        </span>
      </div>
      <h3 className="font-heading text-lg font-semibold text-foreground">{name}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{title}</p>
      <p className="mt-1 text-xs text-muted-foreground/70">{background}</p>
      <p className="mt-1 text-xs text-muted-foreground/70">{expertise}</p>
      {linkedin && (
        <a
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
          LinkedIn
        </a>
      )}
    </div>
  );
};

export default FounderCard;
