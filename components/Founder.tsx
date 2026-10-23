export function Founder() {
  return (
    <section id="who" className="bg-ink text-white">
      <div className="mx-auto grid max-w-[1200px] items-center gap-10 px-6 py-16 desk:grid-cols-2 desk:gap-16 desk:px-8 desk:py-24">
        <div className="flex flex-col gap-[18px]">
          <span className="mono">Who we are</span>
          <h2 className="m-0 text-[clamp(2rem,4vw,2.5rem)] leading-[1.08] font-medium tracking-[-0.035em]">
            For any kind of business.
          </h2>
          <p className="m-0 max-w-[460px] text-base leading-[1.55] text-[#A1A1A6]">
            Registration, taxes, insurance, a website, who to call. The same work shows up
            in every industry. Groundwork puts it in order, stays on the line when a step
            needs someone who's done it, and handles the web and systems side.
          </p>
        </div>
        <div className="flex aspect-[4/3] items-center justify-center rounded-[6px] bg-[#1C1C1E] text-[13px] text-[#6E6E73]">
          [photo]
        </div>
      </div>
    </section>
  );
}
