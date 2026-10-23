const facts = [
  { label: "Who it's for", value: "Any business, any industry" },
  { label: "What you get", value: "Every step, in the right order" },
  { label: "Where", value: "Canada" },
  {
    label: "What we are",
    value: "Guidance and referrals, not legal or accounting advice",
  },
];

export function FactsStrip() {
  return (
    <section className="border-y border-line">
      <div className="mx-auto grid max-w-[1200px] grid-cols-2 px-6 desk:grid-cols-4 desk:px-8">
        {facts.map((fact, index) => (
          <div
            key={fact.label}
            className={[
              "flex flex-col gap-1.5 py-[22px]",
              index % 2 === 0 ? "border-r border-line pr-6" : "pl-6",
              index < 2 ? "border-b border-line desk:border-b-0" : "",
              "desk:border-r desk:border-line desk:px-6 desk:first:pl-0 desk:last:border-r-0 desk:last:pr-0",
            ].join(" ")}
          >
            <span className="mono">{fact.label}</span>
            <span className="text-sm font-medium">{fact.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
