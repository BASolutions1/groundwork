const facts = [
  { label: "Who it's for", value: "Any business, any industry" },
  { label: "What you get", value: "Every step, in the right order" },
  { label: "Where", value: "Worldwide, based in Canada" },
];

export function FactsStrip() {
  return (
    <section className="border-y border-line">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 px-6 tab:grid-cols-3 desk:px-8">
        {facts.map((fact) => (
          <div
            key={fact.label}
            className="flex flex-col gap-1.5 border-b border-line py-[22px] last:border-b-0 tab:border-r tab:border-b-0 tab:px-6 tab:first:pl-0 tab:last:border-r-0 tab:last:pr-0"
          >
            <span className="mono">{fact.label}</span>
            <span className="text-sm font-medium">{fact.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
