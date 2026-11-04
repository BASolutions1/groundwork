import { BrandLogo } from "@/components/BrandLogo";

const links = [
  { href: "#why", label: "Why Groundwork" },
  { href: "#how", label: "How it works" },
  { href: "#who", label: "Who we are" },
];

export function Nav() {
  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-30">
      <div className="pointer-events-auto mx-auto flex max-w-[1200px] items-center justify-between gap-6 px-6 py-[18px] desk:px-8">
        <div className="flex min-w-0 items-center gap-11">
          <BrandLogo href="#top" priority iconClassName="h-8 w-auto" />
          <nav className="hidden items-center gap-[26px] desk:flex" aria-label="Page">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[13px] font-medium text-secondary hover:text-[#444444]"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-[22px]">
          <a
            id="signin"
            href="/login"
            className="hidden text-[13px] font-medium text-secondary hover:text-[#444444] sm:inline"
          >
            Sign in
          </a>
          <a
            href="#start"
            className="rounded-control bg-ink px-3.5 py-[9px] text-[13px] font-medium text-white hover:bg-[#2a2a2a]"
          >
            Start your list →
          </a>
        </div>
      </div>
      <nav
        className="pointer-events-auto mx-auto flex max-w-[1200px] gap-5 overflow-x-auto px-6 pb-3 desk:hidden"
        aria-label="Page"
      >
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="shrink-0 text-[13px] font-medium text-secondary"
          >
            {link.label}
          </a>
        ))}
        <a href="/login" className="shrink-0 text-[13px] font-medium text-secondary sm:hidden">
          Sign in
        </a>
      </nav>
    </header>
  );
}
