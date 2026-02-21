'use client';

interface IrieLogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

export default function IrieLogo({ size = 40, showText = false, className = '' }: IrieLogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {/* Background rounded square */}
        <rect
          x="2"
          y="2"
          width="60"
          height="60"
          rx="14"
          fill="url(#logoBg)"
          stroke="url(#logoStroke)"
          strokeWidth="1.5"
        />

        {/* Circuit traces - decorative network lines */}
        <path
          d="M8 16h6l4 4h8"
          stroke="rgba(0,229,255,0.15)"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <path
          d="M56 48h-6l-4-4h-8"
          stroke="rgba(0,255,157,0.15)"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <path
          d="M48 8v6l-4 4v6"
          stroke="rgba(0,229,255,0.12)"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <path
          d="M16 56v-6l4-4v-6"
          stroke="rgba(0,255,157,0.12)"
          strokeWidth="1"
          strokeLinecap="round"
        />

        {/* Node dots at circuit junctions */}
        <circle cx="8" cy="16" r="1.5" fill="rgba(0,229,255,0.3)" />
        <circle cx="56" cy="48" r="1.5" fill="rgba(0,255,157,0.3)" />
        <circle cx="48" cy="8" r="1.5" fill="rgba(0,229,255,0.2)" />
        <circle cx="16" cy="56" r="1.5" fill="rgba(0,255,157,0.2)" />

        {/* Main "IW" lettermark */}
        {/* I */}
        <path
          d="M17 19h6v26h-6z"
          fill="url(#letterGradient)"
        />
        {/* I top serif accent */}
        <rect x="16" y="18" width="8" height="2.5" rx="1" fill="url(#letterGradient)" />
        {/* I bottom serif accent */}
        <rect x="16" y="43.5" width="8" height="2.5" rx="1" fill="url(#letterGradient)" />

        {/* W */}
        <path
          d="M28 19h5.5l4 17.5L41 24l3.5 12.5L49 19h5.5l-8 27h-5l-3-10.5-3 10.5h-5l-8-27z"
          fill="url(#letterGradient)"
        />

        {/* Glow ring - orbital element */}
        <ellipse
          cx="32"
          cy="32"
          rx="28"
          ry="8"
          transform="rotate(-20 32 32)"
          stroke="url(#orbitGradient)"
          strokeWidth="0.8"
          fill="none"
          opacity="0.4"
        />

        {/* Active node on orbit */}
        <circle cx="55" cy="24" r="2.5" fill="url(#letterGradient)" opacity="0.8" />
        <circle cx="55" cy="24" r="4" stroke="rgba(0,229,255,0.3)" strokeWidth="0.5" fill="none" />

        {/* Definitions */}
        <defs>
          <linearGradient id="logoBg" x1="0" y1="0" x2="64" y2="64">
            <stop offset="0%" stopColor="#0a0e14" />
            <stop offset="100%" stopColor="#0d1219" />
          </linearGradient>
          <linearGradient id="logoStroke" x1="0" y1="0" x2="64" y2="64">
            <stop offset="0%" stopColor="rgba(0,229,255,0.4)" />
            <stop offset="50%" stopColor="rgba(0,255,157,0.2)" />
            <stop offset="100%" stopColor="rgba(0,229,255,0.4)" />
          </linearGradient>
          <linearGradient id="letterGradient" x1="16" y1="18" x2="56" y2="48">
            <stop offset="0%" stopColor="#00e5ff" />
            <stop offset="100%" stopColor="#00ff9d" />
          </linearGradient>
          <linearGradient id="orbitGradient" x1="4" y1="32" x2="60" y2="32">
            <stop offset="0%" stopColor="rgba(0,229,255,0)" />
            <stop offset="50%" stopColor="rgba(0,229,255,0.6)" />
            <stop offset="100%" stopColor="rgba(0,255,157,0)" />
          </linearGradient>
        </defs>
      </svg>

      {showText && (
        <span className="font-display font-bold text-[1.3rem] tracking-tight text-text-1">
          Irie Wireless
        </span>
      )}
    </div>
  );
}
