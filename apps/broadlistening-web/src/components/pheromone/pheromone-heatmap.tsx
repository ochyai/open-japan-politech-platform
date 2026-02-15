"use client";

import { useEffect, useRef, useState } from "react";

interface PheromoneSource {
  id: string;
  x: number;
  y: number;
  intensity: number;
  quality: number;
  content?: string;
  stance?: string;
}

interface PheromoneHeatmapProps {
  sources: PheromoneSource[];
  className?: string;
}

const STANCE_LABEL_COLORS: Record<string, string> = {
  FOR: "rgba(52, 211, 153, 0.85)",
  AGAINST: "rgba(251, 113, 133, 0.85)",
  NEUTRAL: "rgba(200, 200, 220, 0.7)",
};

function qualityToColor(quality: number, alpha: number): string {
  let r: number, g: number, b: number;
  if (quality < 0.5) {
    const t = quality * 2;
    r = 255;
    g = Math.floor(200 * t);
    b = 0;
  } else {
    const t = (quality - 0.5) * 2;
    r = Math.floor(255 * (1 - t));
    g = Math.floor(200 + 55 * t);
    b = Math.floor(50 * t);
  }
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function truncate(s: string, maxLen: number): string {
  if (s.length <= maxLen) return s;
  return `${s.slice(0, maxLen)}…`;
}

export function PheromoneHeatmap({ sources, className }: PheromoneHeatmapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const startTimeRef = useRef<number>(performance.now());
  const [size, setSize] = useState({ width: 800, height: 600 });
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  // Resize
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          setSize({ width: Math.floor(width), height: Math.floor(height) });
        }
      }
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Mouse hover detection
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function onMove(e: MouseEvent) {
      const rect = canvas?.getBoundingClientRect();
      if (!rect) return;
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const padding = 40;
      const drawW = size.width - padding * 2;
      const drawH = size.height - padding * 2;

      let closestIdx: number | null = null;
      let closestDist = 40; // max hover distance

      for (let i = 0; i < sources.length; i++) {
        const cx = padding + sources[i].x * drawW;
        const cy = padding + sources[i].y * drawH;
        const dist = Math.sqrt((mx - cx) ** 2 + (my - cy) ** 2);
        if (dist < closestDist) {
          closestDist = dist;
          closestIdx = i;
        }
      }
      setHoverIdx(closestIdx);
    }

    function onLeave() {
      setHoverIdx(null);
    }

    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);
    return () => {
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, [sources, size]);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const render = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = size.width * dpr;
      canvas.height = size.height * dpr;
      ctx.scale(dpr, dpr);

      const w = size.width;
      const h = size.height;
      const padding = 40;
      const drawW = w - padding * 2;
      const drawH = h - padding * 2;
      const elapsed = (performance.now() - startTimeRef.current) / 1000;

      // Background
      ctx.fillStyle = "#0a0a1a";
      ctx.fillRect(0, 0, w, h);

      // Subtle grid
      ctx.strokeStyle = "rgba(255,255,255,0.02)";
      ctx.lineWidth = 0.5;
      for (let gx = padding; gx <= w - padding; gx += 40) {
        ctx.beginPath();
        ctx.moveTo(gx, padding);
        ctx.lineTo(gx, h - padding);
        ctx.stroke();
      }
      for (let gy = padding; gy <= h - padding; gy += 40) {
        ctx.beginPath();
        ctx.moveTo(padding, gy);
        ctx.lineTo(w - padding, gy);
        ctx.stroke();
      }

      // Additive blending for heatmap
      ctx.globalCompositeOperation = "lighter";

      for (const src of sources) {
        const cx = padding + src.x * drawW;
        const cy = padding + src.y * drawH;

        const pulse = 0.85 + 0.15 * Math.sin(elapsed * 2 + src.x * 10 + src.y * 7);
        const baseRadius = 40 + src.intensity * 80;
        const radius = baseRadius * pulse;
        const alpha = Math.min(0.6, src.intensity * 0.5) * pulse;

        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        grad.addColorStop(0, qualityToColor(src.quality, alpha));
        grad.addColorStop(0.4, qualityToColor(src.quality, alpha * 0.5));
        grad.addColorStop(1, qualityToColor(src.quality, 0));

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Reset composite
      ctx.globalCompositeOperation = "source-over";

      // ── Opinion text labels ──
      // Show top opinions by intensity, and always show hovered
      const sortedByIntensity = [...sources]
        .map((s, i) => ({ ...s, idx: i }))
        .sort((a, b) => b.intensity - a.intensity);

      // Show labels for top N sources + hovered
      const maxLabels = Math.min(sources.length, Math.max(8, Math.floor(sources.length * 0.4)));
      const labelSet = new Set<number>();
      for (let i = 0; i < maxLabels; i++) {
        labelSet.add(sortedByIntensity[i].idx);
      }
      if (hoverIdx !== null) labelSet.add(hoverIdx);

      for (const idx of labelSet) {
        const src = sources[idx];
        if (!src.content) continue;

        const cx = padding + src.x * drawW;
        const cy = padding + src.y * drawH;
        const isHovered = idx === hoverIdx;

        // Determine max label length based on intensity
        const maxLen = isHovered ? 40 : src.intensity > 0.7 ? 25 : 18;
        const label = truncate(src.content, maxLen);

        const fontSize = isHovered ? 12 : src.intensity > 0.7 ? 10 : 8;
        const labelAlpha = isHovered ? 0.95 : 0.25 + src.intensity * 0.45;

        // Text shadow for readability
        ctx.font = `${isHovered ? "bold " : ""}${fontSize}px system-ui, -apple-system, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Background pill for hovered
        if (isHovered) {
          const metrics = ctx.measureText(label);
          const pillW = metrics.width + 16;
          const pillH = fontSize + 10;
          ctx.fillStyle = "rgba(10, 10, 30, 0.9)";
          ctx.strokeStyle = qualityToColor(src.quality, 0.4);
          ctx.lineWidth = 1;
          roundRect(ctx, cx - pillW / 2, cy - 20 - pillH / 2, pillW, pillH, 6);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle =
            STANCE_LABEL_COLORS[src.stance ?? "NEUTRAL"] ?? STANCE_LABEL_COLORS.NEUTRAL;
          ctx.fillText(label, cx, cy - 20);

          // Stance badge below
          if (src.stance) {
            const stanceLabel =
              src.stance === "FOR" ? "賛成" : src.stance === "AGAINST" ? "反対" : "中立";
            ctx.font = "bold 8px system-ui, sans-serif";
            ctx.fillStyle = `${STANCE_LABEL_COLORS[src.stance]}80`;
            ctx.fillText(stanceLabel, cx, cy - 20 + pillH / 2 + 8);
          }
        } else {
          // Regular label with text shadow
          const stanceColor =
            STANCE_LABEL_COLORS[src.stance ?? "NEUTRAL"] ?? STANCE_LABEL_COLORS.NEUTRAL;
          // Parse the rgba to adjust alpha
          const baseColor = stanceColor.replace(/[\d.]+\)$/, `${labelAlpha})`);

          ctx.shadowColor = "rgba(0,0,0,0.8)";
          ctx.shadowBlur = 4;
          ctx.fillStyle = baseColor;
          ctx.fillText(label, cx, cy - 14 - src.intensity * 8);
          ctx.shadowBlur = 0;
        }

        // Dot indicator at source position
        ctx.beginPath();
        ctx.arc(cx, cy, isHovered ? 5 : 3, 0, Math.PI * 2);
        ctx.fillStyle = qualityToColor(src.quality, isHovered ? 0.9 : 0.5);
        ctx.shadowColor = qualityToColor(src.quality, 0.6);
        ctx.shadowBlur = isHovered ? 12 : 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Color bar legend
      drawColorBar(ctx, w, h);

      // Info legend
      drawInfoLegend(ctx, sources.length);

      animRef.current = requestAnimationFrame(render);
    };

    animRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animRef.current);
  }, [sources, size, hoverIdx]);

  return (
    <div
      ref={containerRef}
      className={`relative h-full w-full ${className ?? ""}`}
      style={{ minHeight: 400, cursor: "crosshair" }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: size.width, height: size.height }}
        className="block"
      />
    </div>
  );
}

function drawColorBar(ctx: CanvasRenderingContext2D, w: number, _h: number) {
  const barX = w - 50;
  const barY = 60;
  const barW = 16;
  const barH = 160;

  ctx.fillStyle = "rgba(10, 10, 26, 0.9)";
  ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
  ctx.lineWidth = 1;
  roundRect(ctx, barX - 10, barY - 30, barW + 20, barH + 60, 6);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
  ctx.font = "bold 9px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Quality", barX + barW / 2, barY - 14);

  const steps = 40;
  for (let i = 0; i < steps; i++) {
    const t = i / steps;
    const quality = 1 - t;
    const y = barY + t * barH;
    const segH = barH / steps + 1;
    ctx.fillStyle = qualityToColor(quality, 0.9);
    ctx.fillRect(barX, y, barW, segH);
  }

  ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
  ctx.lineWidth = 1;
  ctx.strokeRect(barX, barY, barW, barH);

  ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
  ctx.font = "8px monospace";
  ctx.textAlign = "right";
  ctx.fillText("1.0", barX - 4, barY + 4);
  ctx.fillText("0.5", barX - 4, barY + barH / 2 + 3);
  ctx.fillText("0.0", barX - 4, barY + barH + 4);
}

function drawInfoLegend(ctx: CanvasRenderingContext2D, count: number) {
  const lx = 12;
  const ly = 12;

  ctx.fillStyle = "rgba(10, 10, 26, 0.9)";
  ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
  ctx.lineWidth = 1;
  roundRect(ctx, lx, ly, 200, 85, 6);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "rgba(255, 255, 255, 0.65)";
  ctx.font = "bold 10px system-ui, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("Pheromone Heatmap", lx + 10, ly + 16);

  ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
  ctx.font = "9px system-ui, sans-serif";
  ctx.fillText(`${count} opinions • hover to inspect`, lx + 10, ly + 32);
  ctx.fillText("Brightness = pheromone intensity", lx + 10, ly + 48);
  ctx.fillText("Color = quality (red→green)", lx + 10, ly + 62);
  ctx.fillText("Text = opinion content", lx + 10, ly + 76);
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
