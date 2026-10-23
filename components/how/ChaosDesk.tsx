import type { ReactNode } from "react";

function Bit({
  rot,
  fade,
  className,
  children,
  mobile = true,
}: {
  rot: number;
  fade: number;
  className: string;
  children: ReactNode;
  mobile?: boolean;
}) {
  return (
    <div
      className={`scatter absolute ${mobile ? "" : "hidden desk:block"} ${className}`}
      data-rot={rot}
      data-fade={fade}
    >
      {children}
    </div>
  );
}

const tabs = ["CRA", "GST", "WCB", "Bank", "Quotes", "Email", "PDF"];

export function ChaosDesk() {
  return (
    <div className="chaos-stage relative mt-1 h-[460px] overflow-hidden desk:h-[500px]">

      <Bit
        rot={-7}
        fade={0.88}
        className="top-7 left-[8%] w-[42%] max-w-[156px] desk:top-5"
        mobile={false}
      >
        <GhostWindow title="bookkeeping.xls" lines={["Q1 totals", "Receipts missing"]} />
      </Bit>
      <Bit rot={6} fade={0.9} className="top-9 right-[6%] w-[40%] max-w-[150px]">
        <GhostWindow title="insurance quotes" lines={["Liability $—", "3 providers"]} />
      </Bit>
      <Bit
        rot={-4}
        fade={0.78}
        className="top-[42%] left-[6%] hidden w-[36%] max-w-[138px] desk:block"
      >
        <GhostWindow title="Re: WCB setup" lines={["can you send the form"]} />
      </Bit>

      <div className="absolute top-4 right-0 left-0 z-10 flex justify-center desk:top-3 desk:right-[13%] desk:left-[13%] desk:block">
        <div className="chaos-laptop relative w-[90%] max-w-[380px] desk:w-auto desk:max-w-none">
          <Laptop />
        </div>
      </div>

      <div className="absolute right-0 bottom-0 left-0 z-30 h-[48%]">
        <div className="absolute bottom-[28%] left-[12%] hidden h-[36px] w-[76px] -rotate-[22deg] rounded-[2px] border border-[#E4DFD4] bg-[#F3EFE4] px-1.5 py-1 shadow-[0_10px_16px_-12px_rgba(17,17,17,0.45)] tab:block">
          <span className="mono text-[7px] tracking-wide text-muted">WCB</span>
          <span className="mt-0.5 block h-[2px] w-[80%] bg-[#E0D9CC]" />
          <span className="mt-0.5 block h-[2px] w-[54%] bg-[#E0D9CC]" />
        </div>
        <Paper className="absolute bottom-[40%] left-[16%] w-[138px] rotate-[-12deg] desk:left-[15%]">
          <span className="mono text-[8px] tracking-wide text-muted">GST / HST</span>
          <span className="text-[11px] font-semibold">Registration</span>
          <span className="mt-1.5 h-[3px] w-[78%] rounded-sm bg-[#E4DFD4]" />
          <span className="h-[3px] w-[62%] rounded-sm bg-[#E4DFD4]" />
          <span className="h-[3px] w-[70%] rounded-sm bg-[#E4DFD4]" />
          <span className="mt-2 text-[9px] text-[#B4531F]">incomplete</span>
          <Fold />
        </Paper>
        <Paper className="absolute bottom-[28%] left-[24%] z-10 w-[152px] rotate-[8deg] desk:left-[26%]">
          <div className="flex items-baseline justify-between gap-2">
            <span className="mono text-[8px] tracking-wide">Invoice 0001</span>
            <span className="mono shrink-0 text-[8px] tracking-wide text-muted">Draft</span>
          </div>
          <span className="mt-2 h-[3px] w-[70%] rounded-sm bg-[#E4DFD4]" />
          <span className="h-[3px] w-[54%] rounded-sm bg-[#E4DFD4]" />
          <span className="h-[3px] w-[64%] rounded-sm bg-[#E4DFD4]" />
          <span className="mt-2.5 flex justify-between border-t border-[#EDE8DC] pt-1.5 text-[10px]">
            <span className="text-muted">Total</span>
            <span className="font-semibold">$ —,—</span>
          </span>
          <Fold />
        </Paper>
        <Paper className="absolute right-[8%] bottom-[36%] hidden w-[118px] rotate-[14deg] tab:flex tab:flex-col">
          <span className="block text-[11px] font-semibold">To do</span>
          {["name", "gst???", "insurance", "which app"].map((item) => (
            <span
              key={item}
              className="flex items-center gap-1.5 text-[10px] leading-[1.45] text-secondary"
            >
              <span className="size-[7px] shrink-0 rounded-[1.5px] border border-[#C9C4B8]" />
              {item}
            </span>
          ))}
          <Fold />
        </Paper>
        <Sticky
          tone="yellow"
          className="absolute bottom-[12%] left-[16%] z-20 h-[62px] w-[68px] rotate-[9deg] text-[11px] desk:left-[18%]"
        >
          due Friday
        </Sticky>
        <Sticky
          tone="pink"
          className="absolute right-[12%] bottom-[14%] z-20 h-[58px] w-[64px] rotate-[-8deg] text-[11px]"
        >
          call bank
        </Sticky>
        <Sticky
          tone="yellow"
          className="absolute bottom-[20%] left-[47%] z-30 hidden h-[52px] w-[58px] rotate-[4deg] text-[10px] tab:flex"
        >
          which form
        </Sticky>
        <Pen />
      </div>
    </div>
  );
}

