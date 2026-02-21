'use client';

interface IrieLogoProps {
  /** Height of the logo in px — width scales proportionally */
  height?: number;
  /** 'full' = icon + wordmark, 'icon' = icon only */
  variant?: 'full' | 'icon';
  className?: string;
}

export default function IrieLogo({ height = 36, variant = 'full', className = '' }: IrieLogoProps) {
  if (variant === 'icon') {
    return (
      <svg
        height={height}
        width={height}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 ${className}`}
      >
        <IconMark />
        <SharedDefs prefix="icon" />
      </svg>
    );
  }

  // Full horizontal logo: icon + "IRIE WIRELESS" wordmark
  // viewBox is 320 x 64 — icon on left, text on right
  const aspectRatio = 320 / 64;
  const width = height * aspectRatio;

  return (
    <svg
      height={height}
      width={width}
      viewBox="0 0 320 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      {/* === Icon Mark (left side) === */}
      <g>
        <IconMark />
      </g>

      {/* === Wordmark (right side) === */}
      <g>
        {/* "IRIE" — primary brand name, bold weight */}
        <text
          x="78"
          y="34"
          fontFamily="'Sora', system-ui, -apple-system, sans-serif"
          fontWeight="700"
          fontSize="26"
          letterSpacing="0.5"
          fill="url(#wordGradient)"
          dominantBaseline="central"
        >
          IRIE
        </text>

        {/* "WIRELESS" — secondary, lighter weight */}
        <text
          x="156"
          y="34"
          fontFamily="'Sora', system-ui, -apple-system, sans-serif"
          fontWeight="400"
          fontSize="26"
          letterSpacing="2"
          fill="#e8edf5"
          dominantBaseline="central"
        >
          WIRELESS
        </text>

        {/* Accent line separator between IRIE and WIRELESS */}
        <rect x="150" y="18" width="1.5" height="28" rx="0.75" fill="url(#wordGradient)" opacity="0.3" />

        {/* Decorative circuit dot cluster — top right */}
        <circle cx="304" cy="14" r="2" fill="url(#wordGradient)" opacity="0.5" />
        <circle cx="304" cy="14" r="4" stroke="rgba(0,229,255,0.15)" strokeWidth="0.5" fill="none" />
        <path d="M298 14h-12" stroke="rgba(0,229,255,0.1)" strokeWidth="0.5" strokeLinecap="round" />
        <circle cx="286" cy="14" r="1" fill="rgba(0,229,255,0.2)" />

        {/* Subtle tagline track — bottom */}
        <path d="M78 52h228" stroke="rgba(0,229,255,0.06)" strokeWidth="0.5" />
        <circle cx="78" cy="52" r="1.5" fill="rgba(0,229,255,0.12)" />
        <circle cx="306" cy="52" r="1.5" fill="rgba(0,255,157,0.12)" />
      </g>

      <SharedDefs prefix="full" />

      {/* Wordmark-specific gradient */}
      <defs>
        <linearGradient id="wordGradient" x1="78" y1="20" x2="160" y2="44">
          <stop offset="0%" stopColor="#00e5ff" />
          <stop offset="100%" stopColor="#00ff9d" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/** Reusable icon mark — the rounded square with IW monogram */
function IconMark() {
  return (
    <>
      {/* Background rounded square */}
      <rect
        x="2" y="2" width="60" height="60" rx="14"
        fill="url(#logoBg)"
        stroke="url(#logoStroke)"
        strokeWidth="1.5"
      />

      {/* Circuit traces */}
      <path d="M8 16h6l4 4h8" stroke="rgba(0,229,255,0.15)" strokeWidth="1" strokeLinecap="round" />
      <path d="M56 48h-6l-4-4h-8" stroke="rgba(0,255,157,0.15)" strokeWidth="1" strokeLinecap="round" />
      <path d="M48 8v6l-4 4v6" stroke="rgba(0,229,255,0.12)" strokeWidth="1" strokeLinecap="round" />
      <path d="M16 56v-6l4-4v-6" stroke="rgba(0,255,157,0.12)" strokeWidth="1" strokeLinecap="round" />

      {/* Node dots */}
      <circle cx="8" cy="16" r="1.5" fill="rgba(0,229,255,0.3)" />
      <circle cx="56" cy="48" r="1.5" fill="rgba(0,255,157,0.3)" />
      <circle cx="48" cy="8" r="1.5" fill="rgba(0,229,255,0.2)" />
      <circle cx="16" cy="56" r="1.5" fill="rgba(0,255,157,0.2)" />

      {/* I letterform */}
      <path d="M17 19h6v26h-6z" fill="url(#letterGradient)" />
      <rect x="16" y="18" width="8" height="2.5" rx="1" fill="url(#letterGradient)" />
      <rect x="16" y="43.5" width="8" height="2.5" rx="1" fill="url(#letterGradient)" />

      {/* W letterform */}
      <path
        d="M28 19h5.5l4 17.5L41 24l3.5 12.5L49 19h5.5l-8 27h-5l-3-10.5-3 10.5h-5l-8-27z"
        fill="url(#letterGradient)"
      />

      {/* Orbital ring */}
      <ellipse
        cx="32" cy="32" rx="28" ry="8"
        transform="rotate(-20 32 32)"
        stroke="url(#orbitGradient)"
        strokeWidth="0.8"
        fill="none"
        opacity="0.4"
      />

      {/* Active orbital node */}
      <circle cx="55" cy="24" r="2.5" fill="url(#letterGradient)" opacity="0.8" />
      <circle cx="55" cy="24" r="4" stroke="rgba(0,229,255,0.3)" strokeWidth="0.5" fill="none" />
    </>
  );
}

/** Shared gradient definitions used by the icon */
function SharedDefs({ prefix }: { prefix: string }) {
  return (
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
  );
}
