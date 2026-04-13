import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Ball } from "./Ball";
import {
  PlayIcon,
  PauseIcon,
  StopIcon,
  RefreshIcon,
  LockIcon,
  UnlockIcon,
  ExitIcon,
  CpuIcon,
  MemoryIcon,
} from "../../icons";
import { ActiveState, BallId } from "./types";
import {
  LAYOUT,
  BALL_CONFIGS,
  relaxAngles,
  MIN_ANGLE,
} from "./constants";
import { useDrag, useLockMode, useFocusTimer, useSystemStats } from "./hooks";

// Calculate rest positions - EXACT from buddy.tsx
function calculateRestPositions() {
  const { ballSize, restGap } = LAYOUT;
  return {
    hub: { x: 90, y: 0, s: 1 },
    focus: { x: 40, y: restGap + ballSize, s: 1 },
    system: { x: 140, y: restGap + ballSize, s: 1 },
    placeholder: { x: 40, y: (restGap + ballSize) * 2, s: 1 },
    settings: { x: 140, y: (restGap + ballSize) * 2, s: 1 },
  };
}

type InternalPosition = { x: number; y: number; s: number };

export function DesktopPet() {
  const [active, setActive] = useState<ActiveState>("rest");
  const { isDragging, handleMouseDown } = useDrag();
  const { isLocked, toggleLock } = useLockMode();
  const focusTimer = useFocusTimer();
  const systemStats = useSystemStats({ autoStart: false });

  const ballIds = BALL_CONFIGS.map((b) => b.id);
  const restPositions = calculateRestPositions();

  // Layout calculation - EXACT from buddy.tsx
  const getLayout = (): Record<BallId, InternalPosition> => {
    if (active === "rest") return restPositions as Record<BallId, InternalPosition>;

    const center = restPositions[active as BallId];
    const others = ballIds.filter((id) => id !== active);

    const rawAngles = others.map((id) => {
      const h = restPositions[id];
      return Math.atan2(h.y - center.y, h.x - center.x);
    });

    const fixedAngles = relaxAngles(rawAngles, MIN_ANGLE);

    const layout: Record<string, InternalPosition> = { ...restPositions };
    layout[active] = { x: center.x, y: center.y, s: 1.5 };

    others.forEach((id, i) => {
      const a = fixedAngles[i];
      layout[id] = {
        x: center.x + Math.cos(a) * LAYOUT.orbitRadius,
        y: center.y + Math.sin(a) * LAYOUT.orbitRadius,
        s: 0.9,
      };
    });

    return layout as Record<BallId, InternalPosition>;
  };

  const layout = getLayout();

  // Handle ball clicks - same as buddy.tsx demo handlers
  const handleBallClick = (id: BallId) => {
    console.log(`[onClick] Ball ${id} clicked`);
    setActive((prev) => (prev === id ? "rest" : id));

    // Start/stop polling for system ball
    if (id === "system" && active !== "system") {
      systemStats.startPolling();
    } else {
      systemStats.stopPolling();
    }
  };

  // Render contextual content for focus timer
  const renderFocusContent = () => (
    <div className="flex flex-col items-center justify-center text-white">
      <div className="text-lg font-bold">{focusTimer.formattedTime}</div>
      <div className="text-[10px] opacity-80">
        {focusTimer.isBreak ? "Break" : "Work"}
      </div>
    </div>
  );

  // Render contextual content for system monitor
  const renderSystemContent = () => (
    <div className="flex flex-col items-center justify-center text-white text-[10px] gap-0.5">
      <div className="flex items-center gap-1">
        <CpuIcon size={12} color="white" />
        <span>{systemStats.stats.cpu}%</span>
      </div>
      <div className="flex items-center gap-1">
        <MemoryIcon size={12} color="white" />
        <span>{systemStats.stats.ram}%</span>
      </div>
    </div>
  );

  // Get contextual icon for orbiting balls
  const getContextualContent = (ballId: BallId) => {
    if (active === "rest" || active === ballId) return null;

    if (active === "focus") {
      const icons: Record<BallId, typeof PlayIcon> = {
        hub: focusTimer.isRunning && !focusTimer.isPaused ? PauseIcon : PlayIcon,
        system: StopIcon,
        placeholder: RefreshIcon,
        settings: StopIcon,
        focus: PlayIcon,
      };
      return icons[ballId];
    }

    if (active === "system") {
      const icons: Record<BallId, typeof CpuIcon> = {
        hub: CpuIcon,
        focus: MemoryIcon,
        placeholder: RefreshIcon,
        settings: RefreshIcon,
        system: CpuIcon,
      };
      return icons[ballId];
    }

    if (active === "settings") {
      const icons: Record<BallId, typeof LockIcon> = {
        hub: isLocked ? UnlockIcon : LockIcon,
        focus: ExitIcon,
        system: RefreshIcon,
        placeholder: RefreshIcon,
        settings: LockIcon,
      };
      return icons[ballId];
    }

    return null;
  };

  // Handle contextual action clicks
  const handleContextualClick = (id: BallId) => {
    if (active === "focus" && id !== "focus") {
      if (id === "hub") {
        focusTimer.isRunning && !focusTimer.isPaused ? focusTimer.pause() : focusTimer.start();
      } else {
        focusTimer.reset();
      }
    } else if (active === "system" && id !== "system") {
      if (id === "placeholder" || id === "settings") {
        systemStats.refresh();
      }
    } else if (active === "settings" && id !== "settings") {
      if (id === "hub") {
        toggleLock();
      } else if (id === "focus") {
        window.electronAPI?.quitApp();
      }
    }
  };

  return (
    <div>
      {/* Desktop widget - EXACT structure from buddy.tsx */}
      <motion.div
        className="absolute select-none"
        style={{
          width: LAYOUT.containerWidth,
          height: LAYOUT.containerHeight,
        }}
        animate={{
          opacity: isDragging ? 0.6 : 1,
        }}
        transition={{ duration: 0.15 }}
      >
        {/* Draggable background */}
        <div className="absolute inset-0 cursor-move" />

        {/* Debug bounds outline - shown during drag */}
        <AnimatePresence>
          {isDragging && (
            <motion.div
              className="absolute inset-0 border-2 border-dashed border-red-400/30 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          )}
        </AnimatePresence>

        {/* Lock indicator */}
        {isLocked && (
          <div className="absolute top-2 right-2 text-white/50 z-10">
            <LockIcon size={16} color="currentColor" />
          </div>
        )}

        {/* Balls container - EXACT structure from buddy.tsx */}
        <div className="relative pointer-events-none" style={{ width: "100%", height: "100%" }}>
          {BALL_CONFIGS.map((ballConfig) => {
            const pos = layout[ballConfig.id];
            const isActiveBall = active === ballConfig.id;
            const isHubBall = ballConfig.id === "hub";
            const ContextIcon = getContextualContent(ballConfig.id);

            // Determine content
            let content = null;
            if (isActiveBall) {
              if (ballConfig.id === "focus") {
                content = renderFocusContent();
              } else if (ballConfig.id === "system") {
                content = renderSystemContent();
              }
            } else if (active !== "rest" && ContextIcon) {
              content = <ContextIcon size={24} color="white" />;
            }

            return (
              <div key={ballConfig.id} className="ball-container pointer-events-auto">
                <Ball
                  config={ballConfig}
                  position={{
                    // Apply offset - EXACT from buddy.tsx
                    x: pos.x - LAYOUT.offsetX,
                    y: pos.y - LAYOUT.offsetY,
                    scale: pos.s,
                  }}
                  isActive={isActiveBall}
                  size={LAYOUT.ballSize}
                  handlers={{
                    onClick: (id) => {
                      if (active !== "rest" && active !== id) {
                        handleContextualClick(id);
                      }
                      handleBallClick(id);
                    },
                  }}
                  isDragHandle={isHubBall}
                  onDragMouseDown={isHubBall ? handleMouseDown : undefined}
                >
                  {content}
                </Ball>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
