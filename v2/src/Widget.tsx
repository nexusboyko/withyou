import { useState } from "react";
import { motion } from "framer-motion";

// ---------- Color palette ----------
const PALETTE = {
  b1: "#2F5D50",
  b2: "#3A6F8F",
  b3: "#E3C77A",
  b4: "#B25C4A",
  b5: "#8E8E8E",
} as const;

// ---------- Shared sizing ----------
const BALL = 56;
const ORBIT_R = 88;

// ---------- Rest layout ----------
const restLayout = {
  b1: { x: 140, y: 160, s: 1 },
  b2: { x: 200, y: 160, s: 1 },
  b3: { x: 140, y: 220, s: 1 },
  b4: { x: 200, y: 220, s: 1 },
  b5: { x: 170, y: 100, s: 1 },
} as const;

type BallId = keyof typeof restLayout;
const BALLS: BallId[] = ["b1", "b2", "b3", "b4", "b5"];

// ---------- Angle relaxation ----------
const MIN_ANGLE = (2 * Math.PI) / 5 * 0.8;

function relaxAngles(angles: number[], minSep: number) {
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

// ---------- Ball component ----------
function Ball({ id, x, y, s, onClick }: { id: BallId; x: number; y: number; s: number; onClick?: () => void }) {
  return (
    <motion.div
      className="absolute rounded-full cursor-pointer"
      style={{ width: BALL, height: BALL, background: PALETTE[id] }}
      animate={{ x, y, scale: s }}
      transition={{ type: "spring", stiffness: 240, damping: 20 }}
      onClick={onClick}
    />
  );
}

// ---------- Version D ----------
export default function VersionD() {
  const [active, setActive] = useState<BallId | "rest">("rest");

  const layout = (() => {
    if (active === "rest") return restLayout;
    const center = restLayout[active];
    const others = BALLS.filter((b) => b !== active);

    const rawAngles = others.map((id) => {
      const h = restLayout[id];
      return Math.atan2(h.y - center.y, h.x - center.x);
    });

    const fixedAngles = relaxAngles(rawAngles, MIN_ANGLE);

    const out: Record<BallId, { x: number; y: number; s: number }> = { ...restLayout };
    out[active] = { ...center, s: 1.4 };

    others.forEach((id, i) => {
      const a = fixedAngles[i];
      out[id] = {
        x: center.x + Math.cos(a) * ORBIT_R,
        y: center.y + Math.sin(a) * ORBIT_R,
        s: 1,
      };
    });

    return out;
  })();

  return (
    <div className="relative" style={{ width: 360, height: 360 }}>
      {BALLS.map((id) => {
        const p = layout[id];
        return <Ball key={id} id={id} x={p.x} y={p.y} s={p.s} onClick={() => setActive((v) => (v === id ? "rest" : id))} />;
      })}
    </div>
  );
}
