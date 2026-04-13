// icons.js - SVG icon factory functions (ported from src/icons/index.tsx)

const SVG_NS = "http://www.w3.org/2000/svg";

function createSvgIcon(size, color, children) {
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("width", size);
  svg.setAttribute("height", size);
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", color);
  children(svg);
  return svg;
}

function addPath(svg, d) {
  const path = document.createElementNS(SVG_NS, "path");
  path.setAttribute("d", d);
  svg.appendChild(path);
}

function addCircle(svg, cx, cy, r) {
  const circle = document.createElementNS(SVG_NS, "circle");
  circle.setAttribute("cx", cx);
  circle.setAttribute("cy", cy);
  circle.setAttribute("r", r);
  svg.appendChild(circle);
}

const Icons = {
  HouseIcon(size = 24, color = "white") {
    return createSvgIcon(size, color, (svg) =>
      addPath(svg, "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z")
    );
  },

  ClockIcon(size = 24, color = "white") {
    return createSvgIcon(size, color, (svg) =>
      addPath(svg, "M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z")
    );
  },

  MonitorIcon(size = 24, color = "white") {
    return createSvgIcon(size, color, (svg) =>
      addPath(svg, "M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v2H8v2h8v-2h-2v-2h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z")
    );
  },

  GearIcon(size = 24, color = "white") {
    return createSvgIcon(size, color, (svg) =>
      addPath(svg, "M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z")
    );
  },

  CircleIcon(size = 24, color = "white") {
    return createSvgIcon(size, color, (svg) =>
      addCircle(svg, "12", "12", "8")
    );
  },

  LockIcon(size = 24, color = "white") {
    return createSvgIcon(size, color, (svg) =>
      addPath(svg, "M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z")
    );
  },

  UnlockIcon(size = 24, color = "white") {
    return createSvgIcon(size, color, (svg) =>
      addPath(svg, "M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6h1.9c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm0 12H6V10h12v10z")
    );
  },

  PlayIcon(size = 24, color = "white") {
    return createSvgIcon(size, color, (svg) =>
      addPath(svg, "M8 5v14l11-7z")
    );
  },

  PauseIcon(size = 24, color = "white") {
    return createSvgIcon(size, color, (svg) =>
      addPath(svg, "M6 19h4V5H6v14zm8-14v14h4V5h-4z")
    );
  },

  StopIcon(size = 24, color = "white") {
    return createSvgIcon(size, color, (svg) =>
      addPath(svg, "M6 6h12v12H6z")
    );
  },

  RefreshIcon(size = 24, color = "white") {
    return createSvgIcon(size, color, (svg) =>
      addPath(svg, "M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z")
    );
  },

  ExitIcon(size = 24, color = "white") {
    return createSvgIcon(size, color, (svg) =>
      addPath(svg, "M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z")
    );
  },

  CpuIcon(size = 24, color = "white") {
    return createSvgIcon(size, color, (svg) =>
      addPath(svg, "M15 9H9v6h6V9zm-2 4h-2v-2h2v2zm8-2V9h-2V7c0-1.1-.9-2-2-2h-2V3h-2v2h-2V3H9v2H7c-1.1 0-2 .9-2 2v2H3v2h2v2H3v2h2v2c0 1.1.9 2 2 2h2v2h2v-2h2v2h2v-2h2c1.1 0 2-.9 2-2v-2h2v-2h-2v-2h2zm-4 6H7V7h10v10z")
    );
  },

  MemoryIcon(size = 24, color = "white") {
    return createSvgIcon(size, color, (svg) =>
      addPath(svg, "M2 7v10h20V7H2zm18 8H4V9h16v6zm-6-4h2v2h-2zm-4 0h2v2h-2zm-4 0h2v2H6z")
    );
  },
};