function Laptop() {
  return (
    <div className="relative">
      <div className="chaos-lid relative">
        <Sticky
          tone="yellow"
          className="-top-2 -left-2 z-30 h-[54px] w-[58px] rotate-[-8deg] text-[11px]"
        >
          taxes??
        </Sticky>
        <div className="rounded-[12px] rounded-b-[3px] bg-[#1A1A1C] px-[6px] pt-[5px] pb-[4px] shadow-[0_28px_48px_-24px_rgba(17,17,17,0.55)]">
          <div className="mx-auto mb-[3px] size-[3px] rounded-full bg-[#3A3A40]" />
          <div className="relative overflow-hidden rounded-[6px] bg-[#E8E8E4]">
            <div className="flex h-[22px] items-end gap-px overflow-hidden bg-[#D8D8D2] pl-1.5">
              <span className="mb-1.5 mr-1 flex shrink-0 gap-[3px]">
                <span className="size-[6px] rounded-full bg-[#FF5F57]" />
                <span className="size-[6px] rounded-full bg-[#FEBC2E]" />
                <span className="size-[6px] rounded-full bg-[#28C840]" />
              </span>
              {tabs.map((tab, index) => (
                <span
                  key={tab}
                  className={`flex h-[18px] min-w-0 items-center gap-1 rounded-t-[6px] px-1.5 text-[8px] font-medium whitespace-nowrap ${
                    index === 1 ? "z-[1] bg-white text-ink" : "bg-[#CECEC8] text-secondary"
                  } ${index > 4 ? "hidden tab:flex" : ""}`}
                >
                  <span className="size-1.5 shrink-0 rounded-[2px] bg-[#B8B8B2]" />
                  {tab}
                </span>
              ))}
              <span className="flex h-[18px] items-center rounded-t-[6px] bg-[#C4C4BE] px-1.5 font-mono text-[8px] tracking-wide text-secondary">
                +12
              </span>
            </div>
            <div className="flex h-6 items-center gap-1.5 border-b border-[#E3E3DF] bg-[#F3F3F0] px-2">
              <span className="flex shrink-0 gap-1">
                <span className="size-3 rounded-[3px] border border-[#E0E0DC] bg-white" />
                <span className="size-3 rounded-[3px] border border-[#E0E0DC] bg-white" />
              </span>
              <span className="flex min-w-0 flex-1 items-center gap-1.5 rounded-full bg-white px-2 py-[3px] text-[9px] text-secondary shadow-[inset_0_0_0_1px_#E6E6E2]">
                <svg
                  width="8"
                  height="8"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#8A8A8E"
                  strokeWidth="2.5"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
                <span className="truncate">how to register a business in canada</span>
              </span>
              <span className="rounded-full bg-ink px-1.5 py-px font-mono text-[8px] tracking-wide text-white">
                37
              </span>
            </div>
            <div className="relative h-[92px] bg-[#DCDCD6] desk:h-[100px]">
              <div className="absolute top-1.5 right-1 left-12 overflow-hidden rounded-[5px] border border-[#D0D0CC] bg-white shadow-[0_8px_16px_-12px_rgba(17,17,17,0.45)]">
                <div className="flex items-center gap-1 border-b border-[#F0F0EC] bg-[#F7F7F4] px-1.5 py-0.5">
                  <span className="size-1 rounded-full bg-[#C4C4C0]" />
                  <span className="truncate font-mono text-[7px] tracking-wide text-muted">
                    CRA · RC1.pdf
                  </span>
                </div>
                <div className="space-y-1 px-2 py-1.5">
                  <span className="block h-1 w-[70%] rounded-sm bg-[#ECECEA]" />
                  <span className="block h-1 w-[48%] rounded-sm bg-[#ECECEA]" />
                  <span className="block h-1 w-[58%] rounded-sm bg-[#ECECEA]" />
                </div>
              </div>
              <div className="absolute top-4 right-8 bottom-1.5 left-1.5 overflow-hidden rounded-[6px] border border-[#E4E4E0] bg-[#FBFBFA] shadow-[0_14px_24px_-14px_rgba(17,17,17,0.55)]">
                <div className="flex items-center justify-between px-2.5 pt-1.5">
                  <span className="text-[10px] font-semibold">GST / HST account</span>
                  <span className="mono text-[7px] text-muted">Form RC1</span>
                </div>
                <div className="mt-1.5 flex flex-col gap-1 px-2.5">
                  <span className="h-1.5 w-[72%] rounded-sm bg-[#E8E8E4]" />
                  <span className="h-1.5 w-[58%] rounded-sm bg-[#E8E8E4]" />
                  <span className="h-[18px] rounded-[4px] border border-dashed border-[#C9C9C6] bg-white" />
                </div>
                <div className="absolute right-1.5 bottom-1.5 left-1.5 flex items-center gap-1.5 rounded-[5px] border border-[#E3E6E1] bg-white px-1.5 py-1 shadow-[0_8px_14px_-12px_rgba(17,17,17,0.5)]">
                  <span className="text-[8px] text-muted">Next step:</span>
                  <span className="rounded-[3px] border border-dashed border-[#C9C9C6] px-1 py-px font-mono text-[7px] tracking-wide text-secondary uppercase">
                    unknown
                  </span>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.22)_0%,rgba(255,255,255,0)_36%)]" />
            </div>
          </div>
        </div>
      </div>
      <div className="relative z-10 mx-auto -mt-[3px] h-[8px] w-[94%] rounded-[3px] bg-[linear-gradient(180deg,#2A2A2E_0%,#111_100%)]">
        <div className="absolute top-1/2 left-1/2 h-[3px] w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0A0A0A]" />
      </div>
      <div className="chaos-base relative -mt-[3px]">
        <div className="rounded-t-[4px] rounded-b-[16px] bg-[linear-gradient(180deg,#3A3A40_0%,#2A2A2E_38%,#19191C_100%)] px-4 pt-2.5 pb-3 shadow-[0_28px_44px_-22px_rgba(17,17,17,0.85)]">
          <Keyboard />
          <div className="mx-auto mt-2.5 h-[32px] w-[92px] rounded-[10px] border border-white/10 bg-[#121214] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]" />
        </div>
      </div>
    </div>
  );
}

