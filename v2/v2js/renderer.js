// renderer.js - Widget logic (ported from React DesktopPet)

// --- Constants (from constants.ts) ---

const LAYOUT = {
  ballSize: 80,
  orbitRadius: 110,
  restGap: 10,
  containerWidth: 340,
  containerHeight: 380,
  offsetX: -40,
  offsetY: -40,
};

const BALL_CONFIGS = [
  { id: "hub", color: "#2F5D50", name: "Hub", icon: "HouseIcon", cssClass: "ball-hub" },
  { id: "focus", color: "#3A6F8F", name: "Focus", icon: "ClockIcon", cssClass: "ball-focus" },
  { id: "system", color: "#E3C77A", name: "System", icon: "MonitorIcon", cssClass: "ball-system" },
  { id: "placeholder", color: "#B25C4A", name: "More", icon: "CircleIcon", cssClass: "ball-placeholder" },
  { id: "settings", color: "#8E8E8E", name: "Settings", icon: "GearIcon", cssClass: "ball-settings" },
];

const TIMER_DEFAULTS = {
  workDuration: 25 * 60,
  breakDuration: 5 * 60,
};

const MIN_ANGLE = ((2 * Math.PI) / 5) * 0.8;

function calculateRestPositions() {
  const { ballSize, restGap } = LAYOUT;
  return {
    hub: { x: 90, y: 0, s: 1 },
    focus: { x: 40, y: restGap + ballSize, s: 1 },
    system: { x: 140, y: restGap + ballSize, s: 1 },
    placeholder: { x: 40, y: (restGap + ballSize) * 2, s: 1 },
    settings: { x: 140, y: (restGap + ballSize) * 2, s: 1 },
  };
}

// Angle relaxation (from constants.ts)
function relaxAngles(angles, minSep) {
  const a = [...angles];
  const n = a.length;
  for (let i = 0; i < n; i++) a[i] = (a[i] + Math.PI * 2) % (Math.PI * 2);
  const idx = a.map((v, i) => ({ v, i })).sort((x, y) => x.v - y.v);
  for (let pass = 0; pass < 4; pass++) {
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      const cur = idx[i].v;
      let next = idx[j].v;
      if (j === 0) next += Math.PI * 2;
      const d = next - cur;
      if (d < minSep) {
        const push = (minSep - d) / 2;
        idx[i].v -= push;
        idx[j].v += push;
      }
    }
  }
  const out = new Array(n).fill(0);
  idx.forEach(({ v, i }) => (out[i] = v));
  return out;
}

// --- State ---

const state = {
  active: "rest", // "rest" | ball id
  isDragging: false,
  isLocked: false,
  // Focus timer
  timerRunning: false,
  timerPaused: false,
  timeRemaining: TIMER_DEFAULTS.workDuration,
  isBreak: false,
  timerInterval: null,
  // System stats
  cpu: 0,
  ram: 0,
  statsInterval: null,
};

const restPositions = calculateRestPositions();
const ballIds = BALL_CONFIGS.map((b) => b.id);

// --- Layout (from DesktopPet.tsx getLayout) ---

function getLayout() {
  if (state.active === "rest") return { ...restPositions };

  const activeId = state.active;
  const center = restPositions[activeId];
  const others = ballIds.filter((id) => id !== activeId);

  const rawAngles = others.map((id) => {
    const h = restPositions[id];
    return Math.atan2(h.y - center.y, h.x - center.x);
  });

  const fixedAngles = relaxAngles(rawAngles, MIN_ANGLE);

  const layout = { ...restPositions };
  layout[activeId] = { x: center.x, y: center.y, s: 1.5 };

  others.forEach((id, i) => {
    const a = fixedAngles[i];
    layout[id] = {
      x: center.x + Math.cos(a) * LAYOUT.orbitRadius,
      y: center.y + Math.sin(a) * LAYOUT.orbitRadius,
      s: 0.9,
    };
  });

  return layout;
}

// --- Contextual Icons (from DesktopPet.tsx) ---

