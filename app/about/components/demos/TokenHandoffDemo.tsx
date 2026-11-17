"use client";

import { useState } from "react";
import { useInteractiveEnabled } from "../../hooks/useInteractiveEnabled";

const STEPS = [
  "웹의 '내 강의실' 버튼으로 웹앱 이동, 토큰을 쿼리스트링으로 전달",
  "웹앱 스플래시에서 인증",
  "router.replace로 주소에서 토큰 제거",
];

// 단계별 완료 기준 상태 (0~3)
const DONE_AT = [1, 2, 3];
const LAST = 3;

const HISTORY = [
  "브라우저 기록: 웹",
  "브라우저 기록: 웹 → 웹앱 스플래시?token=…",
  "브라우저 기록: 웹 → 웹앱 스플래시?token=…",
  "브라우저 기록: 웹 → 웹앱 홈 (replace라 토큰 주소가 남지 않음)",
];

function AddressBar({ state }: { state: number }) {
  if (state === 0) return <>웹 · 내 강의실 버튼 클릭</>;
  if (state === 3) return <>웹앱 홈</>;
  return (
    <>
      웹앱 스플래시 ·{" "}
      <span className="rounded bg-amber-100 px-1 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
        ?token=••••••••
      </span>
      {state === 2 && " · 인증 확인 중"}
    </>
  );
}

export default function TokenHandoffDemo() {
  const interactive = useInteractiveEnabled();
  const [step, setStep] = useState(0);
  const state = interactive ? step : LAST;

  const btn =
    "rounded-md border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800";

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900/60">
      <div
        aria-live="polite"
        className="break-all rounded-md border border-gray-200 bg-white px-3 py-2 font-mono text-xs text-gray-800 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-200"
      >
        <AddressBar state={state} />
      </div>

      <ol className="mt-3 space-y-1.5">
        {STEPS.map((label, i) => {
          const done = state >= DONE_AT[i];
          return (
            <li
              key={label}
              className={`flex items-start gap-2 text-sm ${
                done
                  ? "text-gray-800 dark:text-gray-200"
                  : "text-gray-400 dark:text-gray-600"
              }`}
            >
              <span
                aria-hidden="true"
                className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border text-[10px] ${
                  done
                    ? "border-amber-500 bg-amber-500 text-white"
                    : "border-gray-300 dark:border-gray-700"
                }`}
              >
                {done ? "✓" : ""}
              </span>
              <span>
                {label}
                <span className="sr-only">{done ? " (완료)" : " (대기)"}</span>
              </span>
            </li>
          );
        })}
      </ol>

      <p className="mt-3 break-words font-mono text-xs text-gray-600 dark:text-gray-400">
        {HISTORY[state]}
      </p>

      {interactive && (
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            className={btn}
            disabled={step >= LAST}
            onClick={() => setStep((s) => Math.min(s + 1, LAST))}
          >
            다음 단계
          </button>
          <button type="button" className={btn} onClick={() => setStep(0)}>
            처음으로
          </button>
        </div>
      )}

      <p className="mt-3 text-xs text-gray-500 dark:text-gray-500">
        개념도입니다. 실제 도메인·토큰 값이 아닙니다.
      </p>
    </div>
  );
}
