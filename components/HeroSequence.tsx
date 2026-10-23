import type { ReactNode } from "react";

const week = [
  ["36%", "#DCEBE1"],
  ["52%", "#DCEBE1"],
  ["44%", "#9FD9B5"],
  ["68%", "#6FBF8C"],
  ["84%", "#1F8A4C"],
  ["100%", "#0E3D22"],
] as const;

export function HeroSequence() {
  return (
    <div
      className="relative h-[500px] overflow-hidden rounded-[20px] bg-[linear-gradient(165deg,#F4F8F5_0%,#D9ECE1_55%,#C3E3D0_100%)] desk:h-[560px]"
      role="img"
      aria-label="A simple dashboard of your registration list, with the next step in front."
    >
      <div className="pointer-events-none absolute -top-16 right-0 size-72 rounded-full bg-[radial-gradient(circle,rgba(31,138,76,0.18)_0%,rgba(31,138,76,0)_70%)]" />

      <div className="absolute top-7 right-3 left-4 overflow-hidden rounded-[14px] border border-white/80 bg-white shadow-[0_24px_50px_-28px_rgba(17,17,17,0.4)] desk:right-4 desk:left-14">
        <WindowBar />
        <div className="grid grid-cols-1 gap-4 p-4 desk:grid-cols-[minmax(0,1fr)_168px] desk:p-5 desk:pb-8">
          <div className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between">
              <span className="text-[13px] font-semibold">Registration</span>
              <span className="mono mono-literal text-[10px]">3 of 6</span>
            </div>
            <div className="mb-1 h-1 overflow-hidden rounded-[2px] bg-[#ECECEA]">
              <div className="h-full w-1/2 bg-[linear-gradient(90deg,#9FD9B5,#1F8A4C)]" />
            </div>
            <Step done>Business name</Step>
            <Step done>Business number</Step>
            <Step done>GST account</Step>
            <Step next>
              WCB registration
              <span className="mono mono-literal ml-auto text-[10px] text-ink">next</span>
            </Step>
          </div>
          <div className="hidden flex-col justify-between rounded-lg border border-[#ECEEEA] px-3 py-3 desk:flex">
            <span className="mono text-[9px]">This week</span>
            <div className="mt-3 flex h-28 items-end gap-1">
              {week.map(([height, color]) => (
                <div
                  key={height + color}
                  className="flex-1 rounded-[2px]"
                  style={{ height, background: color }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-3 z-10 w-[232px] rounded-[14px] border border-[#E3E6E1] bg-white p-3.5 shadow-[0_22px_44px_-16px_rgba(17,17,17,0.45)] desk:bottom-14 desk:left-4">
        <div className="mb-2 flex items-baseline justify-between">
          <span className="text-[13px] font-semibold">Your list</span>
          <span className="mono mono-literal text-[10px]">3 of 8</span>
        </div>
        <div className="mb-2.5 h-1 overflow-hidden rounded-[2px] bg-[#ECECEA]">
          <div className="h-full w-[37%] bg-[linear-gradient(90deg,#9FD9B5,#1F8A4C)]" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Step next>
            WCB
            <span className="mono mono-literal ml-auto text-[10px] text-ink">next</span>
          </Step>
          <Step>
            Insurance
            <span className="ml-auto rounded-[3px] bg-ink px-1.5 py-0.5 text-[10px] font-semibold text-white">
              with us
            </span>
          </Step>
        </div>
        <div className="mt-2.5 flex items-center gap-2 border-t border-[#ECEEEA] pt-2.5">
          <span className="size-6 shrink-0 rounded-full bg-[linear-gradient(135deg,#9FD9B5,#1F8A4C)]" />
          <span className="flex min-w-0 flex-col">
            <span className="text-[11px] font-semibold">Guide</span>
            <span className="mono mono-literal text-[10px]">Checked your GST form</span>
          </span>
        </div>
      </div>
    </div>
  );
}

function WindowBar() {
  return (
    <div className="relative flex h-8 shrink-0 items-center justify-center border-b border-[#ECEEEA] bg-[#F7F8F6]">
      <span className="absolute left-3 flex gap-[5px]">
        <span className="size-[7px] rounded-full bg-[#DADAD7]" />
        <span className="size-[7px] rounded-full bg-[#DADAD7]" />
        <span className="size-[7px] rounded-full bg-[#DADAD7]" />
      </span>
      <span className="h-3 w-36 rounded-[6px] bg-[#ECEEEA]" />
    </div>
  );
}

function Step({
  children,
  done = false,
  next = false,
}: {
  children: ReactNode;
  done?: boolean;
  next?: boolean;
}) {
  return (
    <div
      className="row"
      style={{
        padding: "7px 10px",
        fontSize: 12,
        color: done ? "#8A8A8E" : undefined,
        borderColor: next ? "#111111" : undefined,
      }}
    >
      <span
        className="size-3 shrink-0 rounded-full"
        style={
          done
            ? { background: "#1F8A4C" }
            : { border: `1.5px solid ${next ? "#111111" : "#C9C9C6"}` }
        }
      />
      {done ? <span className="line-through">{children}</span> : children}
    </div>
  );
}
