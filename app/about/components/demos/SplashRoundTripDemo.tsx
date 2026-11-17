"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useInteractiveEnabled } from "../../hooks/useInteractiveEnabled";

const CHANGES = [
  "로그인 확인과 토큰 발급을 요청 하나로 합침",
  "토큰 검증 2회 → 1회",
  "이전 개발자가 남겨둔 임시 2초 대기 코드 제거",
  "인증 실패 시 안내 메시지 추가",
];

// 재생 순서: 이전 행 1,2 -> 대기 블록 -> 이전 행 3,4,5 -> 이후 행 1,2,3
const TOTAL = 9;
const WAIT_EVENT = 3; // 대기 블록이 나타나는 단계(1-based)

function beforeRows(p: number) {
  if (p <= 2) return p;
  return Math.min(p - 1, 5);
}
function afterRows(p: number) {
  return Math.max(0, p - 6);
}

function Row({ index, visible }: { index: number; visible: boolean }) {
  return (
    <motion.div
      initial={false}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.25 }}
      className="flex items-stretch gap-2"
    >
      <span className="w-3 shrink-0 pt-0.5 text-right font-mono text-[10px] text-gray-500 dark:text-gray-500">
        {index}
      </span>
      <div className="flex-1 space-y-1 border-x border-gray-400 px-1 dark:border-gray-600">
        <div aria-hidden="true" className="flex items-center text-amber-500">
          <span className="h-px flex-1 bg-amber-500" />
          <span className="-ml-0.5 text-[10px] leading-none">▶</span>
        </div>
        <div
          aria-hidden="true"
          className="flex items-center text-gray-400 dark:text-gray-500"
        >
          <span className="-mr-0.5 text-[10px] leading-none">◀</span>
          <span className="h-px flex-1 bg-gray-400 dark:bg-gray-500" />
        </div>
      </div>
    </motion.div>
  );
}

function Panel({
  title,
  rows,
  shown,
  wait,
  waitVisible,
  badge,
  accent,
}: {
  title: string;
  rows: number;
  shown: number;
  wait: boolean;
  waitVisible: boolean;
  badge: string;
  accent: boolean;
}) {
  const items: React.ReactNode[] = [];
  for (let i = 1; i <= rows; i++) {
    items.push(<Row key={i} index={i} visible={i <= shown} />);
    if (wait && i === 2) {
      items.push(
        <motion.div
          key="wait"
          initial={false}
          animate={{ opacity: waitVisible ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex gap-2"
        >
          <span className="w-3 shrink-0" />
          <div className="flex-1 border-x border-gray-400 px-1 py-0.5 dark:border-gray-600">
            <div className="w-3/5 rounded border border-dashed border-gray-400 px-1.5 py-1 text-center text-[11px] text-gray-600 dark:border-gray-500 dark:text-gray-400">
              임시 2초 대기
            </div>
          </div>
        </motion.div>
      );
    }
  }

  return (
    <div className="rounded-md border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-950">
      <div className="mb-3 flex items-baseline justify-between gap-2">
        <p className="font-mono text-xs font-semibold text-gray-700 dark:text-gray-300">
          {title}
        </p>
        <p
          aria-live="off"
          className={`font-mono text-xs font-semibold ${
            accent
              ? "text-amber-600 dark:text-amber-400"
              : "text-gray-600 dark:text-gray-400"
          }`}
        >
          서버 요청 {shown}회
        </p>
      </div>
      <div className="mb-1 flex justify-between pl-5 text-[11px] font-medium text-gray-600 dark:text-gray-400">
        <span>브라우저</span>
        <span>서버</span>
      </div>
      <div className="space-y-1.5">{items}</div>
      <div className="mt-2 flex justify-end">
        <span className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-[10px] text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
          {badge}
        </span>
      </div>
    </div>
  );
}

export default function SplashRoundTripDemo() {
  const interactive = useInteractiveEnabled();
  const [step, setStep] = useState(TOTAL);
  const [playing, setPlaying] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );

  const play = () => {
    if (timer.current) clearTimeout(timer.current);
    setPlaying(true);
    setStep(0);
    const next = (n: number) => {
      const delay = n === WAIT_EVENT ? 700 : 350;
      timer.current = setTimeout(() => {
        setStep(n);
        if (n < TOTAL) next(n + 1);
        else setPlaying(false);
      }, delay);
    };
    next(1);
  };

  const p = interactive ? step : TOTAL;

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900/60">
      <div className="grid gap-3 sm:grid-cols-2">
        <Panel
          title="이전"
          rows={5}
          shown={beforeRows(p)}
          wait
          waitVisible={p >= WAIT_EVENT}
          badge="토큰 검증 ×2"
          accent={false}
        />
        <Panel
          title="이후"
          rows={3}
          shown={afterRows(p)}
          wait={false}
          waitVisible
          badge="토큰 검증 ×1"
          accent
        />
      </div>

      <div className="mt-4 border-t border-gray-200 pt-3 dark:border-gray-800">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
            바뀐 점
          </p>
          {interactive && (
            <button
              type="button"
              onClick={play}
              disabled={playing}
              className="rounded-md border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              재생
            </button>
          )}
        </div>
        <ul className="mt-2 space-y-1">
          {CHANGES.map((c) => (
            <li
              key={c}
              className="flex gap-2 text-sm text-gray-700 dark:text-gray-300"
            >
              <span aria-hidden="true" className="text-amber-500">
                •
              </span>
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-3 text-xs text-gray-500 dark:text-gray-500">
        개념도입니다. 각 요청의 내용과 간격은 표시하지 않았습니다.
      </p>
    </div>
  );
}
