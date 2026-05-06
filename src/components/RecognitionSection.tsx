const NVIDIA_GREEN = "#76B900";

const RecognitionSection = () => {
  return (
    <section className="relative py-24 md:py-32 section-fade overflow-hidden">
      <div className="absolute inset-x-0 top-1/3 h-64 bg-[radial-gradient(circle_at_center,rgba(118,185,0,0.08),transparent_60%)]" />

      <div className="container mx-auto px-6 max-w-5xl relative">
        <div className="grid md:grid-cols-[auto_1fr] items-center gap-10 md:gap-14">
          {/* Badge — kept on white per NVIDIA brand guidelines, regardless of site theme */}
          <div className="flex justify-center md:justify-start">
            <a
              href="https://www.nvidia.com/en-us/startups/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="NVIDIA Inception Program member page"
              className="block rounded-xl bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.06)] transition-shadow duration-300 hover:shadow-[0_2px_4px_rgba(0,0,0,0.06),0_16px_40px_rgba(118,185,0,0.18)]"
            >
              <img
                src="/nvidia-inception-badge.jpg"
                alt="Member of NVIDIA Inception Program"
                width={240}
                height={120}
                loading="lazy"
                className="h-auto w-[240px] max-w-full block"
              />
            </a>
          </div>

          {/* Copy */}
          <div className="text-center md:text-left">
            <p
              className="text-sm font-medium tracking-wider uppercase mb-3"
              style={{ color: NVIDIA_GREEN }}
            >
              Recognized by
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              SolCrys joins the NVIDIA Inception Program.
            </h2>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-xl md:max-w-2xl mx-auto md:mx-0">
              NVIDIA Inception supports AI startups with platform access,
              technical expertise, and ecosystem connections. For SolCrys
              customers, that means continued investment in the AI
              infrastructure behind prompt-level AEO measurement, citation
              tracking, and answer-accuracy monitoring.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecognitionSection;
