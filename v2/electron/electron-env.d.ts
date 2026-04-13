/// <reference types="vite-plugin-electron/electron-env" />

declare namespace NodeJS {
  interface ProcessEnv {
    APP_ROOT: string
    VITE_PUBLIC: string
  }
}

interface Window {
  ipcRenderer: import('electron').IpcRenderer
  electronAPI: {
    togglePin: (isPinned: boolean) => void
    startDrag: (data: { x: number; y: number }) => void
    updateDrag: (data: { x: number; y: number }) => void
    stopDrag: () => void
    setLocked: (isLocked: boolean) => Promise<boolean>
    getSystemStats: () => Promise<{ cpu: number; ram: number }>
    quitApp: () => void
  }
}
