/**
 * 배드민턴 셔틀콕 물리 — 순수 TS(DOM·three·React 없음, node --test로 직접 실행).
 * 단위: 미터·초. 게임 판은 z=0 평면(x: 코트 길이, y: 높이), 네트는 x=0.
 * 프로토타입 B(docs/superpowers/prototypes/proto-b-threejs.html)의 물리를 이식하고
 * 네트 충돌을 바닥~상단 전 구간으로 확장했다.
 */

export const G = 9.81;
export const VT = 6.8; // 종단속도(m/s)
export const K = G / (VT * VT); // 2차 공기저항 계수: a = -K|v|v
export const DT = 1 / 120; // 고정 timestep
export const NET_X = 0;
export const NET_TOP = 1.55;
export const FLOOR_Y = 0.03; // 바닥에 닿았을 때 코르크 높이
export const HIT_R = 0.35;
export const HIT_MIN_SPEED = 3.0;
export const HIT_GAIN = 1.4;
export const V_MAX = 50;
export const COOLDOWN = 0.15;
export const PLAYER_HIT_MAX_X = 0.6;
export const RACKET_MAX_X = 0.4;
export const REST_TIME_TO_SERVE = 1.2;
export const SERVE_X = 5.7;
export const SERVE_Y = 1.5;

export type Rand = () => number;

export interface Shuttle {
  x: number;
  y: number;
  px: number;
  py: number;
  vx: number;
  vy: number;
  /** 코르크가 향하는 방향(rad) */
  ang: number;
  pang: number;
  angVel: number;
  /** 자기 축 회전 */
  spin: number;
  pspin: number;
  spinVel: number;
  resting: boolean;
  restTime: number;
  airTime: number;
  cd: number;
  lastDir: number;
  /** 마지막으로 셔틀을 움직인 것이 플레이어 타구인지(서브면 false) */
  byPlayer: boolean;
}

export interface Racket {
  x: number;
  y: number;
  /** 직전 프레임 위치 — 스윕 판정용 */
  px: number;
  py: number;
  vx: number;
  vy: number;
}

export type StepEvent = "floor" | "net" | null;

export function createShuttle(): Shuttle {
  return {
    x: SERVE_X,
    y: SERVE_Y,
    px: SERVE_X,
    py: SERVE_Y,
    vx: 0,
    vy: 0,
    ang: -Math.PI / 2,
    pang: -Math.PI / 2,
    angVel: 0,
    spin: 0,
    pspin: 0,
    spinVel: 0,
    resting: true,
    restTime: 0,
    airTime: 0,
    cd: 0,
    lastDir: -1,
    byPlayer: false,
  };
}

export function wrapPi(a: number): number {
  let r = (a + Math.PI) % (2 * Math.PI);
  if (r < 0) r += 2 * Math.PI;
  return r - Math.PI;
}

/** 각 스프링의 목표 각도: 비행 중엔 속도 방향(코르크 선행), 정점 근처는 "코르크 아래"로 블렌드. */
export function targetAngle(s: Shuttle): number {
  if (s.resting || s.y <= FLOOR_Y + 1e-4) {
    return s.lastDir >= 0 ? -0.55 : Math.PI + 0.55;
  }
  const speed = Math.hypot(s.vx, s.vy);
  const w = Math.min(1, Math.max(0, (speed - 0.5) / 2.5));
  return Math.atan2(s.vy * w - (1 - w), s.vx * w);
}

