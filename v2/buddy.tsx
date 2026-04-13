import { useState } from "react";
import { motion } from "framer-motion";

// ==================== TYPES ====================

export type BallId = "b1" | "b2" | "b3" | "b4" | "b5";

export interface BallConfig {
  id: BallId;
  color: string;
  name: string;
  icon: string;
}

export interface BallPosition {
  x: number;
  y: number;
  s: number;
}

export interface BallEventHandlers {
  onClick?: (id: BallId) => void;
  onDoubleClick?: (id: BallId) => void;
  onRightClick?: (id: BallId) => void;
  onHover?: (id: BallId, isHovering: boolean) => void;
}

export interface WidgetConfig {
  ballSize: number;
  orbitRadius: number;
  restGap: number;
  containerWidth: number;
  containerHeight: number;
  offsetX: number;
  offsetY: number;
}

export interface BallRenderProps {
  id: BallId;
  isActive: boolean;
  isHovered: boolean;
  config: BallConfig;
}

// ==================== DEFAULT CONFIG ====================

const DEFAULT_BALL_CONFIGS: BallConfig[] = [
  { id: "b1", color: "#2F5D50", name: "Focus Timer", icon: "HOME" },
  { id: "b2", color: "#3A6F8F", name: "Quick Notes", icon: "📝" },
  { id: "b3", color: "#E3C77A", name: "Weather", icon: "☀️" },
  { id: "b4", color: "#B25C4A", name: "Music", icon: "🎵" },
  { id: "b5", color: "#8E8E8E", name: "System", icon: "⚙️" },
];

const DEFAULT_WIDGET_CONFIG: WidgetConfig = {
  ballSize: 80,
  orbitRadius: 110,
  restGap: 10,
  containerWidth: 340,
  containerHeight: 380,
  offsetX: -40,
  offsetY: -40,
};

// Context-specific content for orbiting balls
const CONTEXTUAL_CONTENT: Record<BallId, Record<BallId, { icon: string; label: string }>> = {
  b1: { // Focus Timer active
    b2: { icon: "▶️", label: "Start" },
    b3: { icon: "⏸️", label: "Pause" },
    b4: { icon: "⏹️", label: "Stop" },
    b5: { icon: "⚙️", label: "Settings" },
  },
  b2: { // Quick Notes active
    b2: { icon: "➕", label: "New" },
    b3: { icon: "📋", label: "List" },
    b4: { icon: "🔍", label: "Search" },
    b5: { icon: "🗑️", label: "Delete" },
  },
  b3: { // Weather active
    b2: { icon: "📍", label: "Location" },
    b3: { icon: "🌡️", label: "Temp" },
    b4: { icon: "💧", label: "Humidity" },
    b5: { icon: "🔄", label: "Refresh" },
  },
  b4: { // Music active
    b2: { icon: "⏮️", label: "Prev" },
    b3: { icon: "⏯️", label: "Play" },
    b4: { icon: "⏭️", label: "Next" },
    b5: { icon: "🔀", label: "Shuffle" },
  },
  b5: { // System active
    b2: { icon: "💻", label: "CPU" },
    b3: { icon: "💾", label: "RAM" },
    b4: { icon: "🔋", label: "Battery" },
    b5: { icon: "📶", label: "Network" },
  },
};

// ==================== LAYOUT CALCULATION ====================

function calculateRestPositions(config: WidgetConfig) {
  const { ballSize, restGap } = config;
  return {
    b1: { x: 90, y: 0, s: 1 },
    b2: { x: 40, y: restGap + ballSize, s: 1 },
    b3: { x: 140, y: restGap + ballSize, s: 1 },
    b4: { x: 40, y: (restGap + ballSize) * 2, s: 1 },
    b5: { x: 140, y: (restGap + ballSize) * 2, s: 1 },
  };
}

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

// ==================== BALL COMPONENT ====================

interface BallProps {
  config: BallConfig;
  position: BallPosition;
  isActive: boolean;
  activeContext: BallId | "rest";
  size: number;
  handlers: BallEventHandlers;
  renderContent?: (props: BallRenderProps) => React.ReactNode;
}

function Ball({ config, position, isActive, activeContext, size, handlers, renderContent }: BallProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    handlers.onClick?.(config.id);
  };

  const handleDoubleClick = () => {
    handlers.onDoubleClick?.(config.id);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    handlers.onHover?.(config.id, true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    handlers.onHover?.(config.id, false);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    handlers.onRightClick?.(config.id);
  };

  // Get contextual content if orbiting
  const contextualContent = !isActive && activeContext !== "rest" 
    ? CONTEXTUAL_CONTENT[activeContext]?.[config.id]
    : null;

  return (
    <motion.div
      className="absolute rounded-full cursor-pointer select-none flex items-center justify-center"
      style={{ 
        background: config.color,
        width: size,
        height: size,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      }}
      animate={{ 
        x: position.x, 
        y: position.y, 
        scale: position.s 
      }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 22,
        mass: 0.8
      }}
      whileHover={{ scale: position.s * 1.08 }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onContextMenu={handleContextMenu}
    >
      {/* Custom content renderer or default */}
      {renderContent ? (
        renderContent({ id: config.id, isActive, isHovered, config })
      ) : (
        <>
          {/* Center ball - show main icon */}
          {isActive && (
            <div className="text-3xl">{config.icon}</div>
          )}
          
          {/* Orbiting balls - show contextual content */}
          {contextualContent && (
            <div className="flex flex-col items-center gap-1">
              <div className="text-2xl">{contextualContent.icon}</div>
              {isHovered && (
                <div className="text-[10px] text-white/90 font-semibold">
                  {contextualContent.label}
                </div>
              )}
            </div>
          )}
          
          {/* Rest state - show main icon small */}
          {!isActive && !contextualContent && (
            <div className="text-xl opacity-80">{config.icon}</div>
          )}

        </>
      )}
      <small>{config.id}</small>
    </motion.div>
  );
}

