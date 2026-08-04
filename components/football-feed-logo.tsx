// Big 5 league-inspired colors: PL, La Liga, Serie A, Bundesliga, Ligue 1
const LEAGUE_COLORS = ["#7C3AED", "#EF4444", "#3B82F6", "#F59E0B", "#10B981"];
const PANEL_STROKE = "#27272a";
const HEX_FILL = "#f4f4f5";

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

function pentagonPath(cx: number, cy: number, r: number, rotationDeg: number) {
  const points = Array.from({ length: 5 }, (_, i) => {
    const angle = toRad(rotationDeg + i * 72);
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)] as const;
  });
  return `M ${points.map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join(" L ")} Z`;
}

function hexagonPath(cx: number, cy: number, r: number, rotationDeg: number) {
  const points = Array.from({ length: 6 }, (_, i) => {
    const angle = toRad(rotationDeg + i * 60);
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)] as const;
  });
  return `M ${points.map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join(" L ")} Z`;
}

export function FootballFeedLogo({ size = 36 }: { size?: number }) {
  const cx = 18;
  const cy = 18;
  const outerAngles = [-90, -18, 54, 126, 198];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className="shrink-0"
    >
      <defs>
        <clipPath id="ballClip">
          <circle cx={cx} cy={cy} r={16.5} />
        </clipPath>
      </defs>

      <g clipPath="url(#ballClip)">
        <circle cx={cx} cy={cy} r={16.5} fill={HEX_FILL} />

        {outerAngles.map((angle, i) => {
          const rad = toRad(angle);
          const hx = cx + 6.2 * Math.cos(rad);
          const hy = cy + 6.2 * Math.sin(rad);
          return (
            <path
              key={`hex-${i}`}
              d={hexagonPath(hx, hy, 3.1, angle + 30)}
              fill={HEX_FILL}
              stroke={PANEL_STROKE}
              strokeWidth={0.6}
              strokeLinejoin="round"
            />
          );
        })}

        {outerAngles.map((angle, i) => {
          const rad = toRad(angle);
          const px = cx + 10.2 * Math.cos(rad);
          const py = cy + 10.2 * Math.sin(rad);
          return (
            <path
              key={`pent-${i}`}
              d={pentagonPath(px, py, 4.1, angle + 90)}
              fill={LEAGUE_COLORS[i]}
              stroke={PANEL_STROKE}
              strokeWidth={0.65}
              strokeLinejoin="round"
            />
          );
        })}

        <path
          d={pentagonPath(cx, cy, 4.2, -90)}
          fill="#ffffff"
          stroke={PANEL_STROKE}
          strokeWidth={0.65}
          strokeLinejoin="round"
        />
      </g>

      <circle cx={cx} cy={cy} r={16.5} stroke="#52525b" strokeWidth={0.75} fill="none" />
    </svg>
  );
}
