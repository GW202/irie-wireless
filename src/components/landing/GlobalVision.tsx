'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { GLOBE_COUNTRIES, GLOBE_LINKS, REGION_COLORS } from '@/lib/constants';
import { CONTINENT_OUTLINES } from '@/lib/continents';
import { sectionVariants } from '@/lib/animations';

interface BgDot {
  lat: number;
  lng: number;
  r: number;
}

export default function GlobalVision() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; name: string; detail: string } | null>(null);

  const rotationRef = useRef(0);
  const rotationOffsetRef = useRef(0);
  const autoRotateRef = useRef(true);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const lastDragTimeRef = useRef(0);
  const mouseRef = useRef({ x: -1, y: -1 });
  const bgDotsRef = useRef<BgDot[]>([]);
  const animRef = useRef<number>(0);

  useEffect(() => {
    // Generate background dots once
    bgDotsRef.current = Array.from({ length: 300 }, () => ({
      lat: (Math.random() - 0.5) * Math.PI,
      lng: Math.random() * Math.PI * 2,
      r: Math.random() * 1.2 + 0.3,
    }));
  }, []);

  const project = useCallback(
    (lat: number, lng: number, cx: number, cy: number, R: number, rot: number) => {
      const x3d = Math.cos(lat) * Math.sin(lng + rot);
      const y3d = Math.sin(lat);
      const z3d = Math.cos(lat) * Math.cos(lng + rot);
      return { px: cx + x3d * R, py: cy - y3d * R, z: z3d };
    },
    []
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;

    function resize() {
      const rect = container!.getBoundingClientRect();
      width = canvas!.width = rect.width;
      height = canvas!.height = rect.height;
    }
    resize();
    window.addEventListener('resize', resize);

    // Mouse handlers
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas!.getBoundingClientRect();
      mouseRef.current.x = (e.clientX - rect.left) * (canvas!.width / rect.width);
      mouseRef.current.y = (e.clientY - rect.top) * (canvas!.height / rect.height);
      if (isDraggingRef.current) {
        const dx = e.clientX - dragStartXRef.current;
        rotationOffsetRef.current = dx * 0.005;
        autoRotateRef.current = false;
        lastDragTimeRef.current = Date.now();
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      dragStartXRef.current = e.clientX - rotationOffsetRef.current / 0.005;
      canvas!.style.cursor = 'grabbing';
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      canvas!.style.cursor = 'crosshair';
      const time = Date.now();
      lastDragTimeRef.current = time;
      setTimeout(() => {
        if (Date.now() - lastDragTimeRef.current >= 2900) {
          autoRotateRef.current = true;
        }
      }, 3000);
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1, y: -1 };
      isDraggingRef.current = false;
      canvas!.style.cursor = 'crosshair';
      setTooltip(null);
    };

    // Touch handlers
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        dragStartXRef.current = e.touches[0].clientX - rotationOffsetRef.current / 0.005;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDraggingRef.current && e.touches.length === 1) {
        e.preventDefault();
        const dx = e.touches[0].clientX - dragStartXRef.current;
        rotationOffsetRef.current = dx * 0.005;
        autoRotateRef.current = false;
        lastDragTimeRef.current = Date.now();
      }
    };

    const handleTouchEnd = () => {
      isDraggingRef.current = false;
      const time = Date.now();
      lastDragTimeRef.current = time;
      setTimeout(() => {
        if (Date.now() - lastDragTimeRef.current >= 2900) {
          autoRotateRef.current = true;
        }
      }, 3000);
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd);

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      if (autoRotateRef.current) rotationRef.current += 0.0015;
      const rot = rotationRef.current + rotationOffsetRef.current;
      const cx = width / 2;
      const cy = height / 2;
      const R = Math.min(width, height) * 0.38;

      // Globe outline
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.06)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Grid lines
      for (let i = 1; i < 6; i++) {
        const latLine = (i / 6 - 0.5) * Math.PI;
        ctx.beginPath();
        for (let a = 0; a <= Math.PI * 2; a += 0.05) {
          const p = project(latLine, a, cx, cy, R, rot);
          if (p.z < 0) continue;
          if (a === 0 || p.z < 0.01) ctx.moveTo(p.px, p.py);
          else ctx.lineTo(p.px, p.py);
        }
        ctx.strokeStyle = 'rgba(0, 229, 255, 0.02)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Continent outlines
      for (const outline of CONTINENT_OUTLINES) {
        ctx.beginPath();
        let started = false;
        let prevZ = 0;
        for (let i = 0; i < outline.length; i++) {
          const [lat, lng] = outline[i];
          const p = project(lat, lng, cx, cy, R, rot);
          if (p.z < 0) {
            started = false;
            prevZ = p.z;
            continue;
          }
          if (!started || prevZ < 0) {
            ctx.moveTo(p.px, p.py);
            started = true;
          } else {
            ctx.lineTo(p.px, p.py);
          }
          prevZ = p.z;
        }
        ctx.strokeStyle = 'rgba(0, 229, 255, 0.12)';
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // Subtle fill for land masses
        ctx.beginPath();
        started = false;
        for (let i = 0; i < outline.length; i++) {
          const [lat, lng] = outline[i];
          const p = project(lat, lng, cx, cy, R, rot);
          if (p.z < 0) {
            started = false;
            continue;
          }
          if (!started) {
            ctx.moveTo(p.px, p.py);
            started = true;
          } else {
            ctx.lineTo(p.px, p.py);
          }
        }
        ctx.closePath();
        ctx.fillStyle = 'rgba(0, 229, 255, 0.03)';
        ctx.fill();
      }

      // Background dots
      for (const d of bgDotsRef.current) {
        const p = project(d.lat, d.lng, cx, cy, R, rot);
        if (p.z < 0) continue;
        ctx.beginPath();
        ctx.arc(p.px, p.py, d.r * (0.4 + p.z * 0.6), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 229, 255, ${0.08 + p.z * 0.15})`;
        ctx.fill();
      }

      // Connection lines
      for (const link of GLOBE_LINKS) {
        const a = GLOBE_COUNTRIES[link[0]];
        const b = GLOBE_COUNTRIES[link[1]];
        const pa = project(a.lat, a.lng, cx, cy, R, rot);
        const pb = project(b.lat, b.lng, cx, cy, R, rot);
        if (pa.z < 0 && pb.z < 0) continue;
        const alpha = Math.min(pa.z, pb.z);
        if (alpha < 0) continue;
        const mx = (pa.px + pb.px) / 2;
        const my = (pa.py + pb.py) / 2 - Math.abs(pa.px - pb.px) * 0.1;
        ctx.beginPath();
        ctx.moveTo(pa.px, pa.py);
        ctx.quadraticCurveTo(mx, my, pb.px, pb.py);
        ctx.strokeStyle = `rgba(0, 229, 255, ${0.04 * alpha})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // Detect hover & draw country nodes
      let hoveredCountry: (typeof GLOBE_COUNTRIES)[0] | null = null;
      let hoveredScreen = { x: 0, y: 0 };
      let closestDist = Infinity;

      for (const c of GLOBE_COUNTRIES) {
        const p = project(c.lat, c.lng, cx, cy, R, rot);
        if (p.z < -0.05) continue;
        const alpha = Math.max(0, 0.2 + p.z * 0.8);
        const visibleR = c.r * (0.5 + p.z * 0.5);
        const color = REGION_COLORS[c.region] || '0, 229, 255';

        // Hit test
        if (mouseRef.current.x >= 0 && p.z > 0.1) {
          const dx = mouseRef.current.x - p.px;
          const dy = mouseRef.current.y - p.py;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const hitRadius = Math.max(visibleR * 3, 18);
          if (dist < hitRadius && dist < closestDist) {
            closestDist = dist;
            hoveredCountry = c;
            hoveredScreen = { x: p.px, y: p.py };
          }
        }

        const isHovered = hoveredCountry === c;

        // Outer glow
        ctx.beginPath();
        ctx.arc(p.px, p.py, visibleR * (isHovered ? 4 : 2.5), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, ${alpha * (isHovered ? 0.12 : 0.06)})`;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(p.px, p.py, visibleR * (isHovered ? 1.4 : 1), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, ${alpha * (isHovered ? 1 : 0.7)})`;
        ctx.fill();

        // Pulse ring on hover
        if (isHovered && p.z > 0.1) {
          const pulseR = visibleR * (2 + Math.sin(Date.now() * 0.005) * 0.8);
          ctx.beginPath();
          ctx.arc(p.px, p.py, pulseR, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${color}, ${alpha * 0.3})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Highlight connections
          const idx = GLOBE_COUNTRIES.indexOf(c);
          for (const link of GLOBE_LINKS) {
            if (link[0] !== idx && link[1] !== idx) continue;
            const other = GLOBE_COUNTRIES[link[0] === idx ? link[1] : link[0]];
            const po = project(other.lat, other.lng, cx, cy, R, rot);
            if (po.z < 0) continue;
            const mx2 = (p.px + po.px) / 2;
            const my2 = (p.py + po.py) / 2 - Math.abs(p.px - po.px) * 0.1;
            ctx.beginPath();
            ctx.moveTo(p.px, p.py);
            ctx.quadraticCurveTo(mx2, my2, po.px, po.py);
            ctx.strokeStyle = `rgba(${color}, ${0.25 * po.z})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }
        }
      }

      // Update tooltip
      if (hoveredCountry) {
        const rect = canvas!.getBoundingClientRect();
        const scaleX = rect.width / canvas!.width;
        const scaleY = rect.height / canvas!.height;
        setTooltip({
          x: hoveredScreen.x * scaleX,
          y: hoveredScreen.y * scaleY,
          name: hoveredCountry.name,
          detail: hoveredCountry.detail,
        });
      } else {
        setTooltip(null);
      }

      animRef.current = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, [project]);

  return (
    <section className="py-32 bg-bg-1 text-center" id="vision">
      <div className="max-w-[1200px] mx-auto px-5 md:px-8">
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <div className="font-mono text-[0.8rem] uppercase tracking-[0.18em] text-accent-cyan mb-5 flex items-center gap-3 justify-center">
            <span className="w-8 h-0.5 bg-gradient-to-r from-accent-cyan to-accent-green rounded-sm" />
            Global Vision
          </div>
          <h2 className="text-[clamp(2.6rem,5.5vw,4rem)] font-bold tracking-[-0.035em] leading-[1.1] mb-6">
            Global by <span className="gradient-text">Architecture</span>
          </h2>
          <p className="text-lg text-text-2 leading-relaxed max-w-[620px] mx-auto mb-12">
            Designed to integrate across US carriers today and expand into global telecom markets
            through API abstraction and strategic partnerships.
          </p>
        </motion.div>

        <motion.div
          ref={containerRef}
          className="relative w-full max-w-[800px] mx-auto aspect-[4/3] bg-bg-2 border border-border rounded-2xl overflow-hidden cursor-crosshair"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <canvas ref={canvasRef} className="w-full h-full" />
          {tooltip && (
            <div
              className="absolute pointer-events-none bg-[rgba(6,8,12,0.92)] border border-accent-cyan/40 rounded-lg px-3.5 py-2 font-mono text-[0.78rem] text-accent-cyan whitespace-nowrap z-10 shadow-[0_4px_20px_rgba(0,229,255,0.12)] -translate-x-1/2 -translate-y-[130%] transition-opacity duration-200"
              style={{ left: tooltip.x, top: tooltip.y }}
            >
              <span className="font-semibold text-text-1 block">{tooltip.name}</span>
              <span className="text-[0.68rem] text-text-2">{tooltip.detail}</span>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
