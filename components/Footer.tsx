import { BrandLogo } from "@/components/BrandLogo";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4 px-6 py-6 desk:px-8">
        <BrandLogo
          href="/"
          iconClassName="h-6 w-auto"
          textClassName="text-[15px] font-semibold tracking-[-0.02em] text-ink"
        />
        <span className="mono text-[12px] text-muted">Groundwork. Based in Canada.</span>
      </div>
    </footer>
  );
}
