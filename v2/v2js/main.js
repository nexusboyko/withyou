// main.js - Electron's Main Process Script

const { app, BrowserWindow, screen, Tray, Menu, ipcMain } = require("electron");
const path = require("path");
const os = require("os");

let mainWindow;
let tray = null;

// --- IPC Handlers ---

// Drag: track offset between mouse and window position
let dragOffset = { x: 0, y: 0 };

ipcMain.on("drag:start", (_event, { x, y }) => {
  if (!mainWindow) return;
  const pos = mainWindow.getPosition();
  dragOffset.x = x - pos[0];
  dragOffset.y = y - pos[1];
});

ipcMain.on("drag:move", (_event, { x, y }) => {
  if (!mainWindow) return;
  mainWindow.setPosition(x - dragOffset.x, y - dragOffset.y);
});

ipcMain.on("drag:stop", () => {
  // No-op, cleanup happens in renderer
});

// System stats: dual-sample CPU for accuracy
ipcMain.handle("system:getStats", async () => {
  const sample = () => {
    const cpus = os.cpus();
    let idle = 0, total = 0;
    cpus.forEach((cpu) => {
      for (const type in cpu.times) total += cpu.times[type];
      idle += cpu.times.idle;
    });
    return { idle, total };
  };

  const s1 = sample();
  await new Promise((r) => setTimeout(r, 100));
  const s2 = sample();

  const idleDelta = s2.idle - s1.idle;
  const totalDelta = s2.total - s1.total;
  const cpu = totalDelta > 0 ? Math.round(100 - (idleDelta / totalDelta) * 100) : 0;

  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const ram = Math.round(((totalMem - freeMem) / totalMem) * 100);

  return { cpu, ram };
});

// Lock
ipcMain.handle("lock:set", (_event, locked) => {
  return locked;
});

// Mouse event forwarding: toggle ignore for interactive regions
// ipcMain.on("mouse:setIgnore", (_event, ignore) => {
//   if (!mainWindow) return;
//   if (ignore) {
//     mainWindow.setIgnoreMouseEvents(true, { forward: true });
//   } else {
//     mainWindow.setIgnoreMouseEvents(false);
//   }
// });

// Quit
ipcMain.on("app:quit", () => {
  app.quit();
});

// --- Window ---

function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  const yPosition = Math.round(height * 0.2);

  mainWindow = new BrowserWindow({
    width: 350,
    height: 400,
    x: Math.round((width - 400) / 2),
    y: yPosition,
    transparent: true,
    frame: false,
    hasShadow: false,
    fullscreenable: false,
    focusable: true,
    alwaysOnTop: true,
    resizable: false,
    minimizable: false,
    maximizable: false,
    closable: false,
    skipTaskbar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.loadFile(path.join(__dirname, "index.html"));

  mainWindow.setAlwaysOnTop(true, "floating");
  // mainWindow.setIgnoreMouseEvents(true, { forward: true });

  // mainWindow.webContents.openDevTools();

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// --- Tray ---

function createTray() {
  tray = new Tray(path.join(__dirname, "assets", "icon.ico"));
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Quit WithYou",
      click: () => {
        app.quit();
      },
    },
  ]);
  tray.setToolTip("WithYou Widget");
  tray.setContextMenu(contextMenu);
}

// --- App Lifecycle ---

// Only disable hardware acceleration on Linux/WSLg where it's needed for transparency.
// On native Windows, hardware acceleration is required for the UI to render.
if (process.platform === "linux") {
  app.disableHardwareAcceleration();
}

app.whenReady().then(() => {
  createWindow();
  createTray();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
