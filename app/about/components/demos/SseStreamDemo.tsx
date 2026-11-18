"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useInteractiveEnabled } from "../../hooks/useInteractiveEnabled";

const SENTENCE =
  "라이브러리 없이 fetch와 ReadableStream reader로 SSE 응답을 읽어, 생성되는 대로 화면에 출력. 출력 중지 시 AbortController로 연결을 끊고, 새 요청을 시작하면 이전 요청을 먼저 중단.";

// 2~5글자 청크로 결정적으로 분할 (렌더마다 같은 결과)
const CHUNKS: string[] = (() => {
  const chars = Array.from(SENTENCE);
  const sizes = [3, 2, 4, 5, 2, 3];
  const out: string[] = [];
  let i = 0;
  let k = 0;
  while (i < chars.length) {
    const size = sizes[k % sizes.length];
    out.push(chars.slice(i, i + size).join(""));
    i += size;
    k += 1;
  }
  return out;
})();

const INTERVAL_MS = 90;

type Status = "idle" | "streaming" | "ended" | "stopped";

export default function SseStreamDemo() {
  const interactive = useInteractiveEnabled();
  const [status, setStatus] = useState<Status>("idle");
  const [count, setCount] = useState(0);
  const [aborted, setAborted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countRef = useRef(0);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => clearTimer, [clearTimer]);

  const start = () => {
    const wasStreaming = timerRef.current !== null;
    clearTimer();
    countRef.current = 0;
    setCount(0);
    setAborted(wasStreaming);
    setStatus("streaming");
    timerRef.current = setInterval(() => {
      countRef.current += 1;
      setCount(countRef.current);
      if (countRef.current >= CHUNKS.length) {
        clearTimer();
        setStatus("ended");
      }
    }, INTERVAL_MS);
  };

  const stop = () => {
    clearTimer();
    setStatus("stopped");
  };

  const showFinal = !interactive;
  const shownCount = showFinal ? CHUNKS.length : count;
  const text = CHUNKS.slice(0, shownCount).join("");
  const effStatus: Status = showFinal ? "ended" : status;
  const streaming = effStatus === "streaming";

  const logLine = "block";
  const mono = "font-mono text-xs text-gray-600 dark:text-gray-400";

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900/60">
      <div className="grid gap-3 sm:grid-cols-[3fr_2fr]">
        <div
          aria-live="polite"
          className="min-h-[7.5rem] rounded-md border border-gray-200 bg-white p-3 text-sm leading-relaxed text-gray-800 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-200"
        >
          {text}
          {streaming && (
            <span
              aria-hidden="true"
              className="ml-0.5 inline-block h-4 w-1.5 translate-y-0.5 bg-amber-500"
            />
          )}
        </div>
        <div className="min-h-[7.5rem] rounded-md border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-950">
          <p className="mb-1 font-mono text-[11px] uppercase tracking-wide text-gray-400 dark:text-gray-500">
            이벤트 로그
          </p>
          {aborted && (
            <span
              className={`${logLine} ${mono} text-amber-600 dark:text-amber-400`}
            >
              abort() · 이전 요청 먼저 중단
            </span>
          )}
          {effStatus !== "idle" && (
            <>
              <span className={`${logLine} ${mono}`}>start</span>
              {shownCount > 0 && (
                <span className={`${logLine} ${mono}`}>
                  chunk × {showFinal ? "n" : shownCount}
                </span>
              )}
            </>
          )}
          {effStatus === "ended" && (
            <span className={`${logLine} ${mono}`}>end</span>
          )}
          {effStatus === "stopped" && (
            <span
              className={`${logLine} ${mono} text-amber-600 dark:text-amber-400`}
            >
              출력 중지 → abort() · 연결 종료
            </span>
          )}
        </div>
      </div>

      {interactive && (
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={start}
            className="rounded-md border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            요청 보내기
          </button>
          <button
            type="button"
            onClick={stop}
            disabled={!streaming}
            className="rounded-md border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            출력 중지
          </button>
        </div>
      )}

      <p className="mt-3 text-xs text-gray-500 dark:text-gray-500">
        시연용으로 경력기술서 문장을 조각내 흘려보냅니다. 실제 LLM 호출이
        아닙니다.
      </p>
    </div>
  );
}
