"use client";

import { useEffect, useId, useRef, useState } from "react";

import type { StageProgress } from "@/lib/app-data";

const GREEN = "#1F8A4C";
const GREEN_LEFT = "#176B3B";
const GREEN_RIGHT = "#0E3D22";
const EDGE = "#DADAD7";

/** True 2:1 isometric. */
const BW = 118;
const BV = 59;
const BH = 38;
const SW = 152;
const SV = 76;
const SH = 24;
const CX = 280;
const BASE_T = 286;
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
  return BASE_T + BH - SH + 6;
}

const contentTop = blockT(STAGE_COUNT - 1) - 18;
const contentBottom = slabT() + 2 * SV + SH + 28;
const contentLeft = CX - SW - 36;
const contentRight = CX + BW + 36;
const VIEW_W = contentRight - contentLeft;
const VIEW_H = contentBottom - contentTop;

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
        gsap.set(blocks, { y: (i: number) => -36 - i * 14, opacity: 0 });
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

  // SVG interactive attrs hydrate inconsistently across browsers; render after mount.
  if (!mounted) {
    return (
      <div
        className={`relative mx-auto w-full max-w-[520px] ${className}`}
        style={{ aspectRatio: `${VIEW_W} / ${VIEW_H}` }}
        aria-hidden
      />
    );
  }

  return (
    <div
      ref={rootRef}
      className={`relative mx-auto w-full max-w-[520px] ${className}`}
    >
      <svg
        viewBox={`${contentLeft} ${contentTop} ${VIEW_W} ${VIEW_H}`}
        className="block h-auto w-full overflow-visible"
        role="img"
        aria-label="Groundwork progress stack across seven stages"
      >
        <defs>
          <filter
            id={`dash-shadow-${uid}`}
            x="-40%"
            y="-40%"
            width="180%"
            height="200%"
          >
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" />
          </filter>
        </defs>

        <ellipse
          cx={CX}
          cy={slabT() + 2 * SV + SH + 10}
          rx={200}
          ry={28}
          fill="rgba(17,17,17,0.07)"
          filter={`url(#dash-shadow-${uid})`}
        />

        <g className="dash-slab">
          <path d={leftFace(CX, slabT(), SW, SV, SH)} fill={GREEN_LEFT} />
          <path d={rightFace(CX, slabT(), SW, SV, SH)} fill={GREEN_RIGHT} />
          <path d={topFace(CX, slabT(), SW, SV)} fill={GREEN} />
          <text
            textAnchor="middle"
            dominantBaseline="middle"
            fill="rgba(255,255,255,0.95)"
            transform={`translate(${CX + SW / 2}, ${slabT() + 1.5 * SV + SH / 2}) skewY(-26.57)`}
            style={{
              fontFamily:
                "var(--font-jetbrains), 'JetBrains Mono', ui-monospace, Menlo, monospace",
              fontSize: "10px",
              fontWeight: 500,
              letterSpacing: "0.28em",
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
          const strokeWidth = isNext || isHot ? 2.1 : 1.15;
          const faceCx = CX + BW / 2;
          const faceCy = t + 1.5 * BV + BH / 2;

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
          const labelFill =
            stage.fill === "complete" ? "#FFFFFF" : isNext || isHot ? "#111111" : "#55555A";

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
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={labelFill}
                  style={{
                    fontFamily: "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
                    fontSize: "11px",
                    fontWeight: 600,
                    letterSpacing: "-0.015em",
                  }}
                >
                  <tspan
                    style={{
                      fontFamily:
                        "var(--font-jetbrains), 'JetBrains Mono', ui-monospace, Menlo, monospace",
                      fontSize: "9px",
                      fontWeight: 500,
                      letterSpacing: "0.06em",
                    }}
                  >
                    {String(stage.stage).padStart(2, "0")}{" "}
                  </tspan>
                  {stage.short}
                </text>
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
