"use client";

import { useEffect, useId, useRef, useState } from "react";

import type { StageProgress } from "@/lib/app-data";

const GREEN = "#1F8A4C";
const GREEN_LEFT = "#176B3B";
const GREEN_RIGHT = "#0E3D22";
const EDGE = "#D6D6D3";

/** Punchy labels that fit the isometric faces. */
const STACK_LABEL: Record<number, string> = {
  1: "Register",
  2: "Taxes",
  3: "Setup",
  4: "Cover",
  5: "Paid",
  6: "Tools",
  7: "Found",
};

/** True 2:1 isometric. */
const BW = 124;
const BV = 62;
const BH = 40;
const SW = 158;
const SV = 79;
const SH = 26;
const CX = 300;
const BASE_T = 300;
const STAGE_COUNT = 7;

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
  return BASE_T + BH - SH + 4;
}

const padX = 28;
const padTop = 20;
const padBottom = 18;
const contentTop = blockT(STAGE_COUNT - 1) - padTop;
const contentBottom = slabT() + 2 * SV + SH + padBottom;
const contentLeft = CX - SW - padX;
const contentRight = CX + SW + padX;
const VIEW_W = contentRight - contentLeft;
const VIEW_H = contentBottom - contentTop;

type Props = {
  stages: StageProgress[];
  highlightStage?: number | null;
  onHoverStage?: (stage: number | null) => void;
  onSelectStage?: (stage: number) => void;
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
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
        gsap.set(blocks, { y: (i: number) => -32 - i * 12, opacity: 0 });
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
  }, [mounted, settleOnce]);

  const ordered = [...stages].sort((a, b) => a.stage - b.stage);
  const shadowY = slabT() + 2 * SV + SH - 2;

  if (!mounted) {
    return (
      <div
        className={`relative mx-auto w-full max-w-[440px] ${className}`}
        style={{ aspectRatio: `${VIEW_W} / ${VIEW_H}` }}
        aria-hidden
      />
    );
  }

  return (
    <div
      ref={rootRef}
      className={`relative mx-auto w-full max-w-[440px] ${className}`}
    >
      <svg
        viewBox={`${contentLeft} ${contentTop} ${VIEW_W} ${VIEW_H}`}
        className="block h-auto w-full"
        role="img"
        aria-label="Progress stack across seven stages"
      >
        <defs>
          <filter
            id={`dash-shadow-${uid}`}
            x="-30%"
            y="-30%"
            width="160%"
            height="160%"
          >
            <feGaussianBlur stdDeviation="5" />
          </filter>
        </defs>

        {/* Isometric footprint shadow, tucked under the slab */}
        <path
          d={topFace(CX, shadowY - SV * 0.15, SW * 0.9, SV * 0.55)}
          fill="rgba(17,17,17,0.12)"
          filter={`url(#dash-shadow-${uid})`}
        />

        <g className="dash-slab">
          <path d={leftFace(CX, slabT(), SW, SV, SH)} fill={GREEN_LEFT} />
          <path d={rightFace(CX, slabT(), SW, SV, SH)} fill={GREEN_RIGHT} />
          <path d={topFace(CX, slabT(), SW, SV)} fill={GREEN} />
          <text
            textAnchor="middle"
            dominantBaseline="middle"
            fill="rgba(255,255,255,0.92)"
            transform={`translate(${CX + SW * 0.48}, ${slabT() + 1.45 * SV + SH * 0.45}) skewY(-26.57)`}
            style={{
              fontFamily:
                "var(--font-jetbrains), 'JetBrains Mono', ui-monospace, Menlo, monospace",
              fontSize: "9px",
              fontWeight: 500,
              letterSpacing: "0.22em",
            }}
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
          const strokeWidth = isNext || isHot ? 2 : 1.1;
          const faceCx = CX + BW * 0.48;
          const faceCy = t + 1.45 * BV + BH * 0.42;
          const label = STACK_LABEL[stage.stage] ?? stage.short;

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
                : "#F6F6F4";
          const fillRight =
            stage.fill === "complete"
              ? GREEN_RIGHT
              : stage.fill === "partial"
                ? "#5BB884"
                : "#ECECE9";
          const labelFill =
            stage.fill === "complete" ? "#FFFFFF" : isNext || isHot ? "#111111" : "#6B6B70";

          return (
            <g
              key={stage.stage}
              className="dash-block"
              style={{ cursor: "pointer" }}
              onMouseEnter={() => onHoverStage?.(stage.stage)}
              onMouseLeave={() => onHoverStage?.(null)}
              onClick={() => onSelectStage?.(stage.stage)}
            >
              <path
                d={leftFace(CX, t, BW, BV, BH)}
                fill={fillLeft}
                stroke={stroke}
                strokeWidth={strokeWidth}
              />
              <path
                d={rightFace(CX, t, BW, BV, BH)}
                fill={fillRight}
                stroke={stroke}
                strokeWidth={strokeWidth}
              />
              <path
                d={topFace(CX, t, BW, BV)}
                fill={fillTop}
                stroke={stroke}
                strokeWidth={strokeWidth}
              />
              <g transform={`translate(${faceCx}, ${faceCy}) skewY(-26.57)`}>
                <text
                  y={-6}
                  textAnchor="middle"
                  fill={
                    stage.fill === "complete"
                      ? "rgba(255,255,255,0.75)"
                      : isNext
                        ? "#111111"
                        : "#8A8A8E"
                  }
                  style={{
                    fontFamily:
                      "var(--font-jetbrains), 'JetBrains Mono', ui-monospace, Menlo, monospace",
                    fontSize: "8px",
                    fontWeight: 500,
                    letterSpacing: "0.08em",
                  }}
                >
                  {stage.stage}
                </text>
                <text
                  y={8}
                  textAnchor="middle"
                  fill={labelFill}
                  style={{
                    fontFamily: "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
                    fontSize: "12px",
                    fontWeight: 600,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {label}
                </text>
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
