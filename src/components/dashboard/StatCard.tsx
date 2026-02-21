'use client';

import { useEffect, useRef } from 'react';
import { StatCardData } from '@/lib/types';

const colorMap = {
  cyan: { value: 'text-accent-cyan', rgb: 'rgb(0,229,255)' },
  green: { value: 'text-accent-green', rgb: 'rgb(0,255,157)' },
  amber: { value: 'text-accent-amber', rgb: 'rgb(255,184,0)' },
  purple: { value: 'text-accent-purple', rgb: 'rgb(167,139,250)' },
};

export default function StatCard({ label, value, change, changeDetail, color, sparklineData }: StatCardData) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colors = colorMap[color];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = parent.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = 40;

    const data = sparklineData;
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const step = canvas.width / (data.length - 1);

    ctx.beginPath();
    data.forEach((v, i) => {
      const x = i * step;
      const y = canvas.height - ((v - min) / range) * 30 - 5;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.strokeStyle = colors.rgb;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Fill gradient
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    const rgbaColor = colors.rgb.replace('rgb', 'rgba').replace(')', ',0.15)');
    grad.addColorStop(0, rgbaColor);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fill();
  }, [sparklineData, colors.rgb]);

  return (
    <div className="bg-bg-2 border border-border rounded-[10px] p-5 relative overflow-hidden transition-all duration-300 hover:border-border-light">
      <div className="font-mono text-[0.72rem] text-text-3 uppercase tracking-[0.06em] mb-2.5">
        {label}
      </div>
      <div className={`text-[1.8rem] font-bold tracking-tight mb-1.5 ${colors.value}`}>
        {value}
      </div>
      <div className="text-[0.68rem] font-mono flex items-center gap-1 text-accent-green">
        {change} <span className="text-text-3">{changeDetail}</span>
      </div>
      <canvas ref={canvasRef} className="absolute bottom-0 left-0 right-0 h-10" />
    </div>
  );
}
