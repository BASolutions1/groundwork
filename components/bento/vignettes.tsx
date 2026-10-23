import type { ReactNode } from "react";
import { GlobeField } from "./GlobeField";

export type VignetteName =
  | "register"
  | "money"
  | "paid"
  | "presence"
  | "tools"
  | "network"
  | "person";

const vignettes: Record<VignetteName, () => ReactNode> = {
  register: RegisterVignette,
  money: MoneyVignette,
  paid: PaidVignette,
  presence: PresenceVignette,
  tools: ToolsVignette,
  network: NetworkVignette,
  person: PersonVignette,
};

export function vignetteFor(name: VignetteName) {
  const View = vignettes[name];
  return <View />;
}

function Dot({ done = false, next = false }: { done?: boolean; next?: boolean }) {
  if (done) return <span className="size-3 shrink-0 rounded-full bg-done" />;
  return (
    <span
      className={`size-3 shrink-0 rounded-full border-[1.5px] ${next ? "tick-next border-ink" : "border-[#C9C9C6]"}`}
    />
  );
}

function WithUs() {
  return (
    <span className="ml-auto rounded-[3px] bg-ink px-[5px] py-0.5 text-[9px] font-semibold text-white">
      with us
    </span>
  );
}

function RegisterVignette() {
  return (
    <div className="absolute -right-10 bottom-[-20px] left-[60px] overflow-hidden rounded-card border border-[#E3E6E1] bg-white shadow-[0_30px_60px_-30px_rgba(17,17,17,0.35)]">
      <div className="relative flex h-[26px] items-center justify-center border-b border-[#ECEEEA] bg-[#F7F8F6]">
        <span className="absolute left-3 flex gap-[5px]">
          <span className="size-[7px] rounded-full bg-[#DADAD7]" />
          <span className="size-[7px] rounded-full bg-[#DADAD7]" />
          <span className="size-[7px] rounded-full bg-[#DADAD7]" />
        </span>
        <span className="h-3 w-[180px] rounded-[6px] bg-[#ECEEEA]" />
      </div>
      <div className="grid grid-cols-[1.2fr_1fr] gap-3.5 px-[18px] pt-4 pb-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-semibold">Registration</span>
            <span className="mono mono-literal text-[10px]">3 of 6</span>
          </div>
          <div className="h-1 overflow-hidden rounded-[2px] bg-[#ECECEA]">
            <div className="pbar h-full w-1/2 bg-[linear-gradient(90deg,#9FD9B5,#1F8A4C)]" />
          </div>
          <RegRow done day="Mon">
            Business name
          </RegRow>
          <RegRow done day="Mon">
            Business number
          </RegRow>
          <RegRow done day="Tue">
            GST account
          </RegRow>
          <div className="row" style={{ padding: "7px 10px", fontSize: 11, borderColor: "#111" }}>
            <Dot next />
            WCB registration
            <span className="mono ml-auto text-[9px] text-ink">next</span>
          </div>
          <div className="row" style={{ padding: "7px 10px", fontSize: 11 }}>
            <Dot />
            Insurance
            <WithUs />
          </div>
        </div>
        <div className="flex flex-col gap-2.5">
          <div className="flex flex-col gap-1 rounded-lg border border-[#ECEEEA] px-3 py-2.5">
            <span className="mono text-[9px]">Days to operating</span>
            <span className="text-[22px] font-semibold tracking-[-0.02em]">
              12 <span className="text-[11px] font-semibold text-done">on track</span>
            </span>
          </div>
          <div className="flex flex-col gap-1.5 rounded-lg border border-[#ECEEEA] px-3 py-2.5">
            <span className="mono text-[9px]">This week</span>
            <WeekBars />
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-[#ECEEEA] px-3 py-2.5">
            <span className="size-6 rounded-full bg-[linear-gradient(135deg,#9FD9B5,#1F8A4C)]" />
            <span className="flex flex-col">
              <span className="text-[11px] font-semibold">Guide</span>
              <span className="mono mono-literal text-[9px]">Checked your GST form</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function RegRow({
  children,
  done,
  day,
}: {
  children: ReactNode;
  done?: boolean;
  day: string;
}) {
  return (
    <div
      className="row"
      style={{ padding: "7px 10px", fontSize: 11, color: done ? "#8A8A8E" : undefined }}
    >
      <Dot done={done} />
      <span className={done ? "line-through" : undefined}>{children}</span>
      <span className="mono ml-auto text-[9px]">{day}</span>
    </div>
  );
}

function WeekBars() {
  const bars = [
    ["0s", "30%", "#DCEBE1"],
    [".15s", "55%", "#DCEBE1"],
    [".3s", "45%", "#DCEBE1"],
    [".45s", "80%", "#1F8A4C"],
    [".6s", "65%", "#1F8A4C"],
    [".75s", "100%", "#1F8A4C"],
    [".9s", "70%", "#DCEBE1"],
  ] as const;
  return (
    <div className="flex h-[34px] items-end gap-[3px]">
      {bars.map(([delay, height, color]) => (
        <div
          key={delay}
          className="bar flex-1 rounded-[2px]"
          style={{ animationDelay: delay, height, background: color }}
        />
      ))}
    </div>
  );
}

function MoneyVignette() {
  const bars = [
    ["0s", "30%", "#DCEBE1"],
    [".12s", "45%", "#DCEBE1"],
    [".24s", "38%", "#DCEBE1"],
    [".36s", "60%", "#DCEBE1"],
    [".48s", "52%", "#9FD9B5"],
    [".6s", "75%", "#6FBF8C"],
    [".72s", "68%", "#1F8A4C"],
    [".84s", "90%", "#1F8A4C"],
    [".96s", "100%", "#0E3D22"],
  ] as const;
  return (
    <div className="absolute -right-2 bottom-[-14px] left-7 flex flex-col gap-3 rounded-card border border-[#E3E6E1] bg-white px-[18px] py-4 shadow-[0_24px_50px_-28px_rgba(17,17,17,0.35)]">
      <div className="flex flex-col gap-0.5">
        <span className="mono text-[9px]">Set aside for GST and tax</span>
        <span className="text-[26px] font-semibold tracking-[-0.03em]">
          $ –,–––{" "}
          <span className="rounded-control bg-[#E7F2EA] px-1.5 py-0.5 align-middle text-[11px] font-semibold text-done">
            on track
          </span>
        </span>
      </div>
      <div className="flex h-[70px] items-end gap-1">
        {bars.map(([delay, height, color]) => (
          <div
            key={delay}
            className="bar flex-1 rounded-[3px]"
            style={{ animationDelay: delay, height, background: color }}
          />
        ))}
      </div>
      <div className="mono flex justify-between">
        <span className="text-[9px]">Jan</span>
        <span className="text-[9px]">Quarterly remittance</span>
      </div>
      <div className="flex flex-col gap-1.5 border-t border-[#ECEEEA] pt-2.5">
        <MoneyLine label="Business account" status="open" />
        <MoneyLine label="Bookkeeping" status="monthly" />
      </div>
    </div>
  );
}

function MoneyLine({ label, status }: { label: string; status: string }) {
  return (
    <div className="flex justify-between text-[11px]">
      <span className="flex items-center gap-1.5">
        <span className="size-1.5 rounded-full bg-done" />
        {label}
      </span>
      <span className="mono text-[9px] text-done">{status}</span>
    </div>
  );
}

function PaidVignette() {
  return (
    <div className="absolute right-5 bottom-0 left-5 h-[230px]">
      <div
        className="inv absolute bottom-[30px] left-0 flex w-[64%] flex-col gap-2 rounded-lg border border-[#E3E6E1] bg-white p-3.5 shadow-[0_10px_24px_-14px_rgba(0,0,0,0.3)]"
      >
        <div className="flex justify-between">
          <span className="mono text-[8px]">Invoice 0001</span>
          <span className="mono text-[8px]">Due 14 days</span>
        </div>
        <div className="h-1 w-[60%] rounded-[2px] bg-[#DADAD7]" />
        <div className="h-1 w-[75%] rounded-[2px] bg-[#ECECEA]" />
        <div className="h-1 w-[45%] rounded-[2px] bg-[#ECECEA]" />
        <div className="h-1 w-[70%] rounded-[2px] bg-[#ECECEA]" />
        <div className="flex justify-between border-t border-[#ECECEA] pt-2">
          <span className="mono text-[8px]">Total</span>
          <span className="text-xs font-semibold">$ ––––</span>
        </div>
      </div>
      <div className="pay absolute -right-2.5 -bottom-2 flex w-[70%] flex-col gap-[9px] rounded-card border border-[#E3E6E1] bg-[linear-gradient(160deg,#FFFFFF_0%,#F3F7F4_100%)] p-3.5 shadow-[0_20px_40px_-18px_rgba(17,17,17,0.4)]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold">Pay invoice</span>
          <span className="text-xs font-semibold">$ ––––</span>
        </div>
        <div className="relative h-[54px] overflow-hidden rounded-lg bg-[linear-gradient(135deg,#0E3D22_0%,#1F8A4C_60%,#6FBF8C_100%)]">
          <span className="absolute top-3 left-3 h-[13px] w-[18px] rounded-[3px] bg-white/85" />
          <span className="mono mono-literal absolute bottom-2.5 left-3 text-[9px] tracking-[0.18em] text-white/90">
            •••• •••• 4417
          </span>
          <span className="absolute top-3 right-3 text-xs text-white/90">)))</span>
        </div>
        <div className="relative h-8">
          <div className="paybtn absolute inset-0 flex items-center justify-center rounded-[7px] bg-ink text-[11px] font-semibold text-white">
            Pay now
          </div>
          <div className="paid absolute inset-0 flex items-center justify-center gap-1.5 rounded-[7px] bg-[#E7F2EA] text-[11px] font-semibold text-ink">
            <span className="inline-flex size-3.5 items-center justify-center rounded-full bg-done">
              <svg
                width="9"
                height="9"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </span>
            Paid
          </div>
        </div>
      </div>
    </div>
  );
}

