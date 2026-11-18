"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useInteractiveEnabled } from "@/app/hooks/useInteractiveEnabled";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  /** 끌림 강도 (0~1) */
  strength?: number;
}

/**
 * 포인터가 가까워지면 요소가 커서 쪽으로 끌려가는 자석 효과 래퍼.
 * 인터랙티브 환경이 아니면(터치/reduced-motion) 아무 변형 없이 그대로 렌더.
 */
export default function MagneticButton({
  children,
  className,
  strength = 0.4,
}: MagneticButtonProps) {
  const enabled = useInteractiveEnabled();
  const ref = useRef<HTMLSpanElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 18 });
  const springY = useSpring(y, { stiffness: 260, damping: 18 });

  if (!enabled) {
    return <span className={className}>{children}</span>;
  }

  const handleMove = (e: React.PointerEvent<HTMLSpanElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    x.set(relX * strength);
    y.set(relY * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span
      ref={ref}
      className={className}
      style={{ x: springX, y: springY, display: "inline-flex" }}
      onPointerMove={handleMove}
      onPointerLeave={reset}
    >
      {children}
    </motion.span>
  );
}
