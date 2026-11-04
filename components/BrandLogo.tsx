import Image from "next/image";
import Link from "next/link";

type Props = {
  /** Icon-only mark. Default is icon + “Groundwork” wordmark. */
  iconOnly?: boolean;
  href?: string | null;
  className?: string;
  /** Icon height in px (default 28). */
  iconClassName?: string;
  /** Wordmark text classes. */
  textClassName?: string;
  priority?: boolean;
};

export function BrandLogo({
  iconOnly = false,
  href = "/",
  className = "",
  iconClassName = "h-7 w-auto",
  textClassName = "text-[19px] font-semibold tracking-[-0.02em] text-ink",
  priority = false,
}: Props) {
  const mark = (
    <span className={`inline-flex items-center gap-1.5 ${className}`.trim()}>
      <Image
        src="/brand/logo-icon.png"
        alt={iconOnly ? "Groundwork" : ""}
        width={93}
        height={112}
        priority={priority}
        className={`relative -top-px ${iconClassName}`.trim()}
      />
      {iconOnly ? null : (
        <span className={`relative top-px leading-none ${textClassName}`.trim()}>
          Groundwork
        </span>
      )}
    </span>
  );

  if (href === null) {
    return iconOnly ? mark : <span aria-label="Groundwork">{mark}</span>;
  }

  const linkClass = "inline-flex items-center focus-visible:outline-offset-4";

  if (href.startsWith("#")) {
    return (
      <a href={href} className={linkClass} aria-label="Groundwork home">
        {mark}
      </a>
    );
  }

  return (
    <Link href={href} className={linkClass} aria-label="Groundwork home">
      {mark}
    </Link>
  );
}
