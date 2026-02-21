'use client';

import { ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'nav';

interface ButtonBaseProps {
  variant?: ButtonVariant;
  children: React.ReactNode;
}

type ButtonAsButton = ButtonBaseProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type ButtonAsLink = ButtonBaseProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

type ButtonProps = ButtonAsButton | ButtonAsLink;

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-br from-accent-cyan to-accent-green text-bg-0 font-semibold text-sm rounded-lg cursor-pointer transition-all duration-300 tracking-tight hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,229,255,0.25)]',
  secondary:
    'inline-flex items-center gap-2 px-8 py-3.5 bg-transparent text-text-1 font-medium text-sm border border-border rounded-lg cursor-pointer transition-all duration-300 hover:border-text-3 hover:bg-white/[0.02]',
  nav:
    'px-5 py-2 bg-transparent border border-accent-cyan text-accent-cyan rounded-md font-medium text-sm transition-all duration-300 hover:bg-accent-cyan/10 hover:shadow-[0_0_20px_rgba(0,229,255,0.15)]',
};

export default function Button({ variant = 'primary', children, ...props }: ButtonProps) {
  const classes = variantClasses[variant];

  if ('href' in props && props.href) {
    const { href, ...rest } = props as ButtonAsLink;
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...(props as ButtonAsButton)}>
      {children}
    </button>
  );
}
