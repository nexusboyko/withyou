// preload.js - IPC bridge via contextBridge

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  // Drag
  startDrag: (pos) => ipcRenderer.send("drag:start", pos),
  updateDrag: (pos) => ipcRenderer.send("drag:move", pos),
  stopDrag: () => ipcRenderer.send("drag:stop"),

  // System stats
  getSystemStats: () => ipcRenderer.invoke("system:getStats"),

  // Lock
  setLocked: (locked) => ipcRenderer.invoke("lock:set", locked),

  // Mouse event forwarding (for setIgnoreMouseEvents with forward: true)
  setIgnoreMouseEvents: (ignore) => ipcRenderer.send("mouse:setIgnore", ignore),

  // App control
  quitApp: () => ipcRenderer.send("app:quit"),
});
