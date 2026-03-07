'use client';

import { CATEGORIES } from '@/lib/carrier-pulse/constants';

export default function CategoryBadge({ category }: { category: string }) {
  const cat = CATEGORIES[category];
  if (!cat) return <span className="text-xs text-text-3">{category}</span>;

  return (
    <span
      className="inline-block text-xs font-medium px-2 py-0.5 rounded-full"
      style={{
        backgroundColor: `${cat.color}20`,
        color: cat.color,
        border: `1px solid ${cat.color}40`,
      }}
    >
      {cat.name}
    </span>
  );
}
