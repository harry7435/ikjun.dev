"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import CountUp from "./effects/CountUp";
import { metrics, metricsCaption } from "../data/about-data";

/** 스크롤 진입 시 0 → 목표 너비로 차오르는 값. reduced-motion이면 즉시. */
function useRevealWidth(ratio: number) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -80px 0px" });
  const [width, setWidth] = useState("0%");

  useEffect(() => {
    if (!inView) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setWidth(`${ratio * 100}%`);
      return;
    }
    const id = requestAnimationFrame(() => setWidth(`${ratio * 100}%`));
    return () => cancelAnimationFrame(id);
  }, [inView, ratio]);

  return { ref, width };
}

function AnimatedBar({ ratio, className = "" }: { ratio: number; className?: string }) {
  const { ref, width } = useRevealWidth(ratio);
  return (
    <div
      ref={ref}
      className={`h-1.5 overflow-hidden rounded-full bg-gray-200/70 dark:bg-gray-800 ${className}`}
    >
      <div
        className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-300 transition-[width] duration-1000 ease-out motion-reduce:transition-none"
        style={{ width }}
      />
    </div>
  );
}

export default function MetricsBand() {
  return (
    <div className="mb-10 mt-8">
      <dl className="grid grid-cols-3 gap-4 sm:gap-6">
        {metrics.map((m) => (
          <div key={m.label} className="border-t border-gray-200 pt-3 dark:border-gray-800">
            <dd className="font-mono text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
              <CountUp
                value={m.value}
                prefix={m.prefix}
                suffix={m.suffix}
                decimals={m.decimals}
              />
            </dd>
            <dt className="mt-1 text-xs text-gray-500 dark:text-gray-400">{m.label}</dt>
            <AnimatedBar ratio={m.bar} className="mt-3" />
          </div>
        ))}
      </dl>
      <p className="mt-3 font-mono text-[11px] text-gray-400 dark:text-gray-500">
        · {metricsCaption}
      </p>
    </div>
  );
}
