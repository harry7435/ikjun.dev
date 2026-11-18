/**
 * 모바일·태블릿 서브 코트의 2D 캔버스 렌더 + 터치 입력. three 미사용.
 * ServeCourt가 게이트 통과 후 idle에 import()로만 불러온다(정적 import 금지 — 모바일 First Load JS).
 * 입력: 라켓 히트 영역에서 시작한 제스처만 처리(스크롤 차단은 그 touchmove만). 발사는 손을 뗄 때.
 */
import {
  DT,
  HAND_X,
  HAND_Y,
  SERVE_ZONES,
  autoServeLaunch,
  createServeGame,
  launchFromHand,
  predictPath,
  serveLaunch,
  tickServeGame,
  type ZoneId,
} from "./physics";
import {
  FACE_HALF,
  FACE_THICK,
  PREVIEW_SECONDS,
  SHAFT_LEN,
  idlePose,
  pullPose,
  racketGeom,
  racketHitArea,
  serveLayout,
  type RacketPose,
} from "./serveLayout";

export type Theme = "light" | "dark";

export interface ServeSceneOptions {
  canvas: HTMLCanvasElement;
  theme: Theme;
  /** 팝오버가 열려 있으면 true → 재장전 보류 */
  isHeld: () => boolean;
  onZone: (id: ZoneId) => void;
  /** 대기(셔틀이 손에 있음) 여부가 바뀔 때 */
  onReady: (ready: boolean) => void;
  /** 당김 시작/종료 — 링 링크가 제스처를 가로채지 않게 */
  onPulling: (pulling: boolean) => void;
  /** 렌더 시작 후 첫 프레임을 그렸을 때 */
  onFirstFrame: () => void;
}

export interface ServeSceneHandle {
  setTheme: (t: Theme) => void;
  /** 렌더 루프 재개(팝오버가 닫혀 재장전이 필요할 때 등) */
  wake: () => void;
  dispose: () => void;
}

const PALETTE = {
  light: {
    line: "rgba(87,83,78,0.45)",
    net: "#57534e",
    accent: "#b45309",
    ringFill: "rgba(180,83,9,0.15)",
    racket: "#57534e",
    racketFill: "rgba(87,83,78,0.12)",
    skirt: "#ffffff",
    skirtStroke: "rgba(87,83,78,0.7)",
    cork: "#e9d6a8",
  },
  dark: {
    line: "rgba(156,163,175,0.5)",
    net: "#d6d3d1",
    accent: "#f59e0b",
    ringFill: "rgba(245,158,11,0.15)",
    racket: "#e5e7eb",
    racketFill: "rgba(229,231,235,0.1)",
    skirt: "#f3f4f6",
    skirtStroke: "rgba(229,231,235,0.8)",
    cork: "#e9d6a8",
  },
} as const;

const NET_TOP = 1.55;
const SWING_MS = 120;
const TAP_SLOP_PX = 10;
const TRAIL_MAX = 16;
const FOLLOW_MS = 100; // 접촉 뒤 follow-through
const RETURN_MS = 200; // 대기 포즈로 복귀
const FOLLOW_D = -0.4; // 접촉점을 지나 나아가는 거리(m)
const TAP_BACKSWING_D = 0.6; // 탭 자동 서브의 뒤로 뺀 거리(m)

interface Gesture {
  startX: number;
  startY: number;
  moved: boolean;
  /** 월드 m, 손 기준 당김(상한 적용 전) */
  pullX: number;
  pullY: number;
}

