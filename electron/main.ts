import { app, BrowserWindow, ipcMain as ipc } from 'electron'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null

let alwaysOnTop = false;
let dragData: { x: number; y: number } | null = null

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),

    width: 260,
    height: 260,
    transparent: true,
    frame: false,
    alwaysOnTop: alwaysOnTop,
    resizable: true,
    hasShadow: false,

    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(createWindow)


ipc.on("start-drag", (event, { x, y }) => {
  if (win) {
      const { x: winX, y: winY } = win.getBounds();
      dragData = { x: winX - x, y: winY - y };
  }
});

ipc.on("update-drag", (event, { x, y }) => {
  if (win && dragData) {
      win.setBounds({
          x: x + dragData.x,
          y: y + dragData.y,
          width: win.getBounds().width,
          height: win.getBounds().height,
      });
  }
});

ipc.on("stop-drag", () => {
  dragData = null;
});

ipc.on("toggle-pin", (event, isPinned) => {
  if (win) {
      win.setAlwaysOnTop(isPinned);
  }
});