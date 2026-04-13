import { useState, useEffect, useCallback, useRef } from "react";
import { SystemStats } from "../types";

interface UseSystemStatsOptions {
  pollInterval?: number;
  autoStart?: boolean;
}

export function useSystemStats({
  pollInterval = 2000,
  autoStart = false,
}: UseSystemStatsOptions = {}) {
  const [stats, setStats] = useState<SystemStats>({ cpu: 0, ram: 0 });
  const [isPolling, setIsPolling] = useState(autoStart);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<number | null>(null);

  const fetchStats = useCallback(async () => {
    if (typeof window !== "undefined" && window.electronAPI) {
      try {
        const newStats = await window.electronAPI.getSystemStats();
        setStats(newStats);
        setError(null);
      } catch (err) {
        setError("Failed to get system stats");
      }
    }
  }, []);

  const startPolling = useCallback(() => {
    setIsPolling(true);
    fetchStats(); // Fetch immediately
  }, [fetchStats]);

  const stopPolling = useCallback(() => {
    setIsPolling(false);
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const refresh = useCallback(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    if (isPolling) {
      intervalRef.current = window.setInterval(fetchStats, pollInterval);
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPolling, pollInterval, fetchStats]);

  return {
    stats,
    isPolling,
    error,
    startPolling,
    stopPolling,
    refresh,
  };
}
