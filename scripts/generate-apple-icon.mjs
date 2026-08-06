import { writeFileSync } from "fs";

const LEAGUE_COLORS = ["#7C3AED", "#EF4444", "#3B82F6", "#F59E0B", "#10B981"];
const PANEL_STROKE = "#27272a";
const HEX_FILL = "#f4f4f5";
const BG = "#e4e4e7";
const SCALE = 4.75;
const cx = 18;
const cy = 18;
const outerAngles = [-90, -18, 54, 126, 198];

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

function pentagonPath(cx, cy, r, rotationDeg) {
  const points = Array.from({ length: 5 }, (_, i) => {
    const angle = toRad(rotationDeg + i * 72);
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  });
  return `M ${points.map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join(" L ")} Z`;
}

function hexagonPath(cx, cy, r, rotationDeg) {
  const points = Array.from({ length: 6 }, (_, i) => {
    const angle = toRad(rotationDeg + i * 60);
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  });
  return `M ${points.map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join(" L ")} Z`;
}

const hexPaths = outerAngles
  .map((angle) => {
    const rad = toRad(angle);
    const hx = cx + 6.2 * Math.cos(rad);
    const hy = cy + 6.2 * Math.sin(rad);
    return `<path d="${hexagonPath(hx, hy, 3.1, angle + 30)}" fill="${HEX_FILL}" stroke="${PANEL_STROKE}" stroke-width="0.6" stroke-linejoin="round"/>`;
  })
  .join("\n      ");

const pentPaths = outerAngles
  .map((angle, i) => {
    const rad = toRad(angle);
    const px = cx + 10.2 * Math.cos(rad);
    const py = cy + 10.2 * Math.sin(rad);
    return `<path d="${pentagonPath(px, py, 4.1, angle + 90)}" fill="${LEAGUE_COLORS[i]}" stroke="${PANEL_STROKE}" stroke-width="0.65" stroke-linejoin="round"/>`;
  })
  .join("\n      ");

const svg = `<svg width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="180" height="180" fill="${BG}"/>
  <g transform="translate(90 90) scale(${SCALE}) translate(-18 -18)">
    <defs>
      <clipPath id="iosBallClip">
        <circle cx="${cx}" cy="${cy}" r="16.5"/>
      </clipPath>
    </defs>
    <g clip-path="url(#iosBallClip)">
      <circle cx="${cx}" cy="${cy}" r="16.5" fill="${HEX_FILL}"/>
      ${hexPaths}
      ${pentPaths}
      <path d="${pentagonPath(cx, cy, 4.2, -90)}" fill="#ffffff" stroke="${PANEL_STROKE}" stroke-width="0.65" stroke-linejoin="round"/>
    </g>
    <circle cx="${cx}" cy="${cy}" r="16.5" stroke="#52525b" stroke-width="0.75" fill="none"/>
  </g>
</svg>
`;

writeFileSync("public/apple-touch-icon.svg", svg);
console.log("Wrote public/apple-touch-icon.svg");
