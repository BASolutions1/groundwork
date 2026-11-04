"use client";

import { useEffect, useId, useRef } from "react";

import type { StageProgress } from "@/lib/app-data";

const GREEN = "#1F8A4C";
const GREEN_LEFT = "#176B3B";
const GREEN_RIGHT = "#0E3D22";
const EDGE = "#DADAD7";
const DOT = "#ECECE9";

const BW = 120;
const BV = 60;
const BH = 40;
const SW = 156;
const SV = 78;
const SH = 26;
const CX = 320;
const BASE_T = 310;

function pt(x: number, y: number) {
  return `${x.toFixed(1)},${y.toFixed(1)}`;
}

function leftFace(cx: number, t: number, w: number, v: number, h: number) {
  return `M${pt(cx - w, t + v)} L${pt(cx, t + 2 * v)} L${pt(cx, t + 2 * v + h)} L${pt(cx - w, t + v + h)} Z`;
}

function rightFace(cx: number, t: number, w: number, v: number, h: number) {
  return `M${pt(cx, t + 2 * v)} L${pt(cx + w, t + v)} L${pt(cx + w, t + v + h)} L${pt(cx, t + 2 * v + h)} Z`;
}

function topFace(cx: number, t: number, w: number, v: number) {
  return `M${pt(cx, t)} L${pt(cx + w, t + v)} L${pt(cx, t + 2 * v)} L${pt(cx - w, t + v)} Z`;
}

function blockT(i: number) {
  return BASE_T - i * BH;
}

function slabT() {
  return BASE_T + BH - SH + 6;
}

type Props = {
  stages: StageProgress[];
  highlightStage?: number | null;
  onHoverStage?: (stage: number | null) => void;
  onSelectStage?: (stage: number) => void;
  /** Play settle-in once for brand-new accounts. */
  settleOnce?: boolean;
  className?: string;
};

export function DashboardStack({
  stages,
  highlightStage = null,
  onHoverStage,
  onSelectStage,
  settleOnce = false,
  className = "",
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const played = useRef(false);
  const uid = useId().replace(/:/g, "");

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!settleOnce || played.current) return;
    played.current = true;

    let revert: (() => void) | undefined;
    let cancelled = false;

    void (async () => {
      const { default: gsap } = await import("gsap");
      if (cancelled || !rootRef.current) return;
      const blocks = gsap.utils.toArray<SVGGElement>(".dash-block", root);
      const ctx = gsap.context(() => {
        gsap.set(blocks, { y: (i) => -40 - i * 18, opacity: 0 });
        gsap.to(blocks, {
          y: 0,
          opacity: 1,
          duration: 0.55,
          stagger: 0.07,
          ease: "power2.out",
        });
      }, root);
      revert = () => ctx.revert();
    })();

    return () => {
      cancelled = true;
      revert?.();
    };
  }, [settleOnce]);

  const ordered = [...stages].sort((a, b) => a.stage - b.stage);

  return (
    <div ref={rootRef} className={`relative w-full ${className}`}>
      <svg
        viewBox="0 40 640 420"
        className="block h-auto w-full overflow-visible"
        role="img"
        aria-label="Groundwork progress stack across seven stages"
      >
        <defs>
          <pattern
            id={`dash-dots-${uid}`}
            width="14"
            height="14"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1.5" cy="1.5" r="1.1" fill={DOT} />
          </pattern>
        </defs>

        <rect x="40" y="60" width="560" height="360" rx="18" fill={`url(#dash-dots-${uid})`} />
        <rect
          x="40"
          y="60"
          width="560"
          height="360"
          rx="18"
          fill="none"
          stroke={EDGE}
          strokeWidth="1"
        />

        {/* Slab */}
        <g className="dash-slab">
          <path d={leftFace(CX, slabT(), SW, SV, SH)} fill={GREEN_LEFT} />
          <path d={rightFace(CX, slabT(), SW, SV, SH)} fill={GREEN_RIGHT} />
          <path d={topFace(CX, slabT(), SW, SV)} fill={GREEN} />
          <text
            x={CX}
            y={slabT() + SV + SH * 0.72}
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="11"
            fontWeight="600"
            letterSpacing="0.18em"
          >
            GROUNDWORK
          </text>
        </g>

        {ordered.map((stage, index) => {
          const t = blockT(index);
          const isNext = stage.hasNext;
          const isHot = highlightStage === stage.stage;
          const stroke =
            isNext ? "#111111" : isHot ? GREEN : stage.fill === "empty" ? EDGE : GREEN;
          const strokeWidth = isNext || isHot ? 2.25 : 1.25;

          const fillTop =
            stage.fill === "complete"
              ? GREEN
              : stage.fill === "partial"
                ? "#9FD9B5"
                : "#FFFFFF";
          const fillLeft =
            stage.fill === "complete"
              ? GREEN_LEFT
              : stage.fill === "partial"
                ? "#7FCAA0"
                : "#F7F7F5";
          const fillRight =
            stage.fill === "complete"
              ? GREEN_RIGHT
              : stage.fill === "partial"
                ? "#5BB884"
                : "#EFEFEE";

          return (
            <g
              key={stage.stage}
              className="dash-block cursor-pointer"
              role="button"
              tabIndex={0}
              aria-label={`${stage.short}: ${stage.done} of ${stage.total} done`}
              onMouseEnter={() => onHoverStage?.(stage.stage)}
              onMouseLeave={() => onHoverStage?.(null)}
              onClick={() => onSelectStage?.(stage.stage)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onSelectStage?.(stage.stage);
                }
              }}
            >
              <path d={leftFace(CX, t, BW, BV, BH)} fill={fillLeft} stroke={stroke} strokeWidth={strokeWidth} />
              <path d={rightFace(CX, t, BW, BV, BH)} fill={fillRight} stroke={stroke} strokeWidth={strokeWidth} />
              <path d={topFace(CX, t, BW, BV)} fill={fillTop} stroke={stroke} strokeWidth={strokeWidth} />
              <text
                x={CX + BW * 0.35}
                y={t + BV * 1.15}
                fill="#111111"
                fontSize="10"
                fontWeight="600"
              >
                {String(stage.stage).padStart(2, "0")} {stage.short}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