function PresenceVignette() {
  return (
    <div className="absolute right-3 bottom-2 left-4 grid grid-cols-1 items-start gap-3.5 desk:right-0 desk:left-7 desk:grid-cols-[1.1fr_1fr]">
      <div className="flex flex-col gap-3 rounded-[14px] border border-[#D6E7DB] bg-white p-4 shadow-[0_30px_60px_-30px_rgba(17,17,17,0.4)]">
        <div className="flex gap-2">
          <span className="rounded-pill bg-ink px-[9px] py-1 text-[10px] font-semibold text-white">
            AI mode
          </span>
          <span className="rounded-pill border border-[#E3E6E1] px-[9px] py-1 text-[10px] font-semibold text-secondary">
            Search
          </span>
          <span className="rounded-pill border border-[#E3E6E1] px-[9px] py-1 text-[10px] font-semibold text-secondary">
            Maps
          </span>
        </div>
        <div className="flex items-center gap-2.5 rounded-pill border border-[#E3E6E1] px-3.5 py-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#8A8A8E"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <span className="type border-r-[1.5px] border-ink pr-0.5 text-xs whitespace-nowrap">
            best bakery near me
          </span>
        </div>
        <div className="ans flex items-start gap-1.5">
          <span className="mt-px size-3.5 shrink-0 rounded bg-[linear-gradient(135deg,#9FD9B5,#1F8A4C)]" />
          <p className="m-0 text-[11px] leading-snug text-ink">
            <span className="font-semibold">Your Business Name</span> is a strong option nearby.
            Open now, 5.0 from 24 reviews.
          </p>
        </div>
        <div className="res overflow-hidden rounded-[10px] border border-[#E3E6E1]">
          <div className="relative h-[78px] overflow-hidden bg-[#E4EDE7]">
            <div className="absolute top-[34%] -left-[8%] h-[7px] w-[120%] -rotate-[8deg] bg-white" />
            <div className="absolute top-[68%] -left-[6%] h-[5px] w-[116%] rotate-[4deg] bg-[#F7F8F6]" />
            <div className="absolute -top-[18%] left-[30%] h-[140%] w-[6px] rotate-[16deg] bg-white" />
            <div className="absolute -top-[12%] left-[68%] h-[130%] w-[5px] -rotate-[10deg] bg-[#F4F7F5]" />
            <div className="absolute top-2 right-3 h-7 w-9 rounded-[3px] bg-[#C9E0D2]" />
            <PackPin label="B" className="top-[22%] left-[18%]" />
            <PackPin label="C" className="top-[48%] left-[58%]" />
            <PackPin label="A" className="top-[14%] left-[40%]" primary />
          </div>
          <PackRow
            letter="A"
            name="Your Business Name"
            detail="Bakery · Open · 2.1 km"
            rating="5.0"
            primary
          />
          <PackRow letter="B" hint="Bakery" />
          <PackRow letter="C" hint="Cafe" />
        </div>
      </div>
      <div className="hidden flex-col gap-3 pt-[30px] desk:flex">
        <div className="flex flex-col gap-2.5 rounded-card bg-ink px-4 py-3.5 text-white shadow-[0_20px_40px_-20px_rgba(17,17,17,0.5)]">
          <div className="flex items-baseline justify-between">
            <span className="mono text-[8px]">Local ranking</span>
            <span className="mono text-[8px]">90 days</span>
          </div>
          <svg viewBox="0 0 200 60" width="100%" height="60" aria-hidden="true">
            <defs>
              <linearGradient id="rk" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#1F8A4C" stopOpacity="0.5" />
                <stop offset="1" stopColor="#1F8A4C" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              className="rank-fill"
              d="M0 52 C 30 50, 50 48, 70 40 S 110 30, 130 18 S 170 8, 200 4 L200 60 L0 60 Z"
              fill="url(#rk)"
            />
            <path
              className="rank"
              d="M0 52 C 30 50, 50 48, 70 40 S 110 30, 130 18 S 170 8, 200 4"
              fill="none"
              stroke="#6FBF8C"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-semibold tracking-[-0.02em]">#1</span>
            <span className="mono text-[8px] text-[#6FBF8C]">was page 3</span>
          </div>
        </div>
        <div className="overflow-hidden rounded-card border border-[#D6E7DB] bg-white shadow-[0_16px_30px_-20px_rgba(17,17,17,0.35)]">
          <div className="flex items-center gap-2 border-b border-[#ECEEEA] px-3.5 py-2.5">
            <span className="pulse size-2 rounded-full bg-done" />
            <span className="text-[11px] font-semibold text-ink">Listing live</span>
            <span className="mono ml-auto text-[8px]">Open now</span>
          </div>
          <div className="relative h-24 overflow-hidden bg-[radial-gradient(120%_80%_at_70%_20%,#F3F7F4_0%,#E6EEE8_100%)]">
            <div className="absolute top-[35%] -left-[10%] h-2 w-[120%] -rotate-12 bg-white" />
            <div className="absolute -top-[10%] left-[45%] h-[120%] w-2 rotate-[20deg] bg-white" />
            <div className="absolute top-1/2 left-1/2 size-[70px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(31,138,76,0.3)_0%,rgba(31,138,76,0)_70%)]" />
            <div className="pin absolute top-1/2 left-1/2 size-4 -translate-x-1/2 -translate-y-full rounded-[50%_50%_50%_0] bg-ink shadow-[0_6px_12px_-4px_rgba(0,0,0,0.4)] -rotate-45" />
          </div>
        </div>
      </div>
    </div>
  );
}

