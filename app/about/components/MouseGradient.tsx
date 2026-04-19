"use client";

import { useEffect, useRef, useState } from "react";
import { useMousePosition } from "../hooks/useMousePosition";

export default function MouseGradient() {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    setEnabled(mq.matches && !reduced.matches);
  }, []);

  useMousePosition(ref, enabled);

  if (!enabled) return null;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-40 transition-opacity duration-300"
      style={{
        background:
          "radial-gradient(600px circle at var(--mx, 50%) var(--my, 50%), var(--about-gradient-color), transparent 80%)",
      }}
    />
  );
}
