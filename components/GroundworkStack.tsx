"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { STAGES, type Stage } from "./hero/stages";

const CURRENT_INDEX = 2; // 03 Get paid

const GREEN = "#1F8A4C";
const GREEN_LEFT = "#176B3B";
const GREEN_RIGHT = "#0E3D22";
const DOT = "#ECECE9";
const EDGE = "#DADAD7";

/** True 2:1 isometric: W = 2V. */
const BW = 140;
const BV = 70;
const BH = 54;
const SW = 180;
const SV = 90;
const SH = 30;

const CX = 380;
const BASE_T = 268;

export type GroundworkStackMode = "page" | "screen";

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
  return BASE_T + BH - SH + 8;
}

function RoleIcon({
  icon,
  stroke = "#FFFFFF",
}: {
  icon: Stage["person"]["icon"];
  stroke?: string;
}) {
  const common = {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke,
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (icon) {
    case "accountant":
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M7 8h6M7 12h10M7 16h4" />
        </svg>
      );
    case "insurance":
      return (
        <svg {...common}>
          <path d="M12 3 5 6v5c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case "guide":
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5 19c1.5-3 4-4.5 7-4.5S17.5 16 19 19" />
        </svg>
      );
    case "web":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.5 2.8 2.5 15.2 0 18M12 3c-2.5 2.8-2.5 15.2 0 18" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path d="M14 3h5v5M14 8l6-6" />
          <path d="M10 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-4" />
        </svg>
      );
  }
}

function DotGrid() {
  const dots: ReactNode[] = [];
  for (let y = 20; y < 540; y += 24) {
    for (let x = 20; x < 740; x += 24) {
      dots.push(<circle key={`${x}-${y}`} cx={x} cy={y} r={1} fill={DOT} />);
    }
  }
  return <g aria-hidden="true">{dots}</g>;
}

function IsoBlock({
  stage,
  indexFromBottom,
  current = false,
  mirrorLabels = false,
}: {
  stage: Stage;
  indexFromBottom: number;
  current?: boolean;
  /** Un-mirror glyphs when the whole stack is flipped horizontally. */
  mirrorLabels?: boolean;
}) {
  const t = blockT(indexFromBottom);
  const done = stage.done;
  const top = done ? "#E7F2EA" : "#FFFFFF";
  const left = done ? "#D6E7DB" : "#F3F3F0";
  const right = done ? "#C5DACB" : "#E6E6E2";
  const topD = topFace(CX, t, BW, BV);
  const faceCx = CX + BW / 2;
  const faceCy = t + 1.5 * BV + BH / 2;
  const labelFlip = mirrorLabels ? " scale(-1,1)" : "";

  return (
    <g className="stack-block" data-index={indexFromBottom}>
      <path
        className="stack-face stack-face-left"
        d={leftFace(CX, t, BW, BV, BH)}
        fill={left}
        stroke={EDGE}
        strokeWidth="1"
      />
      <path
        className="stack-face stack-face-right"
        d={rightFace(CX, t, BW, BV, BH)}
        fill={right}
        stroke={EDGE}
        strokeWidth="1"
      />
      <path
        className="stack-face stack-face-top"
        d={topD}
        fill={top}
        stroke={EDGE}
        strokeWidth="1"
      />
      <path
        className="stack-highlight"
        d={`M${pt(CX - BW, t + BV)} L${pt(CX, t)} L${pt(CX + BW, t + BV)}`}
        fill="none"
        stroke="rgba(255,255,255,0.65)"
        strokeWidth="1"
        strokeLinecap="round"
      />
      {current ? (
        <path
          className="stack-current-outline"
          d={topD}
          fill="none"
          stroke={GREEN}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={100}
          strokeDasharray="26 74"
        />
      ) : null}
      <g
        className="stack-block-label"
        transform={`translate(${faceCx}, ${faceCy}) skewY(-26.57)${labelFlip}`}
      >
        <text
          x={0}
          y={-7}
          textAnchor="middle"
          fill="#111111"
          style={{
            fontFamily: "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
            fontSize: "12px",
            fontWeight: 600,
            letterSpacing: "-0.015em",
          }}
        >
          <tspan
            fill={done ? GREEN : "#8A8A8E"}
            style={{
              fontFamily:
                "var(--font-jetbrains), 'JetBrains Mono', ui-monospace, Menlo, monospace",
              fontSize: "9px",
              fontWeight: 500,
              letterSpacing: "0.08em",
            }}
          >
            {stage.number}{" "}
          </tspan>
          {stage.name}
        </text>
        <text
          x={0}
          y={10}
          textAnchor="middle"
          fill={stage.person.active ? GREEN : "#6B6B70"}
          style={{
            fontFamily: "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
            fontSize: "10px",
            fontWeight: 500,
            letterSpacing: "-0.01em",
          }}
        >
          {stage.person.role}
        </text>
      </g>
    </g>
  );
}

