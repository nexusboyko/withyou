import { useState, useCallback } from "react";

interface UseDragOptions {
  isLocked?: boolean;
}

export function useDrag({ isLocked = false }: UseDragOptions = {}) {
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (isLocked) return;
      if (typeof window !== "undefined" && window.electronAPI) {
        window.electronAPI.startDrag({ x: e.screenX, y: e.screenY });
        setIsDragging(true);

        const handleMouseMove = (moveEvent: MouseEvent) => {
          window.electronAPI.updateDrag({
            x: moveEvent.screenX,
            y: moveEvent.screenY,
          });
        };

        const handleMouseUp = () => {
          window.electronAPI.stopDrag();
          setIsDragging(false);
          window.removeEventListener("mousemove", handleMouseMove);
          window.removeEventListener("mouseup", handleMouseUp);
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
      }
    },
    [isLocked]
  );

  return { isDragging, handleMouseDown };
}
