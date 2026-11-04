"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { GroundworkStack } from "../GroundworkStack";
import {
  getTransformFromQuad,
  quadPctToPixels,
  SCREEN_QUAD_PCT,
} from "./screenQuad";

type ScreenOverlayProps = {
  imageRef: RefObject<HTMLElement | null>;
  /** Red outline to verify the screen mapping. */
  debugOutline?: boolean;
};

const OVERLAY_W = 1280;
const OVERLAY_H = 800;

function SidebarIcon({
  active = false,
  children,
}: {
  active?: boolean;
  children: ReactNode;
}) {
  return (
    <span
      className={`flex size-9 items-center justify-center rounded-[8px] ${
        active ? "bg-done text-white" : "text-[#8A8A8E]"
      }`}
    >
      {children}
    </span>
  );
}

export function ScreenOverlay({
  imageRef,
  debugOutline = false,
}: ScreenOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("none");

  useLayoutEffect(() => {
    const image = imageRef.current;
    const overlay = overlayRef.current;
    if (!image || !overlay) return;

    const update = () => {
      const w = image.clientWidth;
      const h = image.clientHeight;
      if (w <= 0 || h <= 0) return;
      const quad = quadPctToPixels(SCREEN_QUAD_PCT, w, h);
      setTransform(getTransformFromQuad(OVERLAY_W, OVERLAY_H, quad));
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(image);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [imageRef]);

  useEffect(() => {
    // Keep transform in sync after fonts/layout settle.
    const id = window.setTimeout(() => {
      const image = imageRef.current;
      if (!image) return;
      const w = image.clientWidth;
      const h = image.clientHeight;
      if (w <= 0 || h <= 0) return;
      setTransform(
        getTransformFromQuad(
          OVERLAY_W,
          OVERLAY_H,
          quadPctToPixels(SCREEN_QUAD_PCT, w, h),
        ),
      );
    }, 50);
    return () => window.clearTimeout(id);
  }, [imageRef]);

  return (
    <div
      ref={overlayRef}
      className="hero-screen-overlay pointer-events-none absolute top-0 left-0 origin-top-left"
      style={{
        width: OVERLAY_W,
        height: OVERLAY_H,
        transform,
        background: "#FAFAF8",
        borderRadius: 10,
        boxShadow: debugOutline
          ? "inset 0 0 0 4px #FF0000, 0 0 0 3px #FF0000"
          : "inset 0 0 0 2px rgba(250,250,248,0.9)",
        outline: debugOutline ? "3px solid #FF0000" : undefined,
        outlineOffset: debugOutline ? "-1px" : undefined,
        overflow: "hidden",
        WebkitMaskImage:
          "linear-gradient(#000, #000) content-box, linear-gradient(#000, #000)",
        // Feather edge ~2px via soft inset shadow + slight padding mask feel
        filter: "drop-shadow(0 0 0.5px rgba(250,250,248,0.8))",
      }}
      aria-hidden="true"
    >
      <div className="relative flex h-full w-full overflow-hidden rounded-[10px] bg-[#FAFAF8]">
        <aside className="flex w-[58px] shrink-0 flex-col items-center gap-3 border-r border-[#ECECEA] py-4">
          <SidebarIcon active>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z" />
            </svg>
          </SidebarIcon>
          <SidebarIcon>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 3 4 7v4c0 4.5 3.2 7.6 8 9 4.8-1.4 8-4.5 8-9V7l-8-4Z" />
            </svg>
          </SidebarIcon>
          <SidebarIcon>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 19V9M10 19V5M16 19v-7M22 19V8" />
            </svg>
          </SidebarIcon>
          <SidebarIcon>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
            </svg>
          </SidebarIcon>
          <SidebarIcon>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="8" r="3.5" />
              <path d="M5 19c1.5-3 4-4.5 7-4.5S17.5 16 19 19" />
            </svg>
          </SidebarIcon>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-14 shrink-0 items-center gap-3 border-b border-[#ECECEA] px-5">
            <span className="h-3 w-28 rounded-full bg-[#E8E8E6]" />
            <span className="h-3 w-16 rounded-full bg-[#E8E8E6]" />
            <span className="ml-auto h-8 w-24 rounded-[6px] bg-done" />
          </header>

          <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1.35fr)_minmax(200px,0.65fr)] gap-4 p-4">
            <div className="relative min-h-0 overflow-hidden rounded-[10px] border border-[#ECECEA] bg-white p-3">
              <GroundworkStack mode="screen" />
            </div>

            <div className="flex min-h-0 flex-col gap-3">
              <div className="flex flex-1 flex-col justify-between rounded-[10px] border border-[#ECECEA] bg-white p-3">
                <span className="h-2.5 w-16 rounded-full bg-[#E8E8E6]" />
                <svg viewBox="0 0 160 56" className="mt-2 h-14 w-full" aria-hidden="true">
                  <path
                    d="M4 40 C28 38, 36 18, 56 22 S92 48, 112 28 S140 12, 156 16"
                    fill="none"
                    stroke="#1F8A4C"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <path d="M148 12l8 6-10 2" fill="none" stroke="#1F8A4C" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <div className="flex flex-1 flex-col justify-between rounded-[10px] border border-[#ECECEA] bg-white p-3">
                <span className="h-2.5 w-20 rounded-full bg-[#E8E8E6]" />
                <div className="mt-2 flex h-14 items-end gap-2 px-1">
                  {[40, 62, 48, 78, 56, 70].map((h, i) => (
                    <span
                      key={i}
                      className="flex-1 rounded-sm bg-done/80"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex flex-1 items-center gap-3 rounded-[10px] border border-[#ECECEA] bg-white p-3">
                <svg width="52" height="52" viewBox="0 0 52 52" aria-hidden="true">
                  <circle cx="26" cy="26" r="18" fill="none" stroke="#E8E8E6" strokeWidth="6" />
                  <circle
                    cx="26"
                    cy="26"
                    r="18"
                    fill="none"
                    stroke="#1F8A4C"
                    strokeWidth="6"
                    strokeDasharray="80 113"
                    strokeLinecap="round"
                    transform="rotate(-90 26 26)"
                  />
                </svg>
                <div className="flex flex-col gap-2">
                  <span className="h-2.5 w-16 rounded-full bg-[#E8E8E6]" />
                  <span className="h-2.5 w-10 rounded-full bg-[#E8E8E6]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="pointer-events-none absolute inset-0 rounded-[10px]"
          style={{
            background:
              "linear-gradient(125deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 36%, rgba(255,255,255,0) 58%)",
          }}
        />
      </div>
    </div>
  );
}
