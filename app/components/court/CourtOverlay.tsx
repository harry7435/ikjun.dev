"use client";

import Link from "next/link";
import type { MutableRefObject, RefObject } from "react";
import { ZONES, type ZoneId } from "./physics";
import type { PopoverState } from "./popover";

const labelOf = (id: ZoneId) => ZONES.find((z) => z.id === id)?.label ?? id;
const hrefOf = (id: ZoneId) => ZONES.find((z) => z.id === id)?.href ?? "/";

interface CourtOverlayProps {
  zoneRefs: MutableRefObject<Record<ZoneId, HTMLAnchorElement | null>>;
  speedRef: RefObject<HTMLDivElement | null>;
  onLinkHover: (hovering: boolean) => void;
  popover: PopoverState | null;
  onDismiss: () => void;
  popoverRef: RefObject<HTMLDivElement | null>;
}

/**
 * 3D 장면 위 HTML 오버레이. 위치는 CourtHero가 매 프레임 style.transform으로 갱신한다
 * (React 리렌더 없음). 영역 링크는 클릭 즉시 이동, Tab 포커스 가능.
 */
export default function CourtOverlay({
  zoneRefs,
  speedRef,
  onLinkHover,
  popover,
  onDismiss,
  popoverRef,
}: CourtOverlayProps) {
  return (
    <div className="pointer-events-none absolute inset-0">
      {ZONES.map((z) => (
        <Link
          key={z.id}
          href={z.href}
          ref={(el) => {
            zoneRefs.current[z.id] = el;
          }}
          aria-label={`${z.label} 페이지로 이동`}
          onPointerEnter={() => onLinkHover(true)}
          onPointerLeave={() => onLinkHover(false)}
          className="pointer-events-auto absolute left-0 top-0 flex cursor-pointer items-center justify-center rounded-full text-lg font-extrabold text-amber-700 will-change-transform focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-500 dark:text-amber-400"
        >
          {z.label}
        </Link>
      ))}
      <div
        ref={speedRef}
        aria-hidden
        className="absolute left-0 top-0 font-mono text-2xl font-black text-amber-600 opacity-0 will-change-transform"
      />
      <div aria-live="polite" className="sr-only">
        {popover ? `${labelOf(popover.zone)} 페이지로 이동할까요?` : ""}
      </div>
      {popover && (
        <div
          ref={popoverRef}
          role="group"
          aria-label={`${labelOf(popover.zone)} 페이지 이동 확인`}
          onPointerEnter={() => onLinkHover(true)}
          onPointerLeave={() => onLinkHover(false)}
          onPointerDown={(e) => e.stopPropagation()}
          className="pointer-events-auto absolute left-0 top-0 w-max cursor-default rounded-xl border border-stone-300 bg-white/95 p-4 text-stone-700 shadow-lg will-change-transform dark:border-gray-700 dark:bg-gray-800/95 dark:text-white"
        >
          <p className="mb-3 font-semibold">
            {labelOf(popover.zone)} 페이지로 이동할까요?
          </p>
          <div className="flex gap-2">
            <Link
              href={hrefOf(popover.zone)}
              className="rounded-md bg-amber-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-amber-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            >
              이동하기
            </Link>
            <button
              type="button"
              onClick={onDismiss}
              className="rounded-md border border-stone-300 px-3 py-1.5 text-sm font-semibold hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              계속 치기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
