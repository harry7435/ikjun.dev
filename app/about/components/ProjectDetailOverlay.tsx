"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FaExternalLinkAlt } from "react-icons/fa";
import { X } from "lucide-react";
import type { Project } from "../data/about-data";
import TrackedExternalLink from "@/app/components/analytics/TrackedExternalLink";

export interface OverlayState {
  /**
   * 열 때마다 증가하는 일련번호. AnimatePresence 자식의 key로 쓴다.
   * key가 없으면 exit 중에 다시 열었을 때 framer가 같은 엘리먼트로 보고
   * initial을 다시 적용하지 않아, 이전 원점·이전 내용이 그대로 남는다.
   */
  id: number;
  project: Project;
  /** 원형 리빌이 시작되는 지점(뷰포트 좌표). 클릭 지점이 들어온다. */
  origin: { x: number; y: number };
}

interface Props {
  state: OverlayState | null;
  onClose: () => void;
}

function htmlList(items: string[]) {
  return items.map((item, i) => (
    <li key={i} className="flex gap-2">
      <span
        className="mt-2 block size-1 flex-none rounded-full bg-amber-500 dark:bg-amber-400"
        aria-hidden
      />
      <span
        dangerouslySetInnerHTML={{ __html: item }}
        className="[&_a]:font-medium [&_a]:text-amber-700 [&_a]:underline [&_a]:decoration-amber-500/60 [&_a]:underline-offset-2 dark:[&_a]:text-amber-300 [&_strong]:font-semibold [&_strong]:text-gray-900 dark:[&_strong]:text-white"
      />
    </li>
  ));
}