function getContextualIconName(ballId) {
  if (state.active === "rest" || state.active === ballId) return null;

  if (state.active === "focus") {
    const map = {
      hub: state.timerRunning && !state.timerPaused ? "PauseIcon" : "PlayIcon",
      system: "StopIcon",
      placeholder: "RefreshIcon",
      settings: "StopIcon",
    };
    return map[ballId] || null;
  }

  if (state.active === "system") {
    const map = {
      hub: "CpuIcon",
      focus: "MemoryIcon",
      placeholder: "RefreshIcon",
      settings: "RefreshIcon",
    };
    return map[ballId] || null;
  }

  if (state.active === "settings") {
    const map = {
      hub: state.isLocked ? "UnlockIcon" : "LockIcon",
      focus: "ExitIcon",
      system: "RefreshIcon",
      placeholder: "RefreshIcon",
    };
    return map[ballId] || null;
  }

  return null;
}

// --- Render ---

function render() {
  const layout = getLayout();
  const widget = document.getElementById("widget");

  // Drag class
  widget.classList.toggle("dragging", state.isDragging);

  // Lock indicator
  const lockEl = document.getElementById("lock-indicator");
  lockEl.classList.toggle("visible", state.isLocked);
  lockEl.innerHTML = "";
  if (state.isLocked) {
    lockEl.appendChild(Icons.LockIcon(16, "rgba(255,255,255,0.5)"));
  }

  BALL_CONFIGS.forEach((config) => {
    const el = document.getElementById("ball-" + config.id);
    const pos = layout[config.id];
    const isActiveBall = state.active === config.id;

    // Position (apply offset)
    el.style.left = (pos.x - LAYOUT.offsetX) + "px";
    el.style.top = (pos.y - LAYOUT.offsetY) + "px";
    el.style.setProperty("--scale", pos.s);

    // Active class
    el.classList.toggle("active", isActiveBall);

    // Content
    const content = el.querySelector(".ball-content");
    content.innerHTML = "";

    if (isActiveBall && config.id === "focus") {
      // Timer display
      const div = document.createElement("div");
      div.className = "timer-display";
      div.innerHTML =
        '<div class="time">' + formatTime(state.timeRemaining) + "</div>" +
        '<div class="label">' + (state.isBreak ? "Break" : "Work") + "</div>";
      content.appendChild(div);
    } else if (isActiveBall && config.id === "system") {
      // Stats display
      const div = document.createElement("div");
      div.className = "stats-display";
      const cpuRow = document.createElement("div");
      cpuRow.className = "stat-row";
      cpuRow.appendChild(Icons.CpuIcon(12, "white"));
      cpuRow.appendChild(Object.assign(document.createElement("span"), { textContent: state.cpu + "%" }));
      const ramRow = document.createElement("div");
      ramRow.className = "stat-row";
      ramRow.appendChild(Icons.MemoryIcon(12, "white"));
      ramRow.appendChild(Object.assign(document.createElement("span"), { textContent: state.ram + "%" }));
      div.appendChild(cpuRow);
      div.appendChild(ramRow);
      content.appendChild(div);
    } else if (state.active !== "rest" && !isActiveBall) {
      // Contextual icon on orbiting ball
      const iconName = getContextualIconName(config.id);
      if (iconName && Icons[iconName]) {
        content.appendChild(Icons[iconName](24, "white"));
      }
    } else {
      // Default icon
      const iconSize = isActiveBall ? 36 : 28;
      if (Icons[config.icon]) {
        content.appendChild(Icons[config.icon](iconSize, "white"));
      }
    }
  });
}

// --- Focus Timer ---

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return m + ":" + s;
}

function timerStart() {
  if (!state.timerRunning || state.timerPaused) {
    state.timerRunning = true;
    state.timerPaused = false;
    clearInterval(state.timerInterval);
    state.timerInterval = setInterval(timerTick, 1000);
    render();
  }
}