export function createServeScene(opts: ServeSceneOptions): ServeSceneHandle {
  const { canvas } = opts;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2D context unavailable");
  const c2d: CanvasRenderingContext2D = ctx;

  let theme = opts.theme;
  const game = createServeGame();
  let w = 1;
  let h = 1;
  let dpr = 1;
  let lay = serveLayout(w, h);

  let gesture: Gesture | null = null;
  /** 스윙: from 포즈에서 접촉(d=0)까지 SWING_MS. 접촉 시점에 발사한다. */
  let swing: { t0: number; vx: number; vy: number; from: RacketPose } | null = null;
  /** 접촉 뒤 follow-through → 대기 포즈 복귀(또는 취소 시 복귀만) */
  let follow: { t0: number; pose: RacketPose; skipFollow: boolean } | null = null;
  const pulse: Record<ZoneId, number> = { about: 0, blog: 0 };
  const trail: { x: number; y: number; age: number }[] = [];
  let lastReady = true;
  let first = true;
  let acc = 0;
  let last = performance.now();
  let raf = 0;
  let running = false;
  let inView = true;
  let disposed = false;

  const px = (x: number) => lay.ox + x * lay.s;
  const py = (y: number) => lay.oy - y * lay.s;

  // ---------- 크기 ----------
  const resize = () => {
    const r = canvas.getBoundingClientRect();
    w = Math.max(1, r.width);
    h = Math.max(1, r.height);
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    lay = serveLayout(w, h);
    wake();
  };

  // ---------- 그리기 ----------
  /** 라켓: 면(타원, 법선=발사 방향)과 면 평면의 샤프트. 헤드 중심·방향은 racketGeom(순수)이 정한다. */
  function drawRacket(pose: RacketPose) {
    const p = PALETTE[theme];
    const g = racketGeom(pose);
    const cx = px(g.cx);
    const cy = py(g.cy);
    // 샤프트: 면 가장자리에서 면 평면을 따라 아래로
    c2d.lineCap = "round";
    c2d.strokeStyle = p.racket;
    c2d.lineWidth = Math.max(2, 0.05 * lay.s);
    c2d.beginPath();
    c2d.moveTo(cx + g.sx * FACE_HALF * lay.s, cy - g.sy * FACE_HALF * lay.s);
    c2d.lineTo(cx + g.sx * (FACE_HALF + SHAFT_LEN) * lay.s, cy - g.sy * (FACE_HALF + SHAFT_LEN) * lay.s);
    c2d.stroke();
    // 면(옆에서 본 얇은 타원): 장축 = 샤프트 방향, 단축 = 발사 방향
    c2d.save();
    c2d.translate(cx, cy);
    c2d.rotate(-Math.atan2(g.sy, g.sx));
    c2d.beginPath();
    c2d.ellipse(0, 0, FACE_HALF * lay.s, Math.max(3, FACE_THICK * lay.s), 0, 0, Math.PI * 2);
    c2d.fillStyle = p.racketFill;
    c2d.fill();
    c2d.lineWidth = Math.max(1.5, 0.035 * lay.s);
    c2d.stroke();
    c2d.restore();
  }

  function drawShuttle(x: number, y: number, ang: number, spin: number) {
    const p = PALETTE[theme];
    const L = Math.max(11, 0.3 * lay.s);
    const wd = Math.max(5, 0.13 * lay.s) * (0.7 + 0.3 * Math.abs(Math.cos(spin)));
    const cr = Math.max(3.2, 0.075 * lay.s);
    c2d.save();
    c2d.translate(px(x), py(y));
    c2d.rotate(-ang);
    c2d.beginPath();
    c2d.moveTo(0, 0);
    c2d.lineTo(-L, -wd);
    c2d.lineTo(-L, wd);
    c2d.closePath();
    c2d.fillStyle = p.skirt;
    c2d.fill();
    c2d.lineWidth = 1;
    c2d.strokeStyle = p.skirtStroke;
    c2d.stroke();
    c2d.beginPath();
    c2d.arc(0, 0, cr, 0, Math.PI * 2);
    c2d.fillStyle = p.cork;
    c2d.fill();
    c2d.restore();
  }

  function render(now: number, dt: number) {
    const p = PALETTE[theme];
    c2d.setTransform(dpr, 0, 0, dpr, 0, 0);
    c2d.clearRect(0, 0, w, h);

    // 바닥
    c2d.lineWidth = 2;
    c2d.strokeStyle = p.line;
    c2d.beginPath();
    c2d.moveTo(0, py(0));
    c2d.lineTo(w, py(0));
    c2d.stroke();
    // 네트
    c2d.strokeStyle = p.net;
    c2d.globalAlpha = 0.6;
    c2d.lineWidth = 2.5;
    c2d.beginPath();
    c2d.moveTo(px(0), py(0));
    c2d.lineTo(px(0), py(NET_TOP));
    c2d.stroke();
    c2d.globalAlpha = 0.14;
    c2d.fillStyle = p.net;
    c2d.fillRect(px(0) - 3, py(NET_TOP), 6, (NET_TOP - 0.7) * lay.s);
    c2d.globalAlpha = 1;

    // 링
    for (const z of SERVE_ZONES) {
      const k = pulse[z.id];
      const r = z.r * lay.s * (1 + 0.25 * k);
      c2d.beginPath();
      c2d.arc(px(z.cx), py(z.cy), r, 0, Math.PI * 2);
      c2d.fillStyle = p.ringFill;
      c2d.fill();
      c2d.lineWidth = 2.5 + 3 * k;
      c2d.strokeStyle = p.accent;
      c2d.stroke();
      pulse[z.id] = Math.max(0, k - dt / 0.6);
    }

    // 잔상
    for (let i = trail.length - 1; i >= 0; i--) {
      const t = trail[i];
      t.age += dt;
      if (t.age > 0.35) {
        trail.splice(i, 1);
        continue;
      }
      c2d.globalAlpha = (1 - t.age / 0.35) * 0.45;
      c2d.fillStyle = p.accent;
      c2d.beginPath();
      c2d.arc(px(t.x), py(t.y), Math.max(1.5, 0.05 * lay.s), 0, Math.PI * 2);
      c2d.fill();
    }
    c2d.globalAlpha = 1;

    // 라켓 포즈
    const idle = idlePose();
    let pose: RacketPose = idle;
    if (swing) {
      const t = Math.min(1, (now - swing.t0) / SWING_MS);
      pose = { ux: swing.from.ux, uy: swing.from.uy, d: swing.from.d * (1 - t * t) }; // ease-in, t=1에서 d=0(접촉)
    } else if (follow) {
      const t = (now - follow.t0) / (follow.skipFollow ? 1 : FOLLOW_MS);
      if (!follow.skipFollow && t < 1) {
        const e = 1 - (1 - t) * (1 - t);
        pose = { ux: follow.pose.ux, uy: follow.pose.uy, d: FOLLOW_D * e };
      } else {
        const r = Math.min(1, ((now - follow.t0) - (follow.skipFollow ? 0 : FOLLOW_MS)) / RETURN_MS);
        const from = follow.skipFollow ? follow.pose : { ...follow.pose, d: FOLLOW_D };
        const ux = from.ux + (idle.ux - from.ux) * r;
        const uy = from.uy + (idle.uy - from.uy) * r;
        const n = Math.hypot(ux, uy) || 1;
        pose = { ux: ux / n, uy: uy / n, d: from.d + (idle.d - from.d) * r };
        if (r >= 1) follow = null;
      }
    } else if (gesture?.moved) {
      pose = pullPose(gesture.pullX, gesture.pullY);
    }
    drawRacket(pose);

    // 궤적 미리보기(점선 느낌의 점)
    if (gesture?.moved && !swing) {
      const l = serveLaunch(gesture.pullX, gesture.pullY);
      if (l) {
        const pts = predictPath(HAND_X, HAND_Y, l.vx, l.vy, PREVIEW_SECONDS);
        c2d.fillStyle = p.accent;
        for (let i = 3; i < pts.length; i += 4) {
          if (py(pts[i].y) < 2) continue; // 캔버스 위로 나간 점은 그리지 않는다
          c2d.globalAlpha = 0.9 - (i / pts.length) * 0.5;
          c2d.beginPath();
          c2d.arc(px(pts[i].x), py(pts[i].y), 2.2, 0, Math.PI * 2);
          c2d.fill();
        }
        c2d.globalAlpha = 1;
      }
    }

    // 셔틀
    const s = game.shuttle;
    const a = acc / DT;
    drawShuttle(
      s.px + (s.x - s.px) * a,
      s.py + (s.y - s.py) * a,
      s.pang + (s.ang - s.pang) * a,
      s.pspin + (s.spin - s.pspin) * a
    );
  }

  // ---------- 루프 ----------
  const viewX = () => ({ xMin: -lay.ox / lay.s, xMax: (w - lay.ox) / lay.s });

  const needsFrame = () =>
    // 팝오버가 열려 정지한 셔틀은 그릴 게 없다(닫히면 ServeCourt가 wake)
    (!game.waitingServe && !(opts.isHeld() && game.shuttle.resting)) ||
    gesture !== null ||
    swing !== null ||
    follow !== null ||
    trail.length > 0 ||
    pulse.about > 0 ||
    pulse.blog > 0;

  const frame = (now: number) => {
    if (!running) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;

    if (swing && now - swing.t0 >= SWING_MS) {
      // 접촉 프레임: 면 중심이 HAND(셔틀)에 도달한 순간 발사
      launchFromHand(game, swing.vx, swing.vy);
      follow = { t0: now, pose: swing.from, skipFollow: false };
      swing = null;
    }

    acc += dt;
    while (acc >= DT) {
      acc -= DT;
      for (const ev of tickServeGame(game, { holdServe: opts.isHeld(), view: viewX() })) {
        if (ev.type === "zone") {
          if (!opts.isHeld()) pulse[ev.zone.id] = 1;
          opts.onZone(ev.zone.id);
        }
      }
    }
    if (!game.waitingServe) {
      const s = game.shuttle;
      if (!s.resting) {
        trail.push({ x: s.x, y: s.y, age: 0 });
        if (trail.length > TRAIL_MAX) trail.shift();
      }
    }

    render(now, dt);

    const ready = game.waitingServe && swing === null;
    if (ready !== lastReady) {
      lastReady = ready;
      opts.onReady(ready);
    }
    if (first) {
      first = false;
      opts.onFirstFrame();
    }

    if (needsFrame()) raf = requestAnimationFrame(frame);
    else running = false; // 대기 + 움직임 없음 → 정지, 터치/리사이즈/테마 시 wake()
  };

  function wake() {
    if (disposed || running || document.hidden || !inView) return;
    running = true;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }
  function stop() {
    // 숨김/화면 밖 동안 대기 중이던 스윙은 버린다(복귀 시 갑자기 발사되지 않게). 셔틀은 접촉 전이라 아직 손에 있다.
    swing = null;
    follow = null;
    running = false;
    cancelAnimationFrame(raf);
  }

  // ---------- 입력 ----------
  const local = (clientX: number, clientY: number) => {
    const r = canvas.getBoundingClientRect();
    return { x: clientX - r.left, y: clientY - r.top };
  };
  const inHitArea = (x: number, y: number) => {
    const a = racketHitArea(lay);
    return x >= a.x0 && x <= a.x1 && y >= a.y0 && y <= a.y1;
  };

  /** 시작이 히트 영역이면 true(제스처 개시). */
  function gDown(x: number, y: number): boolean {
    if (gesture || swing || !game.waitingServe) return false;
    if (!inHitArea(x, y)) return false;
    gesture = { startX: x, startY: y, moved: false, pullX: 0, pullY: 0 };
    follow = null;
    opts.onPulling(true);
    wake();
    return true;
  }
  function gMove(x: number, y: number) {
    if (!gesture) return;
    // 손 기준 당김: 터치 위치 - 시작 위치(라켓 잡은 지점) → 월드
    const dx = (x - gesture.startX) / lay.s;
    const dy = -(y - gesture.startY) / lay.s;
    if (!gesture.moved && Math.hypot(x - gesture.startX, y - gesture.startY) > TAP_SLOP_PX)
      gesture.moved = true;
    gesture.pullX = dx;
    gesture.pullY = dy;
    wake();
  }
  function gUp(now: number) {
    const g = gesture;
    if (!g) return;
    gesture = null;
    opts.onPulling(false);
    if (!g.moved) {
      // 움직임이 거의 없으면 길게 눌렀다 떼도 탭(단일 탭 대안, WCAG 2.5.1)
      const l = autoServeLaunch();
      const n = Math.hypot(l.vx, l.vy);
      swing = { t0: now, vx: l.vx, vy: l.vy, from: { ux: l.vx / n, uy: l.vy / n, d: TAP_BACKSWING_D } };
      wake();
      return;
    }
    const l = serveLaunch(g.pullX, g.pullY);
    if (l) {
      swing = { t0: now, vx: l.vx, vy: l.vy, from: pullPose(g.pullX, g.pullY) };
    } else {
      // 취소: 라켓이 제자리(대기 포즈)로 복귀
      follow = { t0: now, pose: pullPose(g.pullX, g.pullY), skipFollow: true };
    }
    wake();
  }
  function gCancel() {
    if (!gesture) return;
    if (gesture.moved) follow = { t0: performance.now(), pose: pullPose(gesture.pullX, gesture.pullY), skipFollow: true };
    gesture = null;
    opts.onPulling(false);
    wake();
  }

  // 터치: 히트 영역에서 시작한 touch만 추적, 그 touchmove에서만 스크롤 차단
  let touchId: number | null = null;
  const findTouch = (list: TouchList) => {
    for (let i = 0; i < list.length; i++) if (list[i].identifier === touchId) return list[i];
    return null;
  };
  const onTouchStart = (e: TouchEvent) => {
    if (touchId !== null) return;
    const t = e.changedTouches[0];
    const p = local(t.clientX, t.clientY);
    if (gDown(p.x, p.y)) touchId = t.identifier;
  };
  const onTouchMove = (e: TouchEvent) => {
    if (touchId === null) return;
    // 당김 중엔 두 번째 손가락 포함 모든 touchmove의 스크롤을 막는다
    if (e.cancelable) e.preventDefault();
    const t = findTouch(e.changedTouches);
    if (!t) return;
    const p = local(t.clientX, t.clientY);
    gMove(p.x, p.y);
  };
  const onTouchEnd = (e: TouchEvent) => {
    if (touchId === null || !findTouch(e.changedTouches)) return;
    touchId = null;
    if (e.cancelable) e.preventDefault(); // 합성 마우스/클릭 이벤트 억제
    gUp(performance.now());
  };
  const onTouchCancel = (e: TouchEvent) => {
    if (touchId === null || !findTouch(e.changedTouches)) return;
    touchId = null;
    gCancel();
  };
  canvas.addEventListener("touchstart", onTouchStart, { passive: true });
  canvas.addEventListener("touchmove", onTouchMove, { passive: false });
  canvas.addEventListener("touchend", onTouchEnd, { passive: false });
  canvas.addEventListener("touchcancel", onTouchCancel);

  // 마우스(모바일 에뮬레이션·데스크톱 확인용). 터치는 위 touch 이벤트가 처리한다.
  let mouseActive = false;
  const onPointerDown = (e: PointerEvent) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    const p = local(e.clientX, e.clientY);
    if (gDown(p.x, p.y)) {
      mouseActive = true;
      canvas.setPointerCapture(e.pointerId);
    }
  };
  const onPointerMove = (e: PointerEvent) => {
    if (!mouseActive) return;
    const p = local(e.clientX, e.clientY);
    gMove(p.x, p.y);
  };
  const onPointerUp = (e: PointerEvent) => {
    if (!mouseActive) return;
    mouseActive = false;
    gUp(performance.now());
    if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
  };
  const onPointerCancel = () => {
    if (!mouseActive) return;
    mouseActive = false;
    gCancel();
  };
  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("pointercancel", onPointerCancel);

  // ---------- 관찰자 ----------
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  const onVis = () => (document.hidden ? stop() : wake());
  document.addEventListener("visibilitychange", onVis);
  const io = new IntersectionObserver(([e]) => {
    inView = e.isIntersecting;
    if (inView) wake();
    else stop();
  });
  io.observe(canvas);

  resize();

  return {
    wake,
    setTheme(t) {
      theme = t;
      // 대기 정지 중에도 한 프레임 다시 그린다
      wake();
    },
    dispose() {
      disposed = true;
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onTouchEnd);
      canvas.removeEventListener("touchcancel", onTouchCancel);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerCancel);
    },
  };
}