// ==================== MAIN WIDGET COMPONENT ====================

export interface DesktopPetProps {
  ballConfigs?: BallConfig[];
  widgetConfig?: Partial<WidgetConfig>;
  eventHandlers?: BallEventHandlers;
  renderBallContent?: (props: BallRenderProps) => React.ReactNode;
  showDebugBounds?: boolean;
}

export default function DesktopPetWidget({
  ballConfigs = DEFAULT_BALL_CONFIGS,
  widgetConfig = {},
  eventHandlers = {},
  renderBallContent,
  showDebugBounds = true,
}: DesktopPetProps) {
  const config = { ...DEFAULT_WIDGET_CONFIG, ...widgetConfig };
  const [active, setActive] = useState<BallId | "rest">("rest");
  const [widgetPos, setWidgetPos] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);

  const ballIds = ballConfigs.map(b => b.id);
  const restPositions = calculateRestPositions(config);

  // ==================== LAYOUT LOGIC ====================

  const getLayout = (): Record<BallId, BallPosition> => {
    if (active === "rest") return restPositions;
    
    const center = restPositions[active];
    const others = ballIds.filter(id => id !== active);

    const rawAngles = others.map(id => {
      const h = restPositions[id];
      return Math.atan2(h.y - center.y, h.x - center.x);
    });

    const fixedAngles = relaxAngles(rawAngles, MIN_ANGLE);

    const layout: Record<string, BallPosition> = { ...restPositions };
    layout[active] = { x: center.x, y: center.y, s: 1.5 };

    others.forEach((id, i) => {
      const a = fixedAngles[i];
      layout[id] = { 
        x: center.x + Math.cos(a) * config.orbitRadius, 
        y: center.y + Math.sin(a) * config.orbitRadius, 
        s: 0.9
      };
    });

    return layout as Record<BallId, BallPosition>;
  };

  const layout = getLayout();

  // ==================== DRAG HANDLING ====================

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.ball-container')) {
      return;
    }
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setWidgetPos(prev => ({
      x: prev.x + e.movementX,
      y: prev.y + e.movementY
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // ==================== EVENT HANDLERS (DEMO) ====================

  const demoHandlers: BallEventHandlers = {
    onClick: (id) => {
      console.log(`[onClick] Ball ${id} clicked`);
      setActive(prev => prev === id ? "rest" : id);
      eventHandlers.onClick?.(id);
    },
    onDoubleClick: (id) => {
      console.log(`[onDoubleClick] Ball ${id} double-clicked`);
      eventHandlers.onDoubleClick?.(id);
    },
    onRightClick: (id) => {
      console.log(`[onRightClick] Ball ${id} right-clicked`);
      eventHandlers.onRightClick?.(id);
    },
    onHover: (id, isHovering) => {
      eventHandlers.onHover?.(id, isHovering);
    },
  };

  // ==================== RENDER ====================

  return (
    <div 
      // className="w-screen h-screen bg-gradient-to-br from-slate-100 to-slate-200 relative overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Desktop widget */}
      <motion.div
        className="absolute select-none"
        style={{
          left: widgetPos.x,
          top: widgetPos.y,
          width: config.containerWidth,
          height: config.containerHeight,
        }}
        animate={{
          opacity: isDragging ? 0.6 : 1
        }}
        transition={{ duration: 0.15 }}
        onMouseDown={handleMouseDown}
      >
        {/* Draggable background */}
        <div className="absolute inset-0 cursor-move" />
        
        {/* Debug bounds outline */}
        {showDebugBounds && (
          <div className="absolute inset-0 border-2 border-dashed border-red-400/30 pointer-events-none" />
        )}
        
        {/* Balls container */}
        <div className="relative pointer-events-none" style={{ width: '100%', height: '100%' }}>
          {ballConfigs.map(ballConfig => {
            const pos = layout[ballConfig.id];
            return (
              <div key={ballConfig.id} className="ball-container pointer-events-auto">
                <Ball
                  config={ballConfig}
                  position={{
                    x: pos.x - config.offsetX,
                    y: pos.y - config.offsetY,
                    s: pos.s
                  }}
                  isActive={active === ballConfig.id}
                  activeContext={active}
                  size={config.ballSize}
                  handlers={demoHandlers}
                  renderContent={renderBallContent}
                />
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Demo Instructions */}
      {/* <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-4 py-3 rounded-lg shadow-lg text-sm max-w-xs">
        <div className="font-bold mb-2">Interactive Demo:</div>
        <div className="text-xs space-y-1 opacity-80">
          <div>• <strong>Click any ball</strong> to activate it</div>
          <div>• <strong>Outer balls change</strong> based on active ball</div>
          <div>• <strong>Hover outer balls</strong> to see their labels</div>
          <div>• <strong>Right-click:</strong> Context menu (console)</div>
          <div>• <strong>Double-click:</strong> Special action (console)</div>
          <div>• <strong>Drag frame:</strong> Reposition widget</div>
        </div>
        {active !== "rest" && (
          <div className="mt-3 pt-2 border-t border-slate-300 text-xs">
            <strong>Active:</strong> {ballConfigs.find(b => b.id === active)?.name}
          </div>
        )}
      </div> */}
    </div>
  );
}