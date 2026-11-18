"use client";

import { useEffect, useRef } from "react";
import { useInteractiveEnabled } from "@/app/hooks/useInteractiveEnabled";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

/**
 * 사이드바 히어로 배경용 Canvas 컨스텔레이션.
 * - 입자끼리 가까우면 선으로 연결, 커서는 입자를 밀어냄.
 * - 데스크톱/reduced-motion off 환경에서만 렌더(useInteractiveEnabled).
 * - DPR 1.5 캡, 입자 수 제한, 탭이 숨겨지면 rAF 중단.
 */
export default function ParticleField({ className }: { className?: string }) {
  const enabled = useInteractiveEnabled();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const parent = canvas.parentElement!;
    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    const mouse = { x: -999, y: -999 };
    const LINK_DIST = 96;
    const REPEL_DIST = 90;

    const seed = () => {
      const count = Math.min(38, Math.round((width * height) / 9000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
      }));
    };

    const resize = () => {
      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    let raf = 0;
    const frame = () => {
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < REPEL_DIST && dist > 0) {
          p.vx += (dx / dist) * 0.35;
          p.vy += (dy / dist) * 0.35;
        }
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        p.x = Math.max(0, Math.min(width, p.x));
        p.y = Math.max(0, Math.min(height, p.y));
      }

      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const d = Math.hypot(
            particles[a].x - particles[b].x,
            particles[a].y - particles[b].y
          );
          if (d < LINK_DIST) {
            ctx.strokeStyle = `rgba(245,158,11,${0.14 * (1 - d / LINK_DIST)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }

      ctx.fillStyle = "rgba(245,158,11,0.55)";
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(frame);
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onLeave = () => {
      mouse.x = -999;
      mouse.y = -999;
    };
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else {
        raf = requestAnimationFrame(frame);
      }
    };

    const ro = new ResizeObserver(resize);
    ro.observe(parent);
    resize();
    window.addEventListener("mousemove", onMove, { passive: true });
    parent.addEventListener("mouseleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("mousemove", onMove);
      parent.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [enabled]);

  if (!enabled) return null;

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}
