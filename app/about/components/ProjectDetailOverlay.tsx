"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaExternalLinkAlt } from "react-icons/fa";
import { X } from "lucide-react";
import type { Project } from "../data/about-data";
import TrackedExternalLink from "@/app/components/analytics/TrackedExternalLink";

export interface OverlayState {
  project: Project;
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
  const panelRef = useRef<HTMLDivElement>(null);

  // ESC 닫기 + 포커스 트랩 + body 스크롤 락
  useEffect(() => {
    if (!state) return;

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
  }, [state, onClose]);

  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const origin = state?.origin ?? { x: 0, y: 0 };
  const radius =
    typeof window !== "undefined"
      ? Math.hypot(window.innerWidth, window.innerHeight)
      : 1200;
  const clipClosed = `circle(0px at ${origin.x}px ${origin.y}px)`;
  const clipOpen = `circle(${radius}px at ${origin.x}px ${origin.y}px)`;

  return (
    <AnimatePresence>
      {state && (
        // 뷰포트 전체를 덮는 리빌 레이어: clip-path 좌표가 뷰포트 좌표와 일치한다.
        <motion.div
          className="fixed inset-0 z-[60]"
          style={{ clipPath: reduced ? undefined : clipClosed }}
          initial={reduced ? { opacity: 0 } : { clipPath: clipClosed }}
          animate={reduced ? { opacity: 1 } : { clipPath: clipOpen }}
          exit={reduced ? { opacity: 0 } : { clipPath: clipClosed }}
          transition={{ duration: reduced ? 0.15 : 0.6, ease: [0.7, 0, 0.2, 1] }}
          role="dialog"
          aria-modal="true"
          aria-label={`${state.project.title} 상세`}
        >
          {/* 배경 + 스크롤 컨테이너 (클릭 시 닫힘) */}
          <div
            className="absolute inset-0 flex items-start justify-center overflow-y-auto overscroll-contain bg-gray-950/50 p-4 backdrop-blur-sm sm:p-6"
            onClick={onClose}
          >
            <motion.div
              ref={panelRef}
              className="relative my-auto w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-gray-950 sm:p-8"
              initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
              transition={{ duration: reduced ? 0.15 : 0.35, delay: reduced ? 0 : 0.12 }}
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
    </AnimatePresence>
  );
}
