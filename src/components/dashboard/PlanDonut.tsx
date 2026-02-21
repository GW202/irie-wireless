'use client';

import { useEffect, useRef } from 'react';
import { PLAN_DISTRIBUTION } from '@/lib/constants';

export default function PlanDonut() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cx = 60;
    const cy = 60;
    const R = 48;
    const r = 30;

    ctx.clearRect(0, 0, 120, 120);

    let startAngle = -Math.PI / 2;
    for (const seg of PLAN_DISTRIBUTION) {
      const endAngle = startAngle + (seg.percentage / 100) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(cx, cy, R, startAngle, endAngle);
      ctx.arc(cx, cy, r, endAngle, startAngle, true);
      ctx.closePath();
      ctx.fillStyle = seg.color;
      ctx.fill();
      startAngle = endAngle;
    }

    // Center text
    ctx.fillStyle = '#e8edf5';
    ctx.font = 'bold 14px Sora, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('247K', cx, cy + 2);
    ctx.fillStyle = '#4a5d75';
    ctx.font = '8px JetBrains Mono, monospace';
    ctx.fillText('TOTAL', cx, cy + 14);
  }, []);

  return (
    <div className="mt-5 border-t border-border pt-5">
      <div className="text-[0.75rem] font-medium mb-3">Plan Distribution</div>
      <div className="flex items-center gap-6 py-2">
        <canvas
          ref={canvasRef}
          width={120}
          height={120}
          className="w-[120px] h-[120px] shrink-0"
        />
        <div className="flex flex-col gap-2">
          {PLAN_DISTRIBUTION.map((plan) => (
            <div key={plan.name} className="flex items-center gap-2 text-[0.75rem] text-text-2">
              <div
                className="w-2 h-2 rounded-sm shrink-0"
                style={{ background: plan.color }}
              />
              {plan.name}
              <span className="ml-auto font-mono text-[0.68rem] text-text-1">
                {plan.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
