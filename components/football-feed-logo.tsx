// Big 5 league-inspired colors: PL, La Liga, Serie A, Bundesliga, Ligue 1
const LEAGUE_COLORS = ["#7C3AED", "#EF4444", "#3B82F6", "#F59E0B", "#10B981"];

export function FootballFeedLogo({ size = 36 }: { size?: number }) {
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
      <circle cx="18" cy="18" r="17" fill="#18181b" stroke="#3f3f46" strokeWidth="1" />
      {LEAGUE_COLORS.map((color, i) => {
        const startAngle = i * 72 - 90;
        const endAngle = startAngle + 72;
        const toRad = (deg: number) => (deg * Math.PI) / 180;
        const x1 = 18 + 16 * Math.cos(toRad(startAngle));
        const y1 = 18 + 16 * Math.sin(toRad(startAngle));
        const x2 = 18 + 16 * Math.cos(toRad(endAngle));
        const y2 = 18 + 16 * Math.sin(toRad(endAngle));
        return (
          <path
            key={color}
            d={`M 18 18 L ${x1} ${y1} A 16 16 0 0 1 ${x2} ${y2} Z`}
            fill={color}
            opacity={0.9}
          />
        );
      })}
      <path
        d="M18 11 L21.5 14.5 L20 19.5 L16 19.5 L14.5 14.5 Z"
        fill="#fafafa"
        stroke="#27272a"
        strokeWidth="0.75"
      />
      <circle cx="18" cy="18" r="16" fill="none" stroke="#52525b" strokeWidth="0.5" />
    </svg>
  );
}
