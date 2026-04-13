import React from "react";

export type BallId = "hub" | "focus" | "system" | "placeholder" | "settings";

export interface BallConfig {
  id: BallId;
  color: string;
  name: string;
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  cssClass: string;
}

export interface BallPosition {
  x: number;
  y: number;
  scale: number;
}

export interface BallEventHandlers {
  onClick?: (id: BallId) => void;
  onDoubleClick?: (id: BallId) => void;
  onRightClick?: (id: BallId) => void;
  onHover?: (id: BallId, isHovering: boolean) => void;
}

export interface SystemStats {
  cpu: number;
  ram: number;
}

export interface FocusTimerState {
  isRunning: boolean;
  isPaused: boolean;
  timeRemaining: number;
  totalTime: number;
  isBreak: boolean;
}

export type ActiveState = BallId | "rest";

export interface ContextualAction {
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  label: string;
  action: () => void;
}
