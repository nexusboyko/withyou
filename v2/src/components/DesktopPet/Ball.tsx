import { useState } from "react";
import { motion } from "framer-motion";
import { BallConfig, BallPosition, BallEventHandlers } from "./types";
import { ANIMATION } from "./constants";

interface BallProps {
  config: BallConfig;
  position: BallPosition;
  isActive: boolean;
  size: number;
  handlers: BallEventHandlers;
  children?: React.ReactNode;
  isDragHandle?: boolean;
  onDragMouseDown?: (e: React.MouseEvent) => void;
}

export function Ball({
  config,
  position,
  isActive,
  size,
  handlers,
  children,
  isDragHandle = false,
  onDragMouseDown,
}: BallProps) {
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

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isDragHandle && onDragMouseDown) {
      onDragMouseDown(e);
    }
  };

  const { Icon } = config;

  return (
    <motion.div
      className={`absolute rounded-full cursor-pointer select-none flex items-center justify-center ${config.cssClass}`}
      style={{
        width: size,
        height: size,
      }}
      animate={{
        x: position.x,
        y: position.y,
        scale: position.scale,
      }}
      transition={{
        type: "spring",
        ...ANIMATION.spring,
      }}
      whileHover={{ scale: position.scale * ANIMATION.hover.scale }}
      whileTap={{ scale: position.scale * ANIMATION.tap.scale }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onContextMenu={handleContextMenu}
      onMouseDown={handleMouseDown}
    >
      {children || (
        <Icon size={isActive ? 36 : 28} color="white" />
      )}

      {/* Hover label */}
      {isHovered && !isActive && (
        <motion.div
          className="absolute -bottom-6 text-xs text-white/90 font-semibold whitespace-nowrap bg-black/50 px-2 py-0.5 rounded"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {config.name}
        </motion.div>
      )}
    </motion.div>
  );
}
