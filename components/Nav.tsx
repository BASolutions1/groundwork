const links = [
  { href: "#why", label: "Why Groundwork" },
  { href: "#how", label: "How it works" },
  { href: "#who", label: "Who we are" },
];

export function Nav() {
  return (
    <header>
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-6 px-6 py-[22px] desk:px-8">
        <div className="flex min-w-0 items-center gap-11">
          <a
            href="#top"
            className="flex items-center gap-2 text-[19px] font-semibold tracking-[-0.02em] text-ink"
          >
            <span className="inline-block size-[14px] rounded-[3px] bg-ink" />
            Groundwork
          </a>
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
            href="#signin"
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
        className="mx-auto flex max-w-[1200px] gap-5 overflow-x-auto px-6 pb-3 desk:hidden"
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
        <a href="#signin" className="shrink-0 text-[13px] font-medium text-secondary sm:hidden">
          Sign in
        </a>
      </nav>
    </header>
  );
}
