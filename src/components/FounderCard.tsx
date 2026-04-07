interface FounderCardProps {
  image?: string;
  initials: string;
  name: string;
  title: string;
  background: string;
  expertise: string;
}

const FounderCard = ({ image, initials, name, title, background, expertise }: FounderCardProps) => {
  return (
    <div className="fade-in-scroll group rounded-2xl border border-border/40 bg-card/60 backdrop-blur-sm p-6 text-center transition-all hover:-translate-y-1 hover:shadow-lg">
      <div className="mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full bg-muted flex items-center justify-center">
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
    </div>
  );
};

export default FounderCard;
