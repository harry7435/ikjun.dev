"use client";

import { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { useInteractiveEnabled } from "../../hooks/useInteractiveEnabled";

interface TiltCardProps {
  children: React.ReactNode;
  /** 기울어지는 카드 요소에 적용될 클래스 */
  className?: string;
  /** 최대 회전각(deg) */
  max?: number;
  /** 커서 위치를 따라가는 은은한 글로우 표시 */
  glow?: boolean;
}

/**
 * 커서 위치에 따라 3D로 기우는 카드 래퍼.
 * 인터랙티브 환경이 아니면 perspective/모션 없이 그대로 렌더한다.
 */
export default function TiltCard({
  children,
  className = "",
  max = 8,
  glow = true,
}: TiltCardProps) {
  const enabled = useInteractiveEnabled();
  const ref = useRef<HTMLDivElement>(null);

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const rotateX = useSpring(rx, { stiffness: 300, damping: 20 });
  const rotateY = useSpring(ry, { stiffness: 300, damping: 20 });
  const glowBg = useMotionTemplate`radial-gradient(240px circle at ${gx}% ${gy}%, rgba(245,158,11,0.14), transparent 60%)`;

  if (!enabled) {
    return <div className={className}>{children}</div>;
  }

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    rx.set((0.5 - py) * max);
    ry.set((px - 0.5) * max);
    gx.set(px * 100);
    gy.set(py * 100);
  };

  const reset = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <div style={{ perspective: 900 }}>
      <motion.div
        ref={ref}
        className={className}
        onPointerMove={handleMove}
        onPointerLeave={reset}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          position: "relative",
        }}
      >
        {children}
        {glow && (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 [.group:hover_&]:opacity-100"
            style={{ background: glowBg }}
          />
        )}
      </motion.div>
    </div>
  );
}
