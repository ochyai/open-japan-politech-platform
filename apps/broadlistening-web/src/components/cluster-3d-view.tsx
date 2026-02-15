"use client";

import { useEffect, useRef, useState } from "react";

interface OpinionPoint {
  id: string;
  content: string;
  stance: string;
  clusterId: string;
  clusterLabel: string;
  clusterColor: string;
  fitness: number;
  embedding: number[] | null;
}

interface Cluster3DViewProps {
  opinions: OpinionPoint[];
  className?: string;
}

/** Simple PCA: reduce N-dim to 3-dim using power iteration for top 3 eigenvectors */
function pca3(data: number[][]): number[][] {
  const n = data.length;
  if (n === 0) return [];
  const dim = data[0].length;

  // Center
  const mean = new Array(dim).fill(0);
  for (const row of data) for (let j = 0; j < dim; j++) mean[j] += row[j] / n;
  const centered = data.map((row) => row.map((v, j) => v - mean[j]));

  function project(axis: number[]): number[] {
    return centered.map((row) => row.reduce((s, v, j) => s + v * axis[j], 0));
  }

  function powerIteration(deflected: number[][]): number[] {
    let vec = new Array(dim).fill(0).map(() => Math.random() - 0.5);
    for (let iter = 0; iter < 50; iter++) {
      const scores = deflected.map((row) => row.reduce((s, v, j) => s + v * vec[j], 0));
      const newVec = new Array(dim).fill(0);
      for (let i = 0; i < n; i++)
        for (let j = 0; j < dim; j++) newVec[j] += scores[i] * deflected[i][j];
      const norm = Math.sqrt(newVec.reduce((s, v) => s + v * v, 0)) || 1;
      vec = newVec.map((v) => v / norm);
    }
    return vec;
  }

  const results: number[][] = [];
  const current = centered.map((r) => [...r]);

  for (let axis = 0; axis < 3; axis++) {
    const pc = powerIteration(current);
    const scores = project(pc);
    results.push(scores);
    // Deflate
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < dim; j++) {
        current[i][j] -= scores[i] * pc[j];
      }
    }
  }

  // Transpose: [3][n] → [n][3]
  return Array.from({ length: n }, (_, i) => [results[0][i], results[1][i], results[2][i]]);
}

function normalizeCoords(points: number[][]): number[][] {
  if (points.length === 0) return [];
  const mins = [Infinity, Infinity, Infinity];
  const maxs = [-Infinity, -Infinity, -Infinity];
  for (const p of points) {
    for (let d = 0; d < 3; d++) {
      if (p[d] < mins[d]) mins[d] = p[d];
      if (p[d] > maxs[d]) maxs[d] = p[d];
    }
  }
  const ranges = mins.map((mn, d) => maxs[d] - mn || 1);
  return points.map((p) => p.map((v, d) => (v - mins[d]) / ranges[d] - 0.5));
}

const STANCE_COLORS: Record<string, string> = {
  FOR: "rgba(52, 211, 153, 0.9)",
  AGAINST: "rgba(251, 113, 133, 0.9)",
  NEUTRAL: "rgba(148, 163, 184, 0.6)",
};

