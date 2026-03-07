import { cn } from '@/lib/utils';

interface AvatarProps {
  name: string;
  imageUrl?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-7 h-7 text-[10px]',
  md: 'w-8 h-8 text-xs',
  lg: 'w-10 h-10 text-sm',
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function Avatar({ name, imageUrl, size = 'md', className }: AvatarProps) {
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className={cn('rounded-full object-cover', sizeClasses[size], className || '')}
      />
    );
  }

  return (
    <div
      className={cn(
        'rounded-full bg-accent-cyan/10 flex items-center justify-center font-semibold text-accent-cyan font-mono shrink-0',
        sizeClasses[size],
        className || ''
      )}
    >
      {getInitials(name)}
    </div>
  );
}