export default function ProjectDetailOverlay({ state, onClose }: Props) {
  const project = state?.project ?? null;
  const panelRef = useRef<HTMLDivElement>(null);
  // 포털은 마운트 이후에만 붙인다(SSR에는 document가 없음).
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // ESC 닫기 + 포커스 트랩 + body 스크롤 락
  useEffect(() => {
    if (!project) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab") {
        const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables || focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    // 마운트 후 닫기 버튼에 포커스
    const focusTimer = window.setTimeout(() => {
      panelRef.current
        ?.querySelector<HTMLElement>("[data-autofocus]")
        ?.focus();
    }, 30);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(focusTimer);
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus?.();
    };
  }, [project, onClose]);

  if (!mounted) return null;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const origin = state?.origin ?? { x: 0, y: 0 };

  // 반지름은 원점에서 '네 모서리까지의 최대 거리'다. 화면 대각선 길이로 잡으면
  // 원점이 중앙에서 벗어난 만큼 과대해져서, 화면이 이미 다 덮인 뒤에도
  // 아무 변화 없이 시간만 흐르는 구간이 생긴다.
  const { innerWidth: vw, innerHeight: vh } = window;
  const radius = Math.max(
    Math.hypot(origin.x, origin.y),
    Math.hypot(vw - origin.x, origin.y),
    Math.hypot(origin.x, vh - origin.y),
    Math.hypot(vw - origin.x, vh - origin.y)
  );

  // 전체 화면을 덮는 원이라 확산이 눈에 읽히려면 시간이 필요하다.
  const revealDuration = reduced ? 0.15 : 0.7;
  // 진행이 고르게 퍼지는 커브. 한쪽으로 몰린 커브를 쓰면 확산이 안 읽힌다.
  // [0.7,0,0.2,1]은 초반을 끌다가 끝에서 터지고, [0.22,1,0.36,1]은 9ms 만에
  // 13%까지 튀어서 150ms면 화면이 다 덮인다(둘 다 실측으로 확인).
  const ease = [0.4, 0, 0.2, 1] as const;
  // 닫기는 짧게. mode="wait"라 이 시간만큼 다음 열기가 지연된다.
  const exitDuration = reduced ? 0.12 : 0.25;

  // mode="wait": 이전 오버레이가 완전히 닫힌 뒤에 새 오버레이가 열린다.
  // 동시에 렌더되면 닫히는 배경이 새로 퍼지는 원을 가려 리빌이 안 읽힌다.
  return createPortal(
    <AnimatePresence mode="wait">
      {state && (
        // body에 포털로 붙여 about 레이아웃의 `isolate` stacking context 밖에 둔다.
        // 그래야 z-[60]이 헤더(z-10)보다 실제로 위에 오고, 배경이 헤더를 덮어
        // 모달이 떠 있는 동안 헤더 메뉴 클릭도 막힌다.
        // exit는 값이 안 바뀌는 no-op이다. 자식들의 exit가 끝날 때까지
        // AnimatePresence가 이 서브트리를 언마운트하지 않게 잡아두는 용도.
        <motion.div
          key={state.id}
          className="fixed inset-0 z-[60]"
          initial={false}
          // 닫히는 동안에는 포인터 이벤트를 꺼야 한다. 켜져 있으면 exit 중에
          // 배경이 클릭을 가로채서 다른 프로젝트를 눌러도 열리지 않는다.
          exit={{
            opacity: 1,
            pointerEvents: "none",
            transition: { duration: exitDuration },
          }}
          role="dialog"
          aria-modal="true"
          aria-label={`${state.project.title} 상세`}
        >
          {/* 원형 리빌은 '배경만' 담당한다. 패널을 여기 안에 두면 리빌이 도는
              동안 패널까지 잘려 반쯤 그려진 모달이 보인다.
              clip-path 애니메이션 대신 원형 div를 transform: scale로 키운다.
              다크모드는 페이지 자체가 어두워 /50이면 원 안팎이 거의 구분되지
              않으므로(리빌이 도는 게 안 보임) 불투명도를 따로 올린다. */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute rounded-full bg-gray-950/60 dark:bg-black/80"
              style={{
                left: origin.x - radius,
                top: origin.y - radius,
                width: radius * 2,
                height: radius * 2,
              }}
              initial={reduced ? { opacity: 0, scale: 1 } : { scale: 0 }}
              animate={reduced ? { opacity: 1, scale: 1 } : { scale: 1 }}
              exit={
                reduced
                  ? { opacity: 0, transition: { duration: exitDuration } }
                  : { scale: 0, transition: { duration: exitDuration, ease } }
              }
              transition={{ duration: revealDuration, ease }}
            />
          </div>

          {/* 블러는 반드시 별도 레이어로 둔다. 움직이는 요소에 backdrop-filter를
              같이 얹으면 합성 좌표가 어긋나 원이 엉뚱한 곳에서 퍼진다(실제 크롬에서
              겪은 버그). 이 레이어는 transform도 clip-path도 없이 opacity만 바뀐다. */}
          {!reduced && (
            <motion.div
              className="pointer-events-none absolute inset-0 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: exitDuration * 0.6 } }}
              transition={{ duration: 0.3, delay: revealDuration * 0.75 }}
            />
          )}

          {/* 스크롤 컨테이너 (빈 곳 클릭 시 닫힘) */}
          <div
            className="absolute inset-0 flex items-start justify-center overflow-y-auto overscroll-contain p-4 sm:p-6"
            onClick={onClose}
          >
            <motion.div
              ref={panelRef}
              className="relative my-auto w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-gray-950 sm:p-8"
              // 패널은 화면 중앙에 고정한다. 클릭 지점에서 날아오게 하면
              // 긴 모달일수록 이동 거리가 커져 산만해진다.
              initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{
                opacity: 0,
                scale: reduced ? 1 : 0.98,
                transition: { duration: exitDuration * 0.7 },
              }}
              // 리빌이 화면을 상당 부분 덮은 뒤에 올라와야 '원이 퍼지고 →
              // 모달이 앉는다'로 읽힌다. 동시에 시작하면 원이 가려진다.
              transition={{
                duration: reduced ? 0.15 : 0.32,
                delay: reduced ? 0 : 0.3,
                ease,
              }}
              onClick={(e) => e.stopPropagation()}
            >
            <button
              type="button"
              data-autofocus
              onClick={onClose}
              aria-label="닫기"
              className="absolute right-4 top-4 rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
            >
              <X size={20} />
            </button>

            <p className="font-mono text-xs text-gray-500 dark:text-gray-400">
              {state.project.period}
            </p>
            <h3 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
              {state.project.title}
            </h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {state.project.description}
            </p>

            <div className="mt-6 space-y-5 text-sm leading-6 text-gray-700 dark:text-gray-300">
              <section>
                <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-amber-700 dark:text-amber-300">
                  Why
                </h4>
                <p>{state.project.whyContent}</p>
              </section>
              <section>
                <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-amber-700 dark:text-amber-300">
                  How
                </h4>
                <ul className="space-y-1.5">{htmlList(state.project.howContent)}</ul>
              </section>
              <section>
                <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-amber-700 dark:text-amber-300">
                  Result
                </h4>
                <ul className="space-y-1.5">{htmlList(state.project.resultContent)}</ul>
              </section>
            </div>

            <ul className="mt-6 flex flex-wrap gap-1.5">
              {state.project.techStack.map((tech) => (
                <li
                  key={tech}
                  className="rounded-full bg-amber-100/70 px-2.5 py-0.5 font-mono text-[11px] text-amber-800 dark:bg-amber-900/30 dark:text-amber-200"
                >
                  {tech}
                </li>
              ))}
            </ul>

            {state.project.links[0] && (
              <div className="mt-6 border-t border-gray-200 pt-5 dark:border-gray-800">
                <TrackedExternalLink
                  href={state.project.links[0].href}
                  label={state.project.title}
                  surface="about_project_detail"
                  className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-600 dark:bg-white dark:text-gray-900 dark:hover:bg-amber-400"
                >
                  {state.project.links[0].label} 바로가기
                  <FaExternalLinkAlt className="size-3" />
                </TrackedExternalLink>
              </div>
            )}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
