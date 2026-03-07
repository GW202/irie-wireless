'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-1 text-xs">
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRight size={12} className="text-text-3" />}
            {item.href && !isLast ? (
              <Link href={item.href} className="text-text-3 hover:text-text-1 transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? 'text-text-1 font-medium' : 'text-text-3'}>
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