/** 고정 스텝 1회 진행. */
export function step(s: Shuttle, dt: number): StepEvent {
  s.px = s.x;
  s.py = s.y;
  s.pang = s.ang;
  s.pspin = s.spin;
  s.cd = Math.max(0, s.cd - dt);
  let ev: StepEvent = null;

  if (!s.resting) {
    s.airTime += dt;
    const sp = Math.hypot(s.vx, s.vy);
    // 2차 공기저항 + 중력 (semi-implicit Euler)
    s.vx += -K * sp * s.vx * dt;
    s.vy += (-G - K * sp * s.vy) * dt;
    s.x += s.vx * dt;
    s.y += s.vy * dt;
    if (Math.abs(s.vx) > 0.3) s.lastDir = Math.sign(s.vx);

    // 네트: 상단 아래(바닥까지 전 구간)에서 x=NET_X를 가로지르면 걸려서 떨어진다
    const crossed =
      (s.px < NET_X && s.x >= NET_X) || (s.px > NET_X && s.x <= NET_X);
    if (crossed && s.y < NET_TOP) {
      const side = s.px < NET_X ? -1 : 1;
      s.x = NET_X + side * 0.03;
      s.vx = -s.vx * 0.12;
      s.vy *= 0.3;
      s.angVel *= 0.3;
      ev = "net";
    }

    // 바닥
    if (s.y <= FLOOR_Y) {
      s.y = FLOOR_Y;
      if (Math.abs(s.vy) > 0.5) ev = ev ?? "floor";
      s.vy = -s.vy * 0.12;
      s.vx *= 0.4;
      if (Math.hypot(s.vx, s.vy) < 0.7) {
        s.resting = true;
        s.vx = 0;
        s.vy = 0;
        s.restTime = 0;
      }
    }
  } else {
    s.restTime += dt;
  }

  // 방향: 속도 방향으로 각 스프링(감쇠비 ≈0.26 → 반전 시 오버슈트)
  const speed = Math.hypot(s.vx, s.vy);
  const Ka = 480 + 22 * Math.min(speed, 20);
  const Ca = 2 * 0.26 * Math.sqrt(Ka);
  const err = wrapPi(targetAngle(s) - s.ang);
  s.angVel += (Ka * err - Ca * s.angVel) * dt;
  s.ang += s.angVel * dt;

  // 자기 축 회전(60fps 에일리어싱 방지로 22 rad/s 상한)
  const spinTarget = s.resting ? 0 : Math.min(22, 4 + speed * 0.5);
  s.spinVel += (spinTarget - s.spinVel) * Math.min(1, dt * 4);
  s.spin += s.spinVel * dt;
  return ev;
}

function segDist(
  px: number,
  py: number,
  ax: number,
  ay: number,
  bx: number,
  by: number
): number {
  const dx = bx - ax;
  const dy = by - ay;
  const l2 = dx * dx + dy * dy;
  const t =
    l2 > 1e-9
      ? Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / l2))
      : 0;
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

/** 라켓 타격 시도. 맞으면 타구 속도(m/s), 아니면 0. 스윕 판정으로 빠른 스윙의 터널링 방지. */
export function tryHit(s: Shuttle, r: Racket, rand: Rand = Math.random): number {
  if (s.cd > 0 || s.x > PLAYER_HIT_MAX_X) return 0;
  if (Math.hypot(r.vx, r.vy) < HIT_MIN_SPEED) return 0;
  const d = Math.min(
    segDist(s.x, s.y, r.px, r.py, r.x, r.y),
    segDist(r.x, r.y, s.px, s.py, s.x, s.y)
  );
  if (d > HIT_R) return 0;
  let vx = r.vx * HIT_GAIN;
  let vy = r.vy * HIT_GAIN + 2.0 + 0.1 * Math.max(vx, 0); // 약간의 상향 바이어스
  const sp = Math.hypot(vx, vy);
  if (sp > V_MAX) {
    vx *= V_MAX / sp;
    vy *= V_MAX / sp;
  }
  s.vx = vx;
  s.vy = vy;
  s.resting = false;
  s.cd = COOLDOWN;
  s.restTime = 0;
  s.airTime = 0;
  s.byPlayer = true;
  s.angVel += (rand() - 0.5) * 6; // 임팩트 흔들림
  s.spinVel = Math.max(s.spinVel, 14);
  return Math.min(sp, V_MAX);
}

function landX(v0: number, a: number): number {
  let x = SERVE_X;
  let y = SERVE_Y;
  let vx = -Math.cos(a) * v0;
  let vy = Math.sin(a) * v0;
  for (let i = 0; i < 120 * 20; i++) {
    const sp = Math.hypot(vx, vy);
    vx += -K * sp * vx * DT;
    vy += (-G - K * sp * vy) * DT;
    x += vx * DT;
    y += vy * DT;
    if (y <= FLOOR_Y && i > 5) return x;
  }
  return -99;
}

