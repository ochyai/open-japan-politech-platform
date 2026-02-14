"use client";

import { useEffect, useRef, useState } from "react";
import { useSpring, motion } from "motion/react";

interface AnimatedCounterProps {
  from?: number;
  to?: number;
  /** @deprecated Use `to` instead */
  end?: number;
  /** Duration in seconds (values > 100 are treated as milliseconds for backwards compat) */
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function AnimatedCounter({
  from = 0,
  to,
  end,
  duration = 2,
  prefix = "",
  suffix = "",
  className = "",
}: AnimatedCounterProps) {
  const target = to ?? end ?? 0;
  // Backwards compat: old API used milliseconds, new API uses seconds
  const durationSec = duration > 100 ? duration / 1000 : duration;

  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(from);
  const [hasStarted, setHasStarted] = useState(false);

  const springValue = useSpring(from, {
    stiffness: 50,
    damping: 20,
    duration: durationSec,
  });

  // IntersectionObserver to trigger animation on scroll into view
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
          springValue.set(target);
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, hasStarted, springValue]);

  // Subscribe to spring value changes
  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      setDisplay(Math.round(latest));
    });
    return unsubscribe;
  }, [springValue]);

  return (
    <motion.span ref={ref} className={className} style={{ fontVariantNumeric: "tabular-nums" }}>
      {prefix}
      {display.toLocaleString()}
      {suffix}
    </motion.span>
  );
}