function MobilePeople() {
  return (
    <div className="stack-mobile-people mt-5 flex flex-col gap-2 desk:hidden">
      <span className="mono text-[10px]">Your people</span>
      {STAGES.map((stage) => (
        <div
          key={stage.id}
          className={`flex items-center gap-2.5 rounded-[8px] border bg-white px-3 py-2.5 ${
            stage.person.active ? "border-done" : "border-[#E6E6E4]"
          }`}
        >
          <span
            className={`flex size-8 shrink-0 items-center justify-center rounded-full ${
              stage.person.active ? "bg-done" : "bg-[#ECECEA]"
            }`}
          >
            <RoleIcon
              icon={stage.person.icon}
              stroke={stage.person.active ? "#FFFFFF" : "#55555A"}
            />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[13px] font-semibold">
              {stage.person.role}
            </span>
            <span
              className={`mono block text-[9px] ${
                stage.person.active ? "text-done" : "text-muted"
              }`}
            >
              {stage.person.status}
            </span>
          </span>
          <span className="mono shrink-0 text-[9px] text-muted">
            {stage.number}
          </span>
        </div>
      ))}
    </div>
  );
}

type GroundworkStackProps = {
  mode?: GroundworkStackMode;
  /** Face labels toward the left (toward page copy) or right. */
  face?: "left" | "right";
};