function Keyboard() {
  const rows = [13, 14, 13, 12];
  return (
    <div className="flex flex-col gap-[3.5px]">
      <div className="flex gap-[3px] px-0.5">
        {Array.from({ length: 13 }, (_, key) => (
          <span
            key={key}
            className="h-[8px] min-w-0 flex-1 rounded-[1.5px] bg-[#0E0E10] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
          />
        ))}
      </div>
      {rows.map((count, row) => (
        <div key={row} className="flex justify-center gap-[3px]">
          {Array.from({ length: count }, (_, key) => (
            <span
              key={key}
              className="h-[12px] max-w-[14px] min-w-0 flex-1 rounded-[2px] bg-[#0E0E10] shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_1px_0_#000]"
            />
          ))}
        </div>
      ))}
      <div className="flex items-center justify-center gap-[3px]">
        <span className="h-[12px] w-[12%] rounded-[2px] bg-[#0E0E10] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]" />
        <span className="h-[12px] w-[44%] rounded-[2px] bg-[#0E0E10] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]" />
        <span className="h-[12px] w-[12%] rounded-[2px] bg-[#0E0E10] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]" />
      </div>
    </div>
  );
}

function GhostWindow({ title, lines }: { title: string; lines: string[] }) {
  return (
    <div className="overflow-hidden rounded-[10px] border border-[#D5D5D0] bg-white/95 shadow-[0_20px_36px_-20px_rgba(17,17,17,0.55)]">
      <div className="flex h-6 items-center gap-1.5 border-b border-[#ECEEEA] bg-[#F1F1ED] px-2">
        <span className="size-1.5 rounded-full bg-[#FF5F57]/70" />
        <span className="size-1.5 rounded-full bg-[#FEBC2E]/70" />
        <span className="size-1.5 rounded-full bg-[#28C840]/70" />
        <span className="truncate font-mono text-[8px] tracking-wide text-secondary uppercase">
          {title}
        </span>
      </div>
      <div className="flex flex-col gap-1 px-2.5 py-2">
        {lines.map((line) => (
          <span key={line} className="text-[10px] text-secondary">
            {line}
          </span>
        ))}
        <span className="h-1 w-[70%] rounded-sm bg-[#ECECEA]" />
        <span className="h-1 w-[48%] rounded-sm bg-[#ECECEA]" />
      </div>
    </div>
  );
}