function PackPin({
  label,
  primary = false,
  className,
}: {
  label: string;
  primary?: boolean;
  className: string;
}) {
  return (
    <span className={`absolute flex -translate-x-1/2 flex-col items-center ${className}`}>
      <span
        className={`flex size-[15px] items-center justify-center rounded-full text-[8px] font-semibold text-white shadow-[0_2px_4px_rgba(17,17,17,0.25)] ${primary ? "bg-ink" : "bg-[#8A8A8E]"}`}
      >
        {label}
      </span>
      <span
        className={`-mt-px size-0 border-x-[4px] border-t-[5px] border-x-transparent ${primary ? "border-t-ink" : "border-t-[#8A8A8E]"}`}
      />
    </span>
  );
}

function PackRow({
  letter,
  name,
  detail,
  hint,
  rating,
  primary = false,
}: {
  letter: string;
  name?: string;
  detail?: string;
  hint?: string;
  rating?: string;
  primary?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2 border-t border-[#ECEEEA] px-2.5 py-[7px] ${primary ? "bg-[#F3F7F4]" : ""}`}
    >
      <span
        className={`flex size-4 shrink-0 items-center justify-center rounded-full text-[8px] font-semibold text-white ${primary ? "bg-ink" : "bg-[#C9C9C6]"}`}
      >
        {letter}
      </span>
      {name ? (
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-[11px] font-semibold">{name}</span>
          <span className="mono mono-literal truncate text-[8px]">{detail}</span>
        </span>
      ) : (
        <span className="flex min-w-0 flex-1 flex-col gap-1 py-0.5">
          <span className="h-1.5 w-[62%] rounded-[3px] bg-[#C5C5C1]" />
          <span className="mono mono-literal text-[8px] text-muted">{hint}</span>
        </span>
      )}
      {rating ? (
        <span className="shrink-0 text-[10px] font-semibold">
          {rating} <span className="text-[#C4A35A]">★</span>
        </span>
      ) : null}
    </div>
  );
}

function ToolsVignette() {
  return (
    <div className="absolute -right-2.5 -bottom-[70px] -left-2.5">
      <GlobeField />
    </div>
  );
}

function NetworkVignette() {
  return (
    <div className="absolute right-0 bottom-[-16px] left-7 overflow-hidden rounded-card border border-[#E3E6E1] bg-white shadow-[0_24px_50px_-28px_rgba(17,17,17,0.35)]">
      <div className="flex items-center justify-between border-b border-[#ECEEEA] px-3.5 py-3">
        <span className="text-xs font-semibold">Your network</span>
        <span className="mono text-[9px]">
          <span className="intro-count-a">1</span>
          <span className="intro-count-b">2</span> of 4 introduced
        </span>
      </div>
      <Contact
        name="Insurance broker"
        detail="Liability and coverage"
        tone="done"
        status="introduced"
      />
      <div className="flex items-center gap-2.5 border-b border-[#F1F2EF] bg-[#F7F9F7] px-3.5 py-[9px] text-[11px]">
        <span className="size-[22px] shrink-0 rounded-full bg-[#DADAD7]" />
        <span className="flex flex-1 flex-col">
          <span className="font-semibold">Accountant</span>
          <span className="mono mono-literal text-[8px]">Setup, remittances, year end</span>
        </span>
        <span className="mono st-a text-[8px]">not yet</span>
        <span className="mono st-b text-[8px] text-done">introduced</span>
      </div>
      <div className="flex flex-col gap-[7px] border-b border-[#F1F2EF] bg-[#F7F9F7] px-3.5 pt-3 pb-3.5">
        <Bubble who="Guide" tone="green">
          Mark, meet Jordan. Just starting out, needs books set up and GST sorted. Can you
          take them on?
        </Bubble>
        <Bubble who="Mark" tone="ink" align="end">
          Happy to. Jordan, I&apos;ll call you Thursday at 10.
        </Bubble>
        <Bubble who="Jordan" tone="dark">
          Perfect. Thanks both.
        </Bubble>
      </div>
      <Contact
        name="Lawyer"
        detail="Contracts, incorporation"
        tone="idle"
        status="when needed"
        faded
      />
      <div className="flex items-center gap-2.5 px-3.5 py-[9px] text-[11px] opacity-40">
        <span className="size-[22px] rounded-full bg-[#DADAD7]" />
        <span className="font-semibold">Supplier account</span>
      </div>
    </div>
  );
}

function Contact({
  name,
  detail,
  status,
  tone,
  faded = false,
}: {
  name: string;
  detail: string;
  status: string;
  tone: "done" | "idle";
  faded?: boolean;
}) {
  return (
    <div
      className="flex items-center gap-2.5 border-b border-[#F1F2EF] px-3.5 py-[9px] text-[11px]"
      style={{ opacity: faded ? 0.55 : 1 }}
    >
      <span
        className={`size-[22px] shrink-0 rounded-full ${tone === "done" ? "bg-[linear-gradient(135deg,#9FD9B5,#1F8A4C)]" : "bg-[#DADAD7]"}`}
      />
      <span className="flex flex-1 flex-col">
        <span className="font-semibold">{name}</span>
        <span className="mono mono-literal text-[8px]">{detail}</span>
      </span>
      <span className={`mono text-[8px] ${tone === "done" ? "text-done" : ""}`}>{status}</span>
    </div>
  );
}

function Bubble({
  who,
  children,
  tone,
  align = "start",
}: {
  who: string;
  children: ReactNode;
  tone: "green" | "ink" | "dark";
  align?: "start" | "end";
}) {
  const mine = align === "end";
  const delay = who === "Guide" ? "im1" : who === "Mark" ? "im2" : "im3";
  const avatar =
    tone === "green"
      ? "bg-[linear-gradient(135deg,#9FD9B5,#1F8A4C)]"
      : tone === "ink"
        ? "bg-[#DADAD7]"
        : "bg-ink";
  return (
    <div className={`${delay} flex items-start gap-2 ${mine ? "flex-row-reverse" : ""}`}>
      <span className={`size-[18px] shrink-0 rounded-full ${avatar}`} />
      <div
        className={`max-w-[86%] px-2.5 py-[7px] text-[10.5px] leading-[1.45] ${
          mine
            ? "rounded-[10px_10px_3px_10px] bg-ink text-white"
            : "rounded-[10px_10px_10px_3px] border border-[#E3E6E1] bg-white text-ink"
        }`}
      >
        <span className="font-semibold">{who}:</span> {children}
      </div>
    </div>
  );
}

function PersonVignette() {
  return (
    <>
      <div className="pointer-events-none absolute -top-[60px] -right-[60px] size-[220px] rounded-full bg-[radial-gradient(circle,rgba(31,138,76,0.45)_0%,rgba(31,138,76,0)_70%)]" />
      <div className="relative z-[1] mt-auto flex flex-col gap-2">
        <div className="mb-1 flex items-center gap-2">
          <span className="size-[26px] rounded-full bg-[linear-gradient(135deg,#9FD9B5,#1F8A4C)]" />
          <span className="flex flex-col">
            <span className="text-[11px] font-semibold">Guide</span>
            <span className="mono text-[8px] text-[#6E6E73]">Usually replies the same day</span>
          </span>
        </div>
        <div className="msg1 max-w-[88%] self-start rounded-[12px_12px_12px_3px] bg-[#2A2A2E] px-3 py-[9px] text-xs leading-[1.4]">
          Do I need a GST account yet?
        </div>
        <div className="dots -mb-[38px] flex gap-1 self-end rounded-[12px_12px_3px_12px] bg-white px-3 py-2.5">
          <span className="dot" />
          <span className="dot" />
          <span className="dot" />
        </div>
        <div className="msg2 max-w-[88%] self-end rounded-[12px_12px_3px_12px] bg-white px-3 py-[9px] text-xs leading-[1.4] text-ink">
          Once you&apos;re close to the threshold. Takes 10 minutes. Want me to walk you
          through it?
        </div>
      </div>
    </>
  );
}