export function Cluster3DView({ opinions, className }: Cluster3DViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const [size, setSize] = useState({ width: 800, height: 600 });
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const dragRef = useRef({ dragging: false, lastX: 0, lastY: 0, rotX: 0, rotY: 0 });

  // Pre-compute 3D positions
  const positions = useRef<number[][]>([]);

  useEffect(() => {
    const withEmbedding = opinions.filter((o) => o.embedding && o.embedding.length > 0);
    if (withEmbedding.length < 3) {
      // Not enough embeddings — use random placement
      positions.current = opinions.map(() => [
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5,
      ]);
      return;
    }

    const embeddings = opinions.map((o) =>
      o.embedding && o.embedding.length > 0
        ? o.embedding
        : new Array(withEmbedding[0].embedding?.length).fill(0).map(() => Math.random() * 0.01),
    );

    const reduced = pca3(embeddings);
    positions.current = normalizeCoords(reduced);
  }, [opinions]);

  // Resize
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0)
          setSize({ width: Math.floor(width), height: Math.floor(height) });
      }
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Mouse interactions
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function onMouseDown(e: MouseEvent) {
      dragRef.current.dragging = true;
      dragRef.current.lastX = e.clientX;
      dragRef.current.lastY = e.clientY;
      setAutoRotate(false);
    }

    function onMouseMove(e: MouseEvent) {
      if (dragRef.current.dragging) {
        const dx = e.clientX - dragRef.current.lastX;
        const dy = e.clientY - dragRef.current.lastY;
        dragRef.current.rotY += dx * 0.005;
        dragRef.current.rotX += dy * 0.005;
        dragRef.current.lastX = e.clientX;
        dragRef.current.lastY = e.clientY;
      } else {
        // Hover detection
        const rect = canvas?.getBoundingClientRect();
        if (!rect) return;
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        let closestIdx: number | null = null;
        let closestDist = 30;
        const cx = size.width / 2;
        const cy = size.height / 2;
        const scale = Math.min(size.width, size.height) * 0.35;
        const elapsed = performance.now() / 1000;
        const ry = autoRotate ? elapsed * 0.3 : dragRef.current.rotY;
        const rx = autoRotate ? 0.3 : dragRef.current.rotX;

        for (let i = 0; i < positions.current.length; i++) {
          const [px, py, pz] = positions.current[i];
          const cosY = Math.cos(ry),
            sinY = Math.sin(ry);
          const cosX = Math.cos(rx),
            sinX = Math.sin(rx);
          const x1 = px * cosY - pz * sinY;
          const z1 = px * sinY + pz * cosY;
          const y1 = py * cosX - z1 * sinX;
          const sx = cx + x1 * scale;
          const sy = cy + y1 * scale;
          const dist = Math.sqrt((mx - sx) ** 2 + (my - sy) ** 2);
          if (dist < closestDist) {
            closestDist = dist;
            closestIdx = i;
          }
        }
        setHoverIdx(closestIdx);
      }
    }

    function onMouseUp() {
      dragRef.current.dragging = false;
    }
    function onMouseLeave() {
      dragRef.current.dragging = false;
      setHoverIdx(null);
    }
    function onDblClick() {
      setAutoRotate(true);
    }

    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("mouseleave", onMouseLeave);
    canvas.addEventListener("dblclick", onDblClick);
    return () => {
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      canvas.removeEventListener("dblclick", onDblClick);
    };
  }, [size, autoRotate]);

  // Render loop
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
      const cx = w / 2;
      const cy = h / 2;
      const scale = Math.min(w, h) * 0.35;
      const elapsed = performance.now() / 1000;

      // Background
      ctx.fillStyle = "#060612";
      ctx.fillRect(0, 0, w, h);

      // Subtle grid sphere
      ctx.strokeStyle = "rgba(255,255,255,0.02)";
      ctx.lineWidth = 0.5;
      for (let ring = 0.2; ring <= 1; ring += 0.2) {
        ctx.beginPath();
        ctx.arc(cx, cy, ring * scale, 0, Math.PI * 2);
        ctx.stroke();
      }

      const ry = autoRotate ? elapsed * 0.3 : dragRef.current.rotY;
      const rx = autoRotate ? 0.3 + Math.sin(elapsed * 0.1) * 0.1 : dragRef.current.rotX;
      const cosY = Math.cos(ry),
        sinY = Math.sin(ry);
      const cosX = Math.cos(rx),
        sinX = Math.sin(rx);

      // Project all points
      const projected = positions.current.map(([px, py, pz], i) => {
        const x1 = px * cosY - pz * sinY;
        const z1 = px * sinY + pz * cosY;
        const y1 = py * cosX - z1 * sinX;
        const z2 = py * sinX + z1 * cosX;
        return { sx: cx + x1 * scale, sy: cy + y1 * scale, z: z2, idx: i };
      });

      // Sort by depth (far first)
      projected.sort((a, b) => a.z - b.z);

      // Draw connections between same-cluster opinions (faint lines)
      ctx.globalAlpha = 0.04;
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const oi = opinions[projected[i].idx];
          const oj = opinions[projected[j].idx];
          if (oi.clusterId && oi.clusterId === oj.clusterId) {
            const dist = Math.sqrt(
              (projected[i].sx - projected[j].sx) ** 2 + (projected[i].sy - projected[j].sy) ** 2,
            );
            if (dist < 200) {
              ctx.strokeStyle = oi.clusterColor || "#22d3ee";
              ctx.lineWidth = 0.5;
              ctx.beginPath();
              ctx.moveTo(projected[i].sx, projected[i].sy);
              ctx.lineTo(projected[j].sx, projected[j].sy);
              ctx.stroke();
            }
          }
        }
      }
      ctx.globalAlpha = 1;

      // Draw points
      for (const p of projected) {
        const op = opinions[p.idx];
        const isHovered = p.idx === hoverIdx;
        const depthFactor = 0.5 + (p.z + 0.5) * 0.5;
        const baseRadius = 2.5 + op.fitness * 5;
        const r = isHovered ? baseRadius * 1.8 : baseRadius * depthFactor;

        const color = op.clusterColor || (STANCE_COLORS[op.stance] ?? STANCE_COLORS.NEUTRAL);

        // Glow
        if (isHovered || op.fitness > 0.6) {
          ctx.shadowColor = color;
          ctx.shadowBlur = isHovered ? 20 : 8;
        }

        ctx.beginPath();
        ctx.arc(p.sx, p.sy, r, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = isHovered ? 1 : 0.3 + depthFactor * 0.5;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;

        // Label for hovered
        if (isHovered) {
          const label = op.content.length > 50 ? `${op.content.slice(0, 50)}…` : op.content;
          ctx.font = "bold 11px system-ui, sans-serif";
          ctx.textAlign = "center";
          const metrics = ctx.measureText(label);
          const pillW = metrics.width + 20;
          const pillH = 28;
          const lx = p.sx;
          const ly = p.sy - r - 20;

          ctx.fillStyle = "rgba(6, 6, 18, 0.92)";
          ctx.strokeStyle = color;
          ctx.lineWidth = 1;
          roundRect(ctx, lx - pillW / 2, ly - pillH / 2, pillW, pillH, 8);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = "#f1f5f9";
          ctx.fillText(label, lx, ly + 1);

          // Cluster label below
          if (op.clusterLabel) {
            ctx.font = "bold 8px system-ui, sans-serif";
            ctx.fillStyle = color;
            ctx.fillText(op.clusterLabel, lx, ly + pillH / 2 + 10);
          }
        }
      }

      // Cluster labels floating
      const clusterMap = new Map<
        string,
        { x: number; y: number; count: number; color: string; label: string }
      >();
      for (const p of projected) {
        const op = opinions[p.idx];
        if (!op.clusterId) continue;
        const entry = clusterMap.get(op.clusterId) ?? {
          x: 0,
          y: 0,
          count: 0,
          color: op.clusterColor || "#22d3ee",
          label: op.clusterLabel,
        };
        entry.x += p.sx;
        entry.y += p.sy;
        entry.count++;
        clusterMap.set(op.clusterId, entry);
      }

      for (const cluster of clusterMap.values()) {
        if (!cluster.label || cluster.count < 2) continue;
        const avgX = cluster.x / cluster.count;
        const avgY = cluster.y / cluster.count;
        ctx.font = "bold 10px system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.fillStyle = cluster.color;
        ctx.globalAlpha = 0.5;
        ctx.fillText(cluster.label, avgX, avgY - 20);
        ctx.globalAlpha = 1;
      }

      // Legend
      ctx.fillStyle = "rgba(6, 6, 18, 0.9)";
      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      ctx.lineWidth = 1;
      roundRect(ctx, 10, 10, 200, 48, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.font = "bold 10px system-ui, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("3D Embedding Clusters", 20, 26);
      ctx.fillStyle = "rgba(255,255,255,0.25)";
      ctx.font = "9px system-ui, sans-serif";
      ctx.fillText(`${opinions.length} opinions • drag to rotate`, 20, 42);

      animRef.current = requestAnimationFrame(render);
    };

    animRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animRef.current);
  }, [opinions, size, hoverIdx, autoRotate]);

  return (
    <div
      ref={containerRef}
      className={`relative h-full w-full ${className ?? ""}`}
      style={{ minHeight: 400, cursor: "grab" }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: size.width, height: size.height }}
        className="block"
      />
    </div>
  );
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