export function GroundworkStack({
  mode = "page",
  face = "right",
}: GroundworkStackProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const filterId = useId().replace(/:/g, "");
  const screen = mode === "screen";
  const faceLeft = face === "left";
  const mirrorTransform = faceLeft ? "translate(760,0) scale(-1,1)" : undefined;
  const labelFlip = faceLeft ? " scale(-1,1)" : "";

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    root.classList.add("stack-prep");

    let revert: (() => void) | undefined;
    let cancelled = false;

    void (async () => {
      const { default: gsap } = await import("gsap");
      if (cancelled || !rootRef.current) return;

      const ctx = gsap.context(() => {
        const drift = root.querySelector(".stack-drift");
        const slab = root.querySelector(".stack-slab");
        const faces = gsap.utils.toArray<SVGPathElement>(".stack-face", root);
        const labels = gsap.utils.toArray<SVGGElement | SVGTextElement>(
          ".stack-block-label, .stack-slab-label, .stack-highlight, .stack-current-outline, .stack-slab-shadow",
          root,
        );
        const blocks = gsap.utils
          .toArray<SVGGElement>(".stack-block", root)
          .sort((a, b) => Number(a.dataset.index) - Number(b.dataset.index));

        if (screen) {
          // Wireframe draw bottom-up, faces fill, then 40° drift loop (16s).
          faces.forEach((face) => {
            const length = face.getTotalLength?.() ?? 240;
            const stroke = face.classList.contains("stack-slab-left")
              ? GREEN_LEFT
              : face.classList.contains("stack-slab-right")
                ? GREEN_RIGHT
                : face.classList.contains("stack-slab-top")
                  ? GREEN
                  : EDGE;
            gsap.set(face, {
              attr: {
                "fill-opacity": 0,
                stroke,
                "stroke-width": 1.25,
                "stroke-dasharray": length,
                "stroke-dashoffset": length,
              },
            });
          });
          gsap.set(labels, { opacity: 0 });
          gsap.set(drift, { transformOrigin: "50% 58%", rotateY: 0 });

          const tl = gsap.timeline({
            repeat: -1,
            defaults: { ease: "power2.out" },
          });

          const pieceOrder = [
            ...gsap.utils.toArray<SVGPathElement>(
              ".stack-slab .stack-face",
              root,
            ),
            ...blocks.flatMap((block) =>
              gsap.utils.toArray<SVGPathElement>(".stack-face", block),
            ),
          ];

          pieceOrder.forEach((face, i) => {
            tl.to(
              face,
              {
                attr: { "stroke-dashoffset": 0 },
                duration: 0.38,
                ease: "power1.inOut",
              },
              0.15 + i * 0.16,
            );
          });

          tl.to(
            faces,
            {
              attr: { "fill-opacity": 1 },
              duration: 0.7,
              ease: "power2.out",
              stagger: 0.04,
            },
            ">-0.2",
          );
          tl.to(labels, { opacity: 1, duration: 0.45 }, ">-0.35");

          tl.to(drift, {
            rotateY: 40,
            duration: 2.8,
            ease: "power1.inOut",
          });
          tl.to(drift, {
            rotateY: 0,
            duration: 2.8,
            ease: "power1.inOut",
          });
          const pad = Math.max(0.4, 16 - tl.duration());
          tl.to({}, { duration: pad });
        } else {
          gsap.set(slab, { opacity: 0, y: 36 });
          gsap.set(blocks, { opacity: 0, y: (i: number) => -(110 + i * 36) });
          const outline = root.querySelector(".stack-current-outline");
          if (outline) gsap.set(outline, { opacity: 0 });

          const tl = gsap.timeline({ delay: 0.2 });
          tl.to(slab, { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" });
          blocks.forEach((block, i) => {
            tl.to(
              block,
              { opacity: 1, y: 0, duration: 0.9, ease: "back.out(1.2)" },
              0.55 + i * 0.42,
            );
          });
          if (outline) {
            tl.to(outline, { opacity: 1, duration: 0.55 }, ">-0.05");
          }
        }
      }, root);

      revert = () => ctx.revert();
    })();

    return () => {
      cancelled = true;
      root.classList.remove("stack-prep");
      revert?.();
    };
  }, [screen]);

  return (
    <div
      ref={rootRef}
      className={`relative w-full ${screen ? "stack-screen-mode" : ""}`}
      style={screen ? { perspective: "900px" } : undefined}
    >
      <div className="stack-drift" style={{ transformStyle: "preserve-3d" }}>
        <svg
          viewBox="0 0 760 560"
          className="stack-diagram block h-auto w-full overflow-visible"
          role="img"
          aria-label="Groundwork stack: five stages from Register to Grow."
        >
          <defs>
            <filter
              id={filterId}
              x="-40%"
              y="-80%"
              width="180%"
              height="260%"
            >
              <feGaussianBlur in="SourceGraphic" stdDeviation="10" />
            </filter>
          </defs>
          <DotGrid />
          <g className="stack-assembled" transform={mirrorTransform}>
            <g className="stack-slab">
              <ellipse
                className="stack-slab-shadow"
                cx={CX}
                cy={slabT() + 2 * SV + SH + 6}
                rx={220}
                ry={34}
                fill="rgba(17,17,17,0.06)"
                filter={`url(#${filterId})`}
              />
              <path
                className="stack-face stack-slab-left"
                d={leftFace(CX, slabT(), SW, SV, SH)}
                fill={GREEN_LEFT}
              />
              <path
                className="stack-face stack-slab-right"
                d={rightFace(CX, slabT(), SW, SV, SH)}
                fill={GREEN_RIGHT}
              />
              <path
                className="stack-face stack-slab-top"
                d={topFace(CX, slabT(), SW, SV)}
                fill={GREEN}
              />
              <text
                className="stack-slab-label"
                textAnchor="middle"
                dominantBaseline="middle"
                fill="rgba(255,255,255,0.9)"
                transform={`translate(${CX + SW / 2}, ${slabT() + 1.5 * SV + SH / 2}) skewY(-26.57)${labelFlip}`}
                style={{
                  fontFamily:
                    "var(--font-jetbrains), 'JetBrains Mono', ui-monospace, Menlo, monospace",
                  fontSize: "10px",
                  fontWeight: 500,
                  letterSpacing: "0.3em",
                }}
              >
                GROUNDWORK
              </text>
            </g>
            {STAGES.map((stage, i) => (
              <IsoBlock
                key={stage.id}
                stage={stage}
                indexFromBottom={i}
                current={i === CURRENT_INDEX}
                mirrorLabels={faceLeft}
              />
            ))}
          </g>
        </svg>
      </div>
      {!screen ? <MobilePeople /> : null}
    </div>
  );
}
