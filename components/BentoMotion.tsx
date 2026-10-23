"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function BentoMotion({ children }: { children: ReactNode }) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let revert: (() => void) | undefined;
    let cancelled = false;

    void (async () => {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (cancelled || !gridRef.current) return;
      gsap.registerPlugin(ScrollTrigger);

      const cards = gridRef.current.querySelectorAll<HTMLElement>(".bento-reveal");
      const ctx = gsap.context(() => {
        gsap.from(cards, {
          opacity: 0,
          y: 28,
          duration: 0.7,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 82%",
          },
        });
      }, gridRef);
      revert = () => ctx.revert();
    })();

    return () => {
      cancelled = true;
      revert?.();
    };
  }, []);

  return (
    <div ref={gridRef} className="grid grid-cols-1 gap-4 desk:grid-cols-6">
      {children}
    </div>
  );
}