function timerPause() {
  if (state.timerRunning && !state.timerPaused) {
    state.timerPaused = true;
    clearInterval(state.timerInterval);
    state.timerInterval = null;
    render();
  }
}

function timerReset() {
  clearInterval(state.timerInterval);
  state.timerInterval = null;
  state.timerRunning = false;
  state.timerPaused = false;
  state.isBreak = false;
  state.timeRemaining = TIMER_DEFAULTS.workDuration;
  render();
}

function timerTick() {
  state.timeRemaining--;
  if (state.timeRemaining <= 0) {
    state.isBreak = !state.isBreak;
    state.timeRemaining = state.isBreak
      ? TIMER_DEFAULTS.breakDuration
      : TIMER_DEFAULTS.workDuration;
  }
  render();
}

// --- System Stats ---

function startStatsPolling() {
  fetchStats();
  clearInterval(state.statsInterval);
  state.statsInterval = setInterval(fetchStats, 2000);
}

function stopStatsPolling() {
  clearInterval(state.statsInterval);
  state.statsInterval = null;
}

async function fetchStats() {
  if (window.electronAPI) {
    try {
      const stats = await window.electronAPI.getSystemStats();
      state.cpu = stats.cpu;
      state.ram = stats.ram;
      render();
    } catch (_) {
      // ignore
    }
  }
}

// --- Lock ---

async function toggleLock() {
  if (window.electronAPI) {
    const newLocked = !state.isLocked;
    state.isLocked = await window.electronAPI.setLocked(newLocked);
    render();
  }
}

// --- Contextual Actions (from DesktopPet.tsx handleContextualClick) ---

function handleContextualAction(id) {
  if (state.active === "focus" && id !== "focus") {
    if (id === "hub") {
      state.timerRunning && !state.timerPaused ? timerPause() : timerStart();
    } else {
      timerReset();
    }
  } else if (state.active === "system" && id !== "system") {
    if (id === "placeholder" || id === "settings") {
      fetchStats();
    }
  } else if (state.active === "settings" && id !== "settings") {
    if (id === "hub") {
      toggleLock();
    } else if (id === "focus") {
      if (window.electronAPI) window.electronAPI.quitApp();
    }
  }
}

// --- Ball Click ---

function handleBallClick(id) {
  if (state.active !== "rest" && state.active !== id) {
    handleContextualAction(id);
  }

  // Toggle active
  if (state.active === id) {
    state.active = "rest";
  } else {
    state.active = id;
  }

  // Start/stop system polling
  if (id === "system" && state.active === "system") {
    startStatsPolling();
  } else if (id === "system" || state.active === "rest") {
    stopStatsPolling();
  }

  render();
}

// --- Drag (from useDrag.ts) ---

function setupDrag(el) {
  el.addEventListener("mousedown", (e) => {
    if (state.isLocked) return;
    e.stopPropagation();

    window.electronAPI.startDrag({ x: e.screenX, y: e.screenY });
    state.isDragging = true;
    render();

    function onMove(ev) {
      window.electronAPI.updateDrag({ x: ev.screenX, y: ev.screenY });
    }

    function onUp() {
      window.electronAPI.stopDrag();
      state.isDragging = false;
      render();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  });
}

// --- Init ---

document.addEventListener("DOMContentLoaded", () => {
  // Attach click handlers and mouse-forwarding to all balls
  BALL_CONFIGS.forEach((config) => {
    const el = document.getElementById("ball-" + config.id);
    el.addEventListener("click", () => handleBallClick(config.id));

    // Enable mouse interaction when hovering over a ball
    // (needed because main window uses setIgnoreMouseEvents(true, { forward: true }))
    el.addEventListener("mouseenter", () => {
      if (window.electronAPI) window.electronAPI.setIgnoreMouseEvents(false);
    });
    el.addEventListener("mouseleave", () => {
      if (window.electronAPI) window.electronAPI.setIgnoreMouseEvents(true);
    });
  });

  // Attach drag to hub ball
  setupDrag(document.getElementById("ball-hub"));

  // Initial render
  render();
});
