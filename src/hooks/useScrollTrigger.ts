'use client';

import { useEffect, useRef, useCallback } from 'react';

export function useScrollTrigger(
  onTrigger: () => void,
  sectionId: string
) {
  const hasTriggered = useRef(false);

  const trigger = useCallback(() => {
    if (!hasTriggered.current) {
      hasTriggered.current = true;
      onTrigger();
    }
  }, [onTrigger]);

  useEffect(() => {
    const section = document.getElementById(sectionId);
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
          trigger();
          observer.disconnect();
        }
      },
      { threshold: 0 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [sectionId, trigger]);

  return { hasTriggered: hasTriggered.current };
}
