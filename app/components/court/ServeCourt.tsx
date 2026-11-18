"use client";

import { useTheme } from "next-themes";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { prefersReducedMotion } from "@/app/hooks/prefersReducedMotion";
import { useServeCourtEnabled } from "@/app/hooks/useServeCourtEnabled";
import CourtOverlay from "./CourtOverlay";
import { SERVE_ZONES as ZONES, type ZoneId } from "./physics";
import { popoverReducer } from "./popover";
import { usePopoverDismiss } from "./usePopoverDismiss";
import {
  FLOOR_MARGIN,
  VIEW_H,
  VIEW_W,
  VIEW_X0,
  serveLayout,
} from "./serveLayout";
import type { ServeSceneHandle, Theme } from "./serveScene";

type Phase = "static" | "loading" | "ready";

const MIN_LINK_PX = 56;

/** idle 시점 실행 예약. 취소 함수를 반환한다(requestIdleCallback 미지원 시 setTimeout). */
const idle = (cb: () => void): (() => void) => {
  if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(cb, { timeout: 1500 });
    return () => window.cancelIdleCallback(id);
  }
  const id = window.setTimeout(cb, 200);
  return () => window.clearTimeout(id);
};

/**
 * 모바일·태블릿 서브 코트. 박스 크기는 CSS(aspect-ratio)로 예약해 CLS 0이고, 부모가 `hidden serve:block`로 감싼다.
 * 게이트(useServeCourtEnabled) 통과 후 idle에 2D 장면(serveScene)을 동적 import. 그 전/실패 시 정적 SVG.
 * 라켓을 당겼다 놓으면 서브, 탭하면 자동 서브. 이동은 링 <Link>·하단 카드로 항상 가능.
 */