/** 오른쪽에서 플레이어 코트로 높은 클리어 서브. 착지 목표 x ∈ [-4.0, -2.2]. */
export function serve(s: Shuttle, rand: Rand = Math.random): void {
  const a = Math.PI * 0.2;
  const targetX = -2.2 - rand() * 1.8;
  let lo = 5;
  let hi = 60;
  for (let i = 0; i < 28; i++) {
    const mid = (lo + hi) / 2;
    if (landX(mid, a) > targetX) lo = mid;
    else hi = mid;
  }
  const v0 = (lo + hi) / 2;
  s.x = s.px = SERVE_X;
  s.y = s.py = SERVE_Y;
  s.vx = -Math.cos(a) * v0;
  s.vy = Math.sin(a) * v0;
  s.ang = s.pang = Math.atan2(s.vy, s.vx);
  s.angVel = 0;
  s.resting = false;
  s.restTime = 0;
  s.airTime = 0;
  s.cd = 0;
  s.lastDir = -1;
  s.spinVel = 12;
  s.byPlayer = false;
}

/** 정착 후 일정 시간 경과, 또는 화면 밖/장시간 체공이면 재서브 필요. */
export function needsServe(s: Shuttle): boolean {
  if (s.resting && s.restTime > REST_TIME_TO_SERVE) return true;
  if (!s.resting && (s.x < -9 || s.x > 9 || s.y > 14 || s.airTime > 14))
    return true;
  return false;
}

export function toKmh(ms: number): number {
  return Math.round(ms * 3.6);
}

export function shouldShowSpeed(ms: number): boolean {
  return ms > 30;
}

// ---------- 게임: 타깃 영역 + 서브 타이밍 ----------

export type ZoneId = "about" | "blog";

export interface Zone {
  id: ZoneId;
  label: string;
  href: string;
  cx: number;
  cy: number;
  /** 링 내부(판정) 반지름, m */
  r: number;
}

export const ZONES: readonly Zone[] = [
  { id: "about", label: "About", href: "/about", cx: 2.8, cy: 2.5, r: 0.7 },
  { id: "blog", label: "Blog", href: "/blog", cx: 5.0, cy: 1.05, r: 0.7 },
];

const ZONE_COOLDOWN = 1.5;
const FIRST_SERVE_DELAY = 0.6;

export interface Game {
  shuttle: Shuttle;
  serveTimer: number;
  waitingServe: boolean;
  zoneCd: Record<ZoneId, number>;
  rand: Rand;
}

export type GameEvent =
  | { type: "hit"; speed: number }
  | { type: "zone"; zone: Zone }
  | { type: "net" }
  | { type: "floor" };

export function createGame(rand: Rand = Math.random): Game {
  return {
    shuttle: createShuttle(),
    serveTimer: FIRST_SERVE_DELAY,
    waitingServe: true,
    zoneCd: { about: 0, blog: 0 },
    rand,
  };
}

/**
 * 고정 스텝(DT) 1회. racket이 null이면 타격 판정을 하지 않는다(링크·팝오버 호버 중).
 * opts.holdServe가 true면 서브 대기 전환은 그대로지만 serveTimer를 줄이지 않고 서브하지 않는다
 * (해제되면 남은 시간부터 이어서 카운트다운).
 */
export function tickGame(g: Game, racket: Racket | null, opts?: { holdServe?: boolean }): GameEvent[] {
  const s = g.shuttle;
  const events: GameEvent[] = [];

  if (racket) {
    const speed = tryHit(s, racket, g.rand);
    if (speed) events.push({ type: "hit", speed });
  }

  const ev = step(s, DT);
  if (ev) events.push({ type: ev });

  const sp = Math.hypot(s.vx, s.vy);
  for (const z of ZONES) {
    g.zoneCd[z.id] = Math.max(0, g.zoneCd[z.id] - DT);
    if (
      g.zoneCd[z.id] === 0 &&
      s.byPlayer &&
      !s.resting &&
      sp > 2 &&
      Math.hypot(s.x - z.cx, s.y - z.cy) < z.r
    ) {
      g.zoneCd[z.id] = ZONE_COOLDOWN;
      events.push({ type: "zone", zone: z });
    }
  }

  if (g.waitingServe) {
    if (opts?.holdServe) return events;
    g.serveTimer -= DT;
    if (g.serveTimer <= 0) {
      serve(s, g.rand);
      g.waitingServe = false;
    }
  } else if (needsServe(s)) {
    g.waitingServe = true;
    g.serveTimer = s.resting ? 0 : REST_TIME_TO_SERVE;
    s.resting = true;
    s.vx = 0;
    s.vy = 0;
    s.restTime = 0;
    if (s.y > 13 || Math.abs(s.x) > 9) {
      s.x = s.px = SERVE_X;
      s.y = s.py = SERVE_Y;
    }
  }
  return events;
}