function Paper({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`absolute flex flex-col gap-1 rounded-[3px] border border-[#E6E1D4] bg-[#FFFEF8] px-2.5 py-2.5 shadow-[0_18px_28px_-16px_rgba(17,17,17,0.5),0_1px_0_#EDE6D6] ${className ?? ""}`}
    >
      {children}
    </div>
  );
}

function Fold() {
  return (
    <span className="pointer-events-none absolute top-0 right-0 size-3 bg-[linear-gradient(135deg,#F3EFE4_50%,transparent_50%)] shadow-[-1px_1px_0_#E6E1D4]" />
  );
}

function Sticky({
  tone,
  className,
  children,
}: {
  tone: "yellow" | "pink";
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`absolute flex items-center justify-center px-1.5 text-center font-medium ${className ?? ""}`}
      style={{
        background:
          tone === "pink"
            ? "linear-gradient(180deg,#F8E2E2 0%,#F0C9C9 100%)"
            : "linear-gradient(180deg,#F8EDB0 0%,#F0DC86 100%)",
        boxShadow:
          "0 12px 18px -12px rgba(17,17,17,0.42), inset 0 -12px 14px -14px rgba(0,0,0,0.16)",
      }}
    >
      <span className="pointer-events-none absolute top-0 left-1/2 h-2 w-5 -translate-x-1/2 bg-[rgba(255,255,255,0.35)] blur-[2px]" />
      {children}
    </div>
  );
}

function Pen() {
  return (
    <div className="absolute bottom-[18%] left-[8%] hidden w-[58px] -rotate-[18deg] tab:block">
      <div className="h-[7px] rounded-full bg-[linear-gradient(90deg,#2A2A2E_0%,#111_18%,#1C1C1E_78%,#C9A227_100%)] shadow-[0_8px_10px_-6px_rgba(17,17,17,0.55)]" />
    </div>
  );
}