export default function ServeCourt() {
  const enabled = useServeCourtEnabled();
  const { resolvedTheme } = useTheme();
  const theme: Theme = resolvedTheme === "dark" ? "dark" : "light";
  const themeRef = useRef(theme);
  themeRef.current = theme;

  const [phase, setPhase] = useState<Phase>("static");
  const [ready, setReady] = useState(true);
  const boxRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<ServeSceneHandle | null>(null);
  const zoneRefs = useRef<Record<ZoneId, HTMLAnchorElement | null>>({
    about: null,
    blog: null,
  });
  const speedRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const noop = useCallback(() => {}, []);
  const [popover, dispatch] = useReducer(popoverReducer, null);
  const popoverZoneRef = useRef<ZoneId | null>(null);
  popoverZoneRef.current = popover?.zone ?? null;

  useEffect(() => {
    if (!enabled) {
      setPhase("static");
      dispatch({ type: "dismiss" });
      return;
    }
    let cancelled = false;
    let cleanup: (() => void) | null = null;
    setPhase("loading");

    const cancelIdle = idle(async () => {
      try {
        const { createServeScene } = await import("./serveScene");
        // 로딩 중 언마운트/게이트 false 전환 — 아무것도 만들지 않는다
        if (cancelled || !canvasRef.current) return;
        const scene = createServeScene({
          canvas: canvasRef.current,
          theme: themeRef.current,
          reducedMotion: prefersReducedMotion(),
          isHeld: () => popoverZoneRef.current !== null,
          onZone: (id) => dispatch({ type: "hit", zone: id, now: performance.now() }),
          onReady: setReady,
          onPulling: (pulling) => {
            for (const z of ZONES) {
              const el = zoneRefs.current[z.id];
              if (el) el.style.pointerEvents = pulling ? "none" : "";
            }
          },
          onFirstFrame: () => setPhase("ready"),
        });
        sceneRef.current = scene;
        cleanup = () => {
          scene.dispose();
          sceneRef.current = null;
        };
      } catch (err) {
        console.warn("[ServeCourt] 2D 로드 실패, 정적 코트 유지", err);
        if (!cancelled) setPhase("static");
      }
    });

    return () => {
      cancelled = true;
      cancelIdle();
      cleanup?.();
    };
  }, [enabled]);

  // 링 링크·팝오버 위치(박스 크기가 바뀔 때마다)
  const place = useCallback(() => {
    const box = boxRef.current;
    if (!box) return;
    const { clientWidth: w, clientHeight: h } = box;
    const lay = serveLayout(w, h);
    for (const z of ZONES) {
      const el = zoneRefs.current[z.id];
      if (!el) continue;
      const cx = lay.ox + z.cx * lay.s;
      const cy = lay.oy - z.cy * lay.s;
      const d = Math.max(MIN_LINK_PX, z.r * lay.s * 2);
      el.style.width = `${d}px`;
      el.style.height = `${d}px`;
      el.style.transform = `translate(${cx - d / 2}px, ${cy - d / 2}px)`;
    }
    const pz = popoverZoneRef.current;
    const pel = popoverRef.current;
    const z = pz && ZONES.find((q) => q.id === pz);
    if (pel && z) {
      // 링이 세로로 쌓여 있으므로 팝오버는 링 왼쪽(다른 링을 가리지 않는 쪽)에 두고, 세로는 링 중심에 맞춰 박스 안으로 clamp.
      // 왼쪽에 폭이 안 나오면 링 위/아래로 폴백.
      const cx = lay.ox + z.cx * lay.s;
      const cy = lay.oy - z.cy * lay.s;
      const pw = pel.offsetWidth;
      const ph = pel.offsetHeight;
      const leftSide = cx - z.r * lay.s - 12 - pw;
      let left: number;
      let top: number;
      if (leftSide >= 2) {
        left = leftSide;
        top = Math.min(Math.max(4, cy - ph / 2), Math.max(4, h - ph - 4));
      } else {
        left = Math.min(Math.max(4, cx - pw / 2), Math.max(4, w - pw - 4));
        const above = lay.oy - (z.cy + z.r) * lay.s - 12 - ph;
        top = above >= 4 ? above : lay.oy - (z.cy - z.r) * lay.s + 12;
      }
      pel.style.transform = `translate(${left}px, ${top}px)`;
    }
  }, []);

  useLayoutEffect(() => {
    place();
  }, [phase, popover, place]);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const ro = new ResizeObserver(place);
    ro.observe(box);
    return () => ro.disconnect();
  }, [place]);

  usePopoverDismiss(popover, dispatch, popoverRef);

  // 팝오버가 닫히면 멈춰 있던 루프를 깨워 재장전
  useEffect(() => {
    if (!popover) sceneRef.current?.wake();
  }, [popover]);

  // 테마 변경: 장면 재생성 없이 색만
  useEffect(() => {
    sceneRef.current?.setTheme(theme);
  }, [theme]);

  const live = phase === "ready";
  return (
    // z-[2]: 팝오버가 박스 밖으로 넘쳐도 아래 카드보다 위(헤더 z-10보다는 아래)에 그려지게 한다
    <div className="relative z-[2]">
      <p
        aria-hidden
        className={`mb-1 h-4 text-center text-xs font-medium leading-4 text-stone-600 transition-opacity motion-reduce:transition-none dark:text-gray-300 ${live && ready ? "opacity-100" : "opacity-0"}`}
      >
        라켓을 당겼다 놓아 링을 맞혀 보세요
      </p>
      <div
        ref={boxRef}
        className="relative aspect-[11/5.2] max-h-[360px] w-full select-none text-stone-700 dark:text-gray-300"
      >
        <div
          inert={live}
          aria-hidden
          className={`absolute inset-0 transition-opacity duration-300 motion-reduce:transition-none ${live ? "opacity-0" : "opacity-100"}`}
        >
          <StaticPlaceholder />
        </div>
        {enabled && (
          <canvas
            ref={canvasRef}
            aria-hidden
            className={`absolute inset-0 size-full transition-opacity duration-300 motion-reduce:transition-none ${live ? "opacity-100" : "opacity-0"}`}
            style={{ touchAction: "pan-y pinch-zoom" }}
          />
        )}
        {live && (
          <CourtOverlay
            zoneRefs={zoneRefs}
            speedRef={speedRef}
            onLinkHover={noop}
            popover={popover}
            onDismiss={() => dispatch({ type: "dismiss" })}
            popoverRef={popoverRef}
            opaquePopover
          />
        )}
      </div>
    </div>
  );
}

/** 2D 모듈 로딩 전·실패 시 정적 SVG. serveLayout과 같은 월드 뷰(월드 y를 위로 뒤집음). */
function StaticPlaceholder() {
  return (
    <svg
      viewBox={`${VIEW_X0} ${-(VIEW_H - FLOOR_MARGIN)} ${VIEW_W} ${VIEW_H}`}
      preserveAspectRatio="xMidYMax meet"
      className="absolute inset-0 size-full"
    >
      <line
        x1={VIEW_X0}
        x2={VIEW_X0 + VIEW_W}
        y1={0}
        y2={0}
        stroke="currentColor"
        strokeOpacity={0.35}
        strokeWidth={0.04}
      />
      <line x1={0} x2={0} y1={0} y2={-1.55} stroke="currentColor" strokeOpacity={0.5} strokeWidth={0.05} />
      {ZONES.map((z) => (
        <circle
          key={z.id}
          cx={z.cx}
          cy={-z.cy}
          r={z.r}
          className="fill-amber-700/15 stroke-amber-700 dark:fill-amber-500/15 dark:stroke-amber-500"
          strokeWidth={0.05}
        />
      ))}
    </svg>
  );
}
