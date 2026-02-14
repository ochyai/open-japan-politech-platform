"use client";

import { type ReactNode, useEffect } from "react";

interface SmoothScrollProviderProps {
  children: ReactNode;
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  useEffect(() => {
    let destroyed = false;
    let lenis: { raf: (time: number) => void; destroy: () => void } | null = null;

    import("lenis").then((mod) => {
      if (destroyed) return;
      const Lenis = mod.default;
      lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
        touchMultiplier: 2,
      });

      function raf(time: number) {
        if (destroyed) return;
        lenis!.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    });

    return () => {
      destroyed = true;
      lenis?.destroy();
    };
  }, []);

  return <>{children}</>;
}
