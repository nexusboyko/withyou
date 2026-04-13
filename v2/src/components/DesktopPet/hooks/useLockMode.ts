import { useState, useCallback } from "react";

export function useLockMode() {
  const [isLocked, setIsLocked] = useState(false);

  const toggleLock = useCallback(async () => {
    if (typeof window !== "undefined" && window.electronAPI) {
      const newLocked = !isLocked;
      const result = await window.electronAPI.setLocked(newLocked);
      setIsLocked(result);
      return result;
    }
    return isLocked;
  }, [isLocked]);

  return { isLocked, toggleLock };
}
