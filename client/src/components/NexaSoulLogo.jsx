export default function NexaSoulLogo({ className = 'h-8' }) {
  return (
    <svg
      viewBox="0 0 280 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} w-auto`}
      preserveAspectRatio="xMidYMid meet"
      style={{ filter: 'drop-shadow(0 2px 6px rgba(0, 212, 255, 0.3))' }}
    >
      <defs>
        <linearGradient id="nexa-cyan" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00D4FF" />
          <stop offset="100%" stopColor="#00BFFF" />
        </linearGradient>
        <linearGradient id="nexa-lime" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ADFF2F" />
          <stop offset="100%" stopColor="#39FF14" />
        </linearGradient>
        <linearGradient id="icon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E0F2FE" />
          <stop offset="100%" stopColor="#BAE6FD" />
        </linearGradient>
      </defs>

      {/* Circular icon on the left */}
      <g transform="translate(4, 6)">
        <circle cx="24" cy="24" r="22" fill="url(#icon-gradient)" stroke="#0EA5E9" strokeWidth="2" />
        <path
          d="M16 18 L24 13 L32 18 L32 28 L24 33 L16 28 Z"
          fill="none"
          stroke="#0284C7"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M24 33 L24 23 L32 18"
          fill="none"
          stroke="#0284C7"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M24 23 L16 18"
          fill="none"
          stroke="#0284C7"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      {/* Brand text */}
      <text
        x="64"
        y="44"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize="38"
        fontWeight="900"
        letterSpacing="-1"
        dominantBaseline="middle"
        alignmentBaseline="middle"
      >
        <tspan fill="url(#nexa-cyan)">NEXA</tspan>
        <tspan fill="url(#nexa-lime)">SOUL</tspan>
      </text>
    </svg>
  );
}
