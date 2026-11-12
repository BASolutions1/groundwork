"use client";

import Image from "next/image";

import type { StageProgress } from "@/lib/app-data";

const STACK_LABEL: Record<number, string> = {
  1: "Register",
  2: "Taxes",
  3: "Setup",
  4: "Cover",
  5: "Paid",
  6: "Tools",
  7: "Found",
};

const STACK_IMAGE: Record<number, string> = {
  1: "/hero/dash-stack-1.png",
  2: "/hero/dash-stack-2.png",
  3: "/hero/dash-stack-3.png",
  4: "/hero/dash-stack-4.png",
  5: "/hero/dash-stack-5.png",
  6: "/hero/dash-stack-6.png",
  7: "/hero/dash-stack-7.png",
};

type Props = {
  stages: StageProgress[];
  highlightStage?: number | null;
  onHoverStage?: (stage: number | null) => void;
  onSelectStage?: (stage: number) => void;
  className?: string;
};

function restingStage(stages: StageProgress[]) {
  const current = stages.find((stage) => stage.hasNext);
  if (current) return current.stage;
  const open = stages.find((stage) => stage.fill !== "complete");
  if (open) return open.stage;
  return 7;
}

export function DashboardStack({
  stages,
  highlightStage = null,
  onHoverStage,
  onSelectStage,
  className = "",
}: Props) {
  const active =
    highlightStage && STACK_IMAGE[highlightStage] ? highlightStage : restingStage(stages);
  const label = STACK_LABEL[active] ?? "your list";

  return (
    <div className={`relative mx-auto w-full max-w-[440px] ${className}`}>
      <Image
        src={STACK_IMAGE[active]}
        alt={`Stage ${active}, ${label}, is lit on the Groundwork stack`}
        width={1254}
        height={1254}
        priority
        className="block h-auto w-full"
      />
      <div className="absolute top-[7%] right-[27%] bottom-[24%] left-[27%] flex flex-col">
        {[7, 6, 5, 4, 3, 2, 1].map((stage) => (
          <button
            key={stage}
            type="button"
            aria-label={`Stage ${stage}, ${STACK_LABEL[stage]}`}
            onMouseEnter={() => onHoverStage?.(stage)}
            onMouseLeave={() => onHoverStage?.(null)}
            onFocus={() => onHoverStage?.(stage)}
            onBlur={() => onHoverStage?.(null)}
            onClick={() => onSelectStage?.(stage)}
            className="flex-1 cursor-pointer appearance-none bg-transparent hover:bg-transparent"
          />
        ))}
      </div>
    </div>
  );
}
