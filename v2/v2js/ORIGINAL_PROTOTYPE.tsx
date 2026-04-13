import { useState } from "react";
import { motion } from "framer-motion";

// ---------- Color palette ----------
const PALETTE = {
  b1: "#2F5D50", // forest
  b2: "#3A6F8F", // sea
  b3: "#E3C77A", // coast
  b4: "#B25C4A", // clay
  b5: "#8E8E8E", // rock
} as const;

// ---------- Home layout ----------
const basePositions = {
  rest: {
    b1: { x: 110, y: 0, s: 1 },
    b2: { x: 40, y: 110, s: 1 },
    b3: { x: 180, y: 110, s: 1 },
    b4: { x: 40, y: 220, s: 1 },
    b5: { x: 180, y: 220, s: 1 },
  },
} as const;

type BallId = keyof typeof basePositions["rest"];
const BALLS: BallId[] = ["b1", "b2", "b3", "b4", "b5"];

function Ball({ id, x, y, s, onClick }: { id: BallId; x: number; y: number; s: number; onClick: () => void }) {
  return (
    <motion.div
      className="absolute w-20 h-20 rounded-full cursor-pointer"
      style={{ background: PALETTE[id] }}
      animate={{ x, y, scale: s }}
      transition={{ type: "spring", stiffness: 240, damping: 20 }}
      whileHover={{ scale: s * 1.05 }}
      onClick={onClick}
    />
  );
}

// ---------- Version C (kept) ----------
const ORBIT_R = 110;

function InPlaceFocusPet() {
  const [active, setActive] = useState<BallId | "rest">("rest");

  const getPos = (id: BallId) => {
    const home = basePositions.rest[id];
    if (active === "rest") return home;
    const center = basePositions.rest[active];
    if (id === active) return { x: center.x, y: center.y, s: 1.5 };

    const others = BALLS.filter((b) => b !== active);
    const i = others.indexOf(id);
    const angle = (i / others.length) * Math.PI * 2 - Math.PI / 2;
    return { x: center.x + Math.cos(angle) * ORBIT_R, y: center.y + Math.sin(angle) * ORBIT_R, s: 1 };
  };

  return (
    <div className="relative w-[300px] h-[400px]">
      {BALLS.map((id) => {
        const pos = getPos(id);
        return <Ball key={id} id={id} x={pos.x} y={pos.y} s={pos.s} onClick={() => setActive((p) => (p === id ? "rest" : id))} />;
      })}
    </div>
  );
}

// ---------- Version D: Shortest-path encircle ----------
const MIN_ANGLE = (2 * Math.PI) / 5 * 0.8; // soft minimum separation

function relaxAngles(angles: number[], minSep: number) {
  const a = [...angles];
  const n = a.length;
  // normalize to [0, 2pi)
  for (let i = 0; i < n; i++) a[i] = (a[i] + Math.PI * 2) % (Math.PI * 2);
  // sort with original indices
  const idx = a.map((v, i) => ({ v, i })).sort((x, y) => x.v - y.v);
  // relax in a few passes
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
  // restore order
  const out = new Array(n).fill(0);
  idx.forEach(({ v, i }) => (out[i] = v));
  return out;
}

function ShortestPathPet() {
  const [active, setActive] = useState<BallId | "rest">("rest");

  const getLayout = () => {
    if (active === "rest") return basePositions.rest;
    const center = basePositions.rest[active];
    const others = BALLS.filter((b) => b !== active);

    // initial target angles = direction from center to each ball's home (shortest path)
    const rawAngles = others.map((id) => {
      const h = basePositions.rest[id];
      return Math.atan2(h.y - center.y, h.x - center.x);
    });

    const fixedAngles = relaxAngles(rawAngles, MIN_ANGLE);

    const layout: Record<BallId, { x: number; y: number; s: number }> = { ...basePositions.rest } as any;

    // active stays, enlarged
    layout[active] = { x: center.x, y: center.y, s: 1.5 };

    others.forEach((id, i) => {
      const a = fixedAngles[i];
      layout[id] = { x: center.x + Math.cos(a) * ORBIT_R, y: center.y + Math.sin(a) * ORBIT_R, s: 1 };
    });

    return layout;
  };

  const layout = getLayout();

  return (
    <div className="relative w-[300px] h-[400px]">
      {BALLS.map((id) => {
        const pos = layout[id];
        return <Ball key={id} id={id} x={pos.x} y={pos.y} s={pos.s} onClick={() => setActive((p) => (p === id ? "rest" : id))} />;
      })}
    </div>
  );
}

// ---------- Page ----------
export default function FiveCirclePet() {
  return (
    <div className="w-screen min-h-screen bg-slate-200 flex flex-col items-center gap-20 py-16">
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-xl font-semibold">Version C — Simple Encircle</h2>
        <InPlaceFocusPet />
      </div>

      <div className="flex flex-col items-center gap-4">
        <h2 className="text-xl font-semibold">Version D — Shortest-Path Encircle</h2>
        <ShortestPathPet />
        <p className="text-sm opacity-70">Each ball takes the closest path around the active one, then softly spreads to avoid overlap.</p>
      </div>
    </div>
  );
}
