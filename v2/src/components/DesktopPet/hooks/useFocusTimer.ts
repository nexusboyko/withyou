import { useState, useEffect, useCallback, useRef } from "react";
import { TIMER_DEFAULTS } from "../constants";

interface UseFocusTimerOptions {
  workDuration?: number;
  breakDuration?: number;
}

export function useFocusTimer({
  workDuration = TIMER_DEFAULTS.workDuration,
  breakDuration = TIMER_DEFAULTS.breakDuration,
}: UseFocusTimerOptions = {}) {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(workDuration);
  const [isBreak, setIsBreak] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const totalTime = isBreak ? breakDuration : workDuration;

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    if (!isRunning || isPaused) {
      setIsRunning(true);
      setIsPaused(false);
    }
  }, [isRunning, isPaused]);

  const pause = useCallback(() => {
    if (isRunning && !isPaused) {
      setIsPaused(true);
    }
  }, [isRunning, isPaused]);

  const reset = useCallback(() => {
    clearTimer();
    setIsRunning(false);
    setIsPaused(false);
    setIsBreak(false);
    setTimeRemaining(workDuration);
  }, [clearTimer, workDuration]);

  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = window.setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            // Timer finished, switch between work/break
            const newIsBreak = !isBreak;
            setIsBreak(newIsBreak);
            return newIsBreak ? breakDuration : workDuration;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearTimer();
    }

    return clearTimer;
  }, [isRunning, isPaused, isBreak, workDuration, breakDuration, clearTimer]);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }, []);

  return {
    isRunning,
    isPaused,
    timeRemaining,
    totalTime,
    isBreak,
    formattedTime: formatTime(timeRemaining),
    progress: 1 - timeRemaining / totalTime,
    start,
    pause,
    reset,
  };
}
