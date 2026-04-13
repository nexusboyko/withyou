import { HouseIcon, ClockIcon, MonitorIcon, GearIcon, CircleIcon } from "../../icons";
import { BallConfig, BallPosition } from "./types";

// Animation values preserved from original App.tsx
export const ANIMATION = {
  spring: { stiffness: 600, damping: 30 },
  hover: { scale: 1.1 },
  tap: { scale: 0.9 },
};

// Layout configuration from v2/buddy.tsx - EXACT values
export const LAYOUT = {
  ballSize: 80,
  orbitRadius: 110,
  restGap: 10,
  containerWidth: 340,
  containerHeight: 380,
  offsetX: -40,
  offsetY: -40,
};

// Ball configurations
export const BALL_CONFIGS: BallConfig[] = [
  { id: "hub", color: "#2F5D50", name: "Hub", Icon: HouseIcon, cssClass: "btn-green" },
  { id: "focus", color: "#3A6F8F", name: "Focus", Icon: ClockIcon, cssClass: "btn-blue" },
  { id: "system", color: "#E3C77A", name: "System", Icon: MonitorIcon, cssClass: "btn-orange" },
  { id: "placeholder", color: "#B25C4A", name: "More", Icon: CircleIcon, cssClass: "btn-red" },
  { id: "settings", color: "#8E8E8E", name: "Settings", Icon: GearIcon, cssClass: "btn-gray" },
];

// Rest positions for the 5-ball layout (top ball + 2x2 grid below)
export function calculateRestPositions(): Record<string, BallPosition> {
  const { ballSize, restGap } = LAYOUT;
  return {
    hub: { x: 90, y: 0, scale: 1 },
    focus: { x: 40, y: restGap + ballSize, scale: 1 },
    system: { x: 140, y: restGap + ballSize, scale: 1 },
    placeholder: { x: 40, y: (restGap + ballSize) * 2, scale: 1 },
    settings: { x: 140, y: (restGap + ballSize) * 2, scale: 1 },
  };
}

// Minimum angle separation for orbiting balls
export const MIN_ANGLE = (2 * Math.PI) / 5 * 0.8;

// Angle relaxation algorithm from v2/buddy.tsx
export function relaxAngles(angles: number[], minSep: number): number[] {
  const a = [...angles];
  const n = a.length;
  for (let i = 0; i < n; i++) a[i] = (a[i] + Math.PI * 2) % (Math.PI * 2);
  const idx = a.map((v, i) => ({ v, i })).sort((x, y) => x.v - y.v);
  for (let pass = 0; pass < 4; pass++) {
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      const cur = idx[i].v;
      let next = idx[j].v;
      if (j === 0) next += Math.PI * 2;
      const d = next - cur;
      if (d < minSep) {
        const push = (minSep - d) / 2;
        idx[i].v -= push;
        idx[j].v += push;
      }
    }
  }
  const out = new Array(n).fill(0);
  idx.forEach(({ v, i }) => (out[i] = v));
  return out;
}

// Focus timer defaults (in seconds)
export const TIMER_DEFAULTS = {
  workDuration: 25 * 60, // 25 minutes
  breakDuration: 5 * 60, // 5 minutes
};
