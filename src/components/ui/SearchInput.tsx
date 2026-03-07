'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  debounceMs?: number;
  className?: string;
}

export default function SearchInput({
  placeholder = 'Search...',
  value: controlledValue,
  onChange,
  debounceMs = 300,
  className,
}: SearchInputProps) {
  const [localValue, setLocalValue] = useState(controlledValue ?? '');
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (controlledValue !== undefined) setLocalValue(controlledValue);
  }, [controlledValue]);

  const handleChange = useCallback(
    (val: string) => {
      setLocalValue(val);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => onChange?.(val), debounceMs);
    },
    [onChange, debounceMs]
  );

  return (
    <div className={`relative ${className || ''}`}>
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-3" />
      <input
        className="w-full bg-white/5 border border-border rounded-lg py-2 pl-10 pr-10 text-sm outline-none focus:ring-1 focus:ring-accent-cyan/50 placeholder:text-text-3 text-text-1"
        placeholder={placeholder}
        value={localValue}
        onChange={(e) => handleChange(e.target.value)}
        type="text"
      />
      {localValue && (
        <button
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-3 hover:text-text-1"
          onClick={() => handleChange('')}
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
