/// <reference types="vite/client" />
declare global {
  interface Window {
      electronAPI: {
          togglePin: (isPinned: boolean) => void;
          startDrag: (data: { x: number; y: number }) => void;
          updateDrag: (data: { x: number; y: number }) => void;
          stopDrag: () => void;
      };
  }
}

export {};