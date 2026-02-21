'use client';

import Image from 'next/image';

interface IrieLogoProps {
  /** Height of the logo in px — width scales proportionally */
  height?: number;
  /**
   * 'horizontal' = orbital icon + IRIE WIRELESS side by side (for navbars, headers)
   * 'stacked'    = full stacked logo with icon above text (for hero, footer, splash)
   * 'icon'       = orbital symbol only (for favicon-size, small spaces)
   */
  variant?: 'horizontal' | 'stacked' | 'icon';
  className?: string;
}

const LOGO_ASSETS = {
  horizontal: { src: '/irie-logo-horizontal.png', width: 665, height: 200 },
  stacked: { src: '/irie-logo-brand.png', width: 680, height: 705 },
  icon: { src: '/irie-logo-icon.png', width: 680, height: 446 },
} as const;

export default function IrieLogo({ height = 36, variant = 'horizontal', className = '' }: IrieLogoProps) {
  const asset = LOGO_ASSETS[variant];
  const aspectRatio = asset.width / asset.height;
  const computedWidth = Math.round(height * aspectRatio);

  return (
    <Image
      src={asset.src}
      alt="Irie Wireless"
      width={computedWidth}
      height={height}
      className={`shrink-0 object-contain ${className}`}
      priority
    />
  );
}
