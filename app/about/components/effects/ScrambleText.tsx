"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface ScrambleTextProps {
  text: string;
  className?: string;
  /** 진입 후 시작까지 지연(ms) */
  delay?: number;
}

const GLYPHS = "!<>-_\\/[]{}—=+*^?#·:";

/**
 * 랜덤 문자로 흩어졌다 목표 텍스트로 해독되는 스크램블 리빌.
 * - 실제 텍스트는 sr-only로 항상 노출(접근성) → 시각 글리프는 aria-hidden.
 * - reduced-motion이면 최종 텍스트를 즉시 표시.
 */
export default function ScrambleText({
  text,
  className,
  delay = 200,
}: ScrambleTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [output, setOutput] = useState(text);

  useEffect(() => {
    if (!inView) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) {
      setOutput(text);
      return;
    }

    let raf = 0;
    let frame = 0;
    const queue = Array.from(text).map((to) => ({
      to,
      start: Math.floor(Math.random() * 12),
      end: Math.floor(Math.random() * 12) + 14,
      char: "",
    }));

    const tick = () => {
      let done = 0;
      const out = queue
        .map((q) => {
          if (q.to === " ") return " ";
          if (frame >= q.end) {
            done++;
            return q.to;
          }
          if (frame >= q.start) {
            if (!q.char || Math.random() < 0.28) {
              q.char = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
            }
            return q.char;
          }
          return "";
        })
        .join("");

      setOutput(out);
      frame++;
      if (done < queue.length) raf = requestAnimationFrame(tick);
    };

    const timer = window.setTimeout(() => {
      raf = requestAnimationFrame(tick);
    }, delay);

    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [inView, text, delay]);

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{output}</span>
    </span>
  );
}
