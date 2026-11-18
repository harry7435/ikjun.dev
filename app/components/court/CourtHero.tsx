"use client";

import { useTheme } from "next-themes";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { useInteractiveEnabled } from "@/app/hooks/useInteractiveEnabled";
import CourtOverlay from "./CourtOverlay";
import { popoverReducer } from "./popover";
import StaticCourt from "./StaticCourt";
import {
  DT,
  RACKET_MAX_X,
  ZONES,
  createGame,
  shouldShowSpeed,
  tickGame,
  toKmh,
  type Racket,
  type ZoneId,
} from "./physics";
import type { SceneHandle, Theme } from "./scene";

type Phase = "static" | "loading" | "ready";

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
 * 홈 배드민턴 히어로. 게이트(useInteractiveEnabled) 통과 시에만 idle 시점에 three 장면을 동적 import.
 * 그 전/실패/게이트 false에는 StaticCourt. 루프는 탭 숨김·뷰포트 밖에서 정지한다.
 */
export default function CourtHero() {
  const enabled = useInteractiveEnabled();
  const { resolvedTheme } = useTheme();
  const theme: Theme = resolvedTheme === "dark" ? "dark" : "light";
  const themeRef = useRef(theme);
  themeRef.current = theme;

  const [phase, setPhase] = useState<Phase>("static");
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<SceneHandle | null>(null);
  const zoneRefs = useRef<Record<ZoneId, HTMLAnchorElement | null>>({
    about: null,
    blog: null,
  });
  const speedRef = useRef<HTMLDivElement>(null);
  const hoveringLinkRef = useRef(false);
  const onLinkHover = useCallback((h: boolean) => {
    hoveringLinkRef.current = h;
  }, []);
  const [popover, dispatch] = useReducer(popoverReducer, null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const popoverZoneRef = useRef<ZoneId | null>(null);
  popoverZoneRef.current = popover?.zone ?? null;
  // dispatch는 안정 참조라 ref 갱신 불필요
  const onZoneHitRef = useRef<(id: ZoneId) => void>((id) =>
    dispatch({ type: "hit", zone: id, now: performance.now() })
  );

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
        const { createScene } = await import("./scene");
        // 로딩 중 언마운트/게이트 false 전환 — 아무것도 만들지 않는다(Review Focus 1)
        if (cancelled || !canvasRef.current || !stageRef.current) return;
        cleanup = start(createScene);
      } catch (err) {
        console.warn("[CourtHero] 3D 로드 실패, 정적 코트 유지", err);
        if (!cancelled) setPhase("static");
      }
    });

    function start(createScene: typeof import("./scene").createScene) {
      const canvas = canvasRef.current as HTMLCanvasElement;
      const stage = stageRef.current as HTMLDivElement;
      const scene = createScene(canvas, themeRef.current);
      sceneRef.current = scene;
      const game = createGame();
      const racket: Racket = { x: -3, y: 1.2, px: -3, py: 1.2, vx: 0, vy: 0 };
      let pointer: { x: number; y: number } | null = null;
      let acc = 0;
      let last = performance.now();
      let raf = 0;
      let running = false;
      let first = true;
      let inView = true;
      let lost = false;
      let hadPointer = false;
      let speedT = 0;
      let speedPos = { x: 0, y: 0 };

      const rect = () => stage.getBoundingClientRect();
      const resize = () => {
        const r = rect();
        scene.resize(r.width, r.height);
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(stage);

      const onMove = (e: PointerEvent) => {
        const r = rect();
        pointer = { x: e.clientX - r.left, y: e.clientY - r.top };
      };
      const onLeave = () => {
        pointer = null;
      };
      stage.addEventListener("pointermove", onMove, { passive: true });
      stage.addEventListener("pointerleave", onLeave);

      const placeOverlays = () => {
        for (const z of ZONES) {
          const el = zoneRefs.current[z.id];
          if (!el) continue;
          const tl = scene.worldToScreen(z.cx - z.w / 2, z.cy + z.h / 2);
          const br = scene.worldToScreen(z.cx + z.w / 2, z.cy - z.h / 2);
          el.style.width = `${br.x - tl.x}px`;
          el.style.height = `${br.y - tl.y}px`;
          el.style.transform = `translate(${tl.x}px, ${tl.y}px)`;
        }
      };

      const frame = (now: number) => {
        raf = requestAnimationFrame(frame);
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        acc += dt;

        // 라켓: 포인터를 z=0 평면으로 투영, ~50ms 평활 속도
        racket.px = racket.x;
        racket.py = racket.y;
        if (pointer) {
          const w = scene.screenToWorld(pointer.x, pointer.y);
          if (w) {
            racket.x = Math.min(RACKET_MAX_X, w.x);
            racket.y = Math.max(0.12, w.y);
          }
        }
        if (pointer && !hadPointer) {
          // 포인터 첫 샘플(초기/재진입): 긴 스윕·큰 속도 방지
          racket.px = racket.x;
          racket.py = racket.y;
          racket.vx = 0;
          racket.vy = 0;
        } else {
          const k = 1 - Math.exp(-Math.max(dt, 1e-3) / 0.05);
          racket.vx +=
            ((racket.x - racket.px) / Math.max(dt, 1e-3) - racket.vx) * k;
          racket.vy +=
            ((racket.y - racket.py) / Math.max(dt, 1e-3) - racket.vy) * k;
        }
        hadPointer = pointer !== null;
        const swingActive = pointer !== null && !hoveringLinkRef.current;

        while (acc >= DT) {
          acc -= DT;
          for (const ev of tickGame(game, swingActive ? racket : null, {
            holdServe: popoverZoneRef.current !== null,
          })) {
            const s = game.shuttle;
            if (ev.type === "hit") {
              scene.burst(s.x, s.y, s.vx, s.vy, ev.speed);
              scene.shake(ev.speed * 0.0036);
              scene.popRacket();
              if (shouldShowSpeed(ev.speed) && speedRef.current) {
                speedRef.current.textContent = `${toKmh(ev.speed)} km/h`;
                speedPos = scene.worldToScreen(s.x, s.y + 0.3);
                speedT = 0.9;
              }
            } else if (ev.type === "zone") {
              if (popoverZoneRef.current === null) {
                scene.pulseZone(ev.zone.id);
                scene.burst(ev.zone.cx, ev.zone.cy, 0, 1, 14);
              }
              onZoneHitRef.current(ev.zone.id);
            }
          }
        }

        const s = game.shuttle;
        const a = acc / DT;
        scene.render({
          shuttle: {
            x: s.px + (s.x - s.px) * a,
            y: s.py + (s.y - s.py) * a,
            ang: s.pang + (s.ang - s.pang) * a,
            spin: s.pspin + (s.spin - s.pspin) * a,
            speed: Math.hypot(s.vx, s.vy),
          },
          racket: {
            x: racket.x,
            y: racket.y,
            vx: racket.vx,
            visible: swingActive,
          },
          dt,
          time: now / 1000,
        });
        placeOverlays();

        const pz = popoverZoneRef.current;
        const pel = popoverRef.current;
        if (pz && pel) {
          const z = ZONES.find((q) => q.id === pz);
          if (z) {
            const p = scene.worldToScreen(z.cx, z.cy + z.h / 2);
            pel.style.transform = `translate(${p.x}px, ${p.y - 12}px) translate(-50%, -100%)`;
          }
        }

        const sp = speedRef.current;
        if (sp) {
          if (speedT > 0) {
            speedT -= dt;
            const t = Math.max(0, speedT / 0.9);
            sp.style.opacity = String(Math.min(1, t * 2.5));
            sp.style.transform = `translate(${speedPos.x}px, ${speedPos.y - (1 - t) * 36}px) translate(-50%, -100%)`;
          } else sp.style.opacity = "0";
        }

        if (first) {
          first = false;
          setPhase("ready");
        }
      };

      const startLoop = () => {
        if (lost || running || document.hidden || !inView) return;
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(frame);
      };
      const stopLoop = () => {
        running = false;
        cancelAnimationFrame(raf);
      };
      const onVis = () => (document.hidden ? stopLoop() : startLoop());
      document.addEventListener("visibilitychange", onVis);
      const io = new IntersectionObserver(([e]) => {
        inView = e.isIntersecting;
        if (inView) startLoop();
        else stopLoop();
      });
      io.observe(stage);

      const onLost = (e: Event) => {
        e.preventDefault();
        lost = true;
        console.warn("[CourtHero] WebGL context lost, 정적 코트로 복귀");
        stopLoop();
        setPhase("static");
      };
      canvas.addEventListener("webglcontextlost", onLost);

      startLoop();
      return () => {
        stopLoop();
        ro.disconnect();
        io.disconnect();
        document.removeEventListener("visibilitychange", onVis);
        stage.removeEventListener("pointermove", onMove);
        stage.removeEventListener("pointerleave", onLeave);
        canvas.removeEventListener("webglcontextlost", onLost);
        scene.dispose();
        sceneRef.current = null;
      };
    }

    return () => {
      cancelled = true;
      cancelIdle();
      cleanup?.();
    };
  }, [enabled]);

  // 팝오버 자동 닫힘(6초)·Esc(열려 있을 때만)·바깥 클릭
  useEffect(() => {
    if (!popover) return;
    const id = window.setInterval(
      () => dispatch({ type: "tick", now: performance.now() }),
      250
    );
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dispatch({ type: "dismiss" });
    };
    const onDown = (e: PointerEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node))
        dispatch({ type: "dismiss" });
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.clearInterval(id);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [popover]);

  // 팝오버가 닫히면 호버 플래그 리셋
  useEffect(() => {
    if (!popover)
      hoveringLinkRef.current = ZONES.some((z) =>
        zoneRefs.current[z.id]?.matches(":hover")
      );
  }, [popover]);

  // 테마 변경: 장면 재생성 없이 조명·색만
  useEffect(() => {
    sceneRef.current?.setTheme(theme);
  }, [theme]);

  const show3D = phase === "ready";
  return (
    <div
      ref={stageRef}
      className={`absolute inset-0 ${show3D ? "cursor-none" : ""}`}
    >
      <div
        inert={show3D}
        className={`absolute inset-0 transition-opacity duration-300 ${show3D ? "pointer-events-none opacity-0" : "opacity-100"}`}
      >
        <StaticCourt />
      </div>
      {enabled && (
        <canvas
          ref={canvasRef}
          aria-hidden
          className={`absolute inset-0 size-full transition-opacity duration-300 ${show3D ? "opacity-100" : "opacity-0"}`}
        />
      )}
      {show3D && (
        <CourtOverlay
          zoneRefs={zoneRefs}
          speedRef={speedRef}
          onLinkHover={onLinkHover}
          popover={popover}
          onDismiss={() => dispatch({ type: "dismiss" })}
          popoverRef={popoverRef}
        />
      )}
    </div>
  );
}
