"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useInteractiveEnabled } from "../../hooks/useInteractiveEnabled";

type Bar = {
  label: string;
  start: number;
  end: number;
  muted?: boolean;
  delay: number;
};

const STEP = 0.55;

const BEFORE: Bar[] = [
  { label: "내 코스", start: 0, end: 30, delay: 0 },
  { label: "전체 코스", start: 30, end: 60, delay: STEP },
  {
    label: "즐겨찾기 (화면 표시 후 브라우저에서)",
    start: 64,
    end: 94,
    muted: true,
    delay: STEP * 2,
  },
];

const AFTER: Bar[] = [
  { label: "내 코스", start: 0, end: 30, delay: 0 },
  { label: "전체 코스", start: 0, end: 30, delay: 0 },
  { label: "즐겨찾기 (서버에서 함께)", start: 0, end: 30, delay: 0 },
];

function Lane({
  title,
  bars,
  animateKey,
  animated,
  accent,
}: {
  title: string;
  bars: Bar[];
  animateKey: number;
  animated: boolean;
  accent: boolean;
}) {
  return (
    <div>
      <p className="mb-2 font-mono text-xs font-semibold text-gray-700 dark:text-gray-300">
        {title}
      </p>
      <div className="space-y-2">
        {bars.map((bar) => (
          <div key={bar.label}>
            <p className="mb-1 text-xs text-gray-600 dark:text-gray-400">
              {bar.label}
            </p>
            <div className="relative h-2.5 rounded-full bg-gray-200/70 dark:bg-gray-800">
              <motion.div
                // key가 바뀌면 remount되어 0 -> 1 애니메이션이 처음부터 다시 재생된다
                key={animateKey}
                className={`absolute inset-y-0 origin-left rounded-full ${
                  bar.muted
                    ? "bg-gray-400 dark:bg-gray-500"
                    : accent
                      ? "bg-amber-500"
                      : "bg-gray-600 dark:bg-gray-300"
                }`}
                style={{
                  left: `${bar.start}%`,
                  width: `${bar.end - bar.start}%`,
                }}
                initial={{ scaleX: animated ? 0 : 1 }}
                animate={{ scaleX: 1 }}
                transition={{
                  duration: 0.5,
                  delay: bar.delay,
                  ease: "easeOut",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ParallelFetchDemo() {
  const interactive = useInteractiveEnabled();
  const [run, setRun] = useState(0);

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900/60">
      <div className="space-y-5">
        <Lane
          title="이전 · 순서대로"
          bars={BEFORE}
          animateKey={run}
          animated={interactive && run > 0}
          accent={false}
        />
        <Lane
          title="이후 · Promise.all"
          bars={AFTER}
          animateKey={run}
          animated={interactive && run > 0}
          accent
        />
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-gray-200 pt-4 dark:border-gray-800">
        {interactive && (
          <button
            type="button"
            onClick={() => setRun((n) => n + 1)}
            className="ml-auto rounded-md border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            재생
          </button>
        )}
      </div>

      <p className="mt-3 text-xs text-gray-500 dark:text-gray-500">
        개념도입니다. 막대 길이는 실측값이 아닙니다 (정량 측정은 하지 않음).
      </p>
    </div>
  );
}
