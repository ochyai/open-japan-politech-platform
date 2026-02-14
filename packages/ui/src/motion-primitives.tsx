"use client";

import { type ReactNode, useRef } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  AnimatePresence,
  type Variants,
} from "motion/react";

/* ───── FadeIn ───── */
interface FadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  distance?: number;
  duration?: number;
}

export function FadeIn({
  children,
  className,
  delay = 0,
  direction = "up",
  distance = 24,
  duration = 0.5,
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const directionMap = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, ...directionMap[direction] }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}

/* ───── ScrollReveal ───── */
interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  width?: "fit-content" | "100%";
}

export function ScrollReveal({
  children,
  className,
  width = "100%",
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <div ref={ref} style={{ width }} className={className}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/* ───── StaggerGrid / StaggerItem ───── */
const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const staggerItem: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

interface StaggerGridProps {
  children: ReactNode;
  className?: string;
}

export function StaggerGrid({ children, className }: StaggerGridProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={staggerContainer}
      initial="hidden"
      animate={isInView ? "show" : "hidden"}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={className} variants={staggerItem}>
      {children}
    </motion.div>
  );
}

/* ───── PageTransition ───── */
export function PageTransition({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}

/* ───── AnimatedBar ───── */
interface AnimatedBarProps {
  segments: {
    value: number;
    color: string;
    label?: string;
  }[];
  total: number;
  height?: string;
  className?: string;
  /** Optional majority/threshold marker */
  marker?: { position: number; label: string };
}

export function AnimatedBar({
  segments,
  total,
  height = "h-12",
  className,
  marker,
}: AnimatedBarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <div ref={ref} className={className}>
      <div className={`relative flex ${height} w-full overflow-hidden rounded-lg`}>
        {segments.map((seg, i) => (
          <motion.div
            key={i}
            className="flex items-center justify-center text-xs font-bold text-white"
            style={{
              backgroundColor: seg.color,
              minWidth: seg.value > 0 ? "2px" : "0",
            }}
            initial={{ width: "0%" }}
            animate={
              isInView
                ? { width: `${(seg.value / total) * 100}%` }
                : { width: "0%" }
            }
            transition={{
              duration: 0.8,
              delay: i * 0.05,
              type: "spring",
              stiffness: 60,
              damping: 15,
            }}
            title={seg.label}
          >
            {seg.value >= total * 0.05 && (
              <span className="truncate px-1">{seg.label}</span>
            )}
          </motion.div>
        ))}
      </div>
      {marker && (
        <div
          className="absolute top-0 bottom-0 z-10 flex flex-col items-center pointer-events-none"
          style={{ left: `${(marker.position / total) * 100}%` }}
        >
          <motion.div
            className="h-full border-l-2 border-dashed border-gray-800/70"
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            style={{ transformOrigin: "top" }}
          />
          <span className="absolute -top-6 whitespace-nowrap rounded bg-gray-800 px-1.5 py-0.5 text-[10px] font-semibold text-white shadow">
            {marker.label}
          </span>
        </div>
      )}
    </div>
  );
}

export { AnimatePresence, motion };
