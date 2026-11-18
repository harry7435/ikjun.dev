import { test } from "node:test";
import assert from "node:assert/strict";
import {
  DT, VT, V_MAX, NET_X, FLOOR_Y,
  createShuttle, step, tryHit, serve, wrapPi, targetAngle, toKmh, shouldShowSpeed,
  ZONES, createGame, tickGame,
  serveLaunch, autoServeLaunch, predictPath, createServeGame, launchFromHand, tickServeGame,
  HAND_X, HAND_Y, PULL_MIN, PULL_MAX, SERVE_V_MAX, REST_TIME_TO_SERVE,
  type Racket, type Shuttle, type Zone,
} from "./physics.ts";
import { serveLayout, racketHitArea, racketHeadWorld } from "./serveLayout.ts";

const fixed = (v: number) => () => v;
function airborne(x: number, y: number, vx: number, vy: number): Shuttle {
  const s = createShuttle();
  Object.assign(s, { x, y, px: x, py: y, vx, vy, resting: false, ang: Math.atan2(vy, vx), pang: Math.atan2(vy, vx) });
  return s;
}
function run(s: Shuttle, seconds: number) {
  const events: string[] = [];
  for (let t = 0; t < seconds; t += DT) { const e = step(s, DT); if (e) events.push(e); }
  return events;
}

test("공기저항: 50 m/s 타구는 0.1초 안에 절반 아래로 감속", () => {
  const s = airborne(-5, 20, 50, 0);
  run(s, 0.1);
  assert.ok(Math.hypot(s.vx, s.vy) < 25, `speed=${Math.hypot(s.vx, s.vy)}`);
});

test("공기저항: 낙하 속도는 종단속도 VT(≈6.8)에 수렴", () => {
  const s = airborne(-5, 200, 0, 0);
  run(s, 6);
  assert.ok(Math.abs(Math.abs(s.vy) - VT) < 0.05, `vy=${s.vy}`);
});

test("방향 반전 타격 후 각도가 목표를 넘어갔다 돌아온다(뒤집힘 오버슈트)", () => {
  const s = airborne(-5, 30, 20, 0);
  run(s, 0.3); // +x 방향으로 정렬
  s.vx = -20; s.vy = 0; // 반전
  let minErr = Infinity, maxErr = -Infinity;
  for (let t = 0; t < 0.6; t += DT) {
    step(s, DT);
    const err = wrapPi(targetAngle(s) - s.ang);
    minErr = Math.min(minErr, err); maxErr = Math.max(maxErr, err);
  }
  assert.ok(minErr < -0.05 && maxErr > 0.05, `err range [${minErr}, ${maxErr}]`);
});

test("네트: 바닥 근처(0.3m)로 지나가도 걸린다", () => {
  const s = airborne(-1, 0.3, 10, 0);
  const ev = run(s, 0.3);
  assert.ok(ev.includes("net"));
  assert.ok(s.x < NET_X);
});

test("네트: 상단 아래(1.4m)는 걸리고, 상단 위(2.0m)는 통과", () => {
  const low = airborne(-1, 1.4, 12, 0);
  assert.ok(run(low, 0.2).includes("net"));
  const high = airborne(-1, 2.0, 12, 4);
  assert.ok(!run(high, 0.3).includes("net"));
  assert.ok(high.x > NET_X);
});

test("서브는 네트에 닿지 않고 플레이어 코트(x<0)에 떨어진다", () => {
  for (const r of [0, 0.5, 0.99]) {
    const s = createShuttle();
    serve(s, fixed(r));
    const ev = run(s, 4);
    assert.ok(!ev.includes("net"), `rand=${r}`);
    assert.ok(s.resting, `rand=${r} not resting`);
    assert.ok(s.x < -1.5 && s.x > -4.6, `rand=${r} x=${s.x}`);
    assert.equal(s.byPlayer, false);
  }
});

test("타격 속도 상한 50 m/s", () => {
  const s = airborne(-2, 1.5, 0, 0);
  const r: Racket = { x: -2, y: 1.5, px: -2.2, py: 1.5, vx: 120, vy: 0 };
  const sp = tryHit(s, r, fixed(0.5));
  assert.ok(sp > 0 && sp <= V_MAX);
  assert.ok(Math.hypot(s.vx, s.vy) <= V_MAX + 1e-9);
  assert.equal(s.byPlayer, true);
});

test("스윕 판정: 프레임 사이에 셔틀을 지나친 라켓도 맞는다", () => {
  const s = airborne(0, 1.2, 0, 0);
  s.resting = true;
  const r: Racket = { x: 0.3, y: 1.0, px: -0.5, py: 1.0, vx: 20, vy: 0 };
  // 끝점 기준 거리 hypot(0.3, 0.2)=0.36 > 0.35 → 스윕 없이는 미스
  assert.ok(tryHit(s, r, fixed(0.5)) > 0);
});

test("상대 코트(x > 0.6) 셔틀과 느린 스윙은 맞지 않는다", () => {
  const far = airborne(1, 1.2, 0, 0);
  assert.equal(tryHit(far, { x: 0.4, y: 1.2, px: 0, py: 1.2, vx: 20, vy: 0 }), 0);
  const near = airborne(-1, 1.2, 0, 0);
  assert.equal(tryHit(near, { x: -1, y: 1.2, px: -1, py: 1.2, vx: 1, vy: 0 }), 0);
});

test("쿨다운 150ms 동안 재타격 불가", () => {
  const s = airborne(-1, 1.2, 0, 0);
  const r: Racket = { x: -1, y: 1.2, px: -1.1, py: 1.2, vx: 10, vy: 0 };
  assert.ok(tryHit(s, r, fixed(0.5)) > 0);
  Object.assign(s, { x: -1, y: 1.2, px: -1, py: 1.2 });
  assert.equal(tryHit(s, r, fixed(0.5)), 0);
});

test("바닥에 정착한다", () => {
  const s = airborne(-3, 1, 0, -5);
  const ev = run(s, 2);
  assert.ok(ev.includes("floor"));
  assert.ok(s.resting);
  assert.ok(Math.abs(s.y - FLOOR_Y) < 1e-9);
});

test("km/h 변환과 표시 기준", () => {
  assert.equal(toKmh(45), 162);
  assert.equal(toKmh(50), 180);
  assert.equal(shouldShowSpeed(30), false);
  assert.equal(shouldShowSpeed(30.1), true);
});

function tickFor(g: ReturnType<typeof createGame>, seconds: number, racket: Racket | null = null) {
  const out: string[] = [];
  for (let t = 0; t < seconds; t += DT) for (const e of tickGame(g, racket)) out.push(e.type === "zone" ? `zone:${e.zone.id}` : e.type);
  return out;
}

test("게임 시작 0.6초 뒤 첫 서브", () => {
  const g = createGame(() => 0.5);
  tickFor(g, 0.55);
  assert.equal(g.shuttle.resting, true);
  tickFor(g, 0.1);
  assert.equal(g.shuttle.resting, false);
});

function tickHold(g: ReturnType<typeof createGame>, seconds: number, holdServe: boolean) {
  for (let t = 0; t < seconds; t += DT) tickGame(g, null, { holdServe });
}

test("holdServe: 첫 서브도 막는다", () => {
  const g = createGame(() => 0.5);
  tickHold(g, 5, true);
  assert.equal(g.waitingServe, true);
  assert.equal(g.shuttle.resting, true);
  tickHold(g, 0.7, false);
  assert.equal(g.shuttle.resting, false);
});

test("holdServe: 정지한 셔틀은 5초간 서브되지 않고, 해제 후 REST_TIME 내에 서브된다", () => {
  const g = createGame(() => 0.5);
  tickFor(g, 0.7); // 첫 서브
  assert.equal(g.shuttle.resting, false);
  tickHold(g, 15, true); // 안착
  assert.equal(g.waitingServe, true);
  assert.equal(g.shuttle.resting, true);
  tickHold(g, 5, true);
  assert.equal(g.waitingServe, true);
  assert.equal(g.shuttle.resting, true);
  tickHold(g, 1.2 + 0.1, false);
  assert.equal(g.waitingServe, false);
  assert.equal(g.shuttle.resting, false);
});

test("zone 판정은 플레이어 타구만 — 서브 셔틀이 영역을 지나가도 이벤트 없음", () => {
  const g = createGame(() => 0.5);
  const about = ZONES.find((z) => z.id === "about") as Zone;
  g.waitingServe = false;
  Object.assign(g.shuttle, { x: about.cx, y: about.cy, px: about.cx, py: about.cy, vx: -5, vy: 0, resting: false, byPlayer: false });
  assert.ok(!tickFor(g, DT).some((e) => e.startsWith("zone")));
  Object.assign(g.shuttle, { x: about.cx, y: about.cy, px: about.cx, py: about.cy, vx: -5, vy: 0, resting: false, byPlayer: true });
  assert.ok(tickFor(g, DT).includes("zone:about"));
});

test("같은 영역은 1.5초 쿨다운", () => {
  const g = createGame(() => 0.5);
  const about = ZONES.find((z) => z.id === "about") as Zone;
  g.waitingServe = false;
  const put = () => Object.assign(g.shuttle, { x: about.cx, y: about.cy, px: about.cx, py: about.cy, vx: -5, vy: 0, resting: false, byPlayer: true });
  put(); assert.ok(tickFor(g, DT).includes("zone:about"));
  put(); assert.ok(!tickFor(g, DT).includes("zone:about"));
});

test("racket이 null이면 타격하지 않는다(링크 위 호버)", () => {
  const g = createGame(() => 0.5);
  g.waitingServe = false;
  Object.assign(g.shuttle, { x: -1, y: 1.2, px: -1, py: 1.2, vx: 0, vy: 0, resting: false });
  assert.ok(!tickFor(g, DT, null).includes("hit"));
  const r: Racket = { x: -1, y: 1.2, px: -1.2, py: 1.2, vx: 15, vy: 0 };
  Object.assign(g.shuttle, { x: -1, y: 1.2, px: -1, py: 1.2, vx: 0, vy: 0, resting: false });
  assert.ok(tickFor(g, DT, r).includes("hit"));
});

test("정착 후 1.2초 지나면 재서브", () => {
  const g = createGame(() => 0.5);
  tickFor(g, 0.7); // 첫 서브
  tickFor(g, 4); // 착지 + 1.2s 대기 + 재서브 대기
  assert.equal(g.shuttle.byPlayer, false);
  assert.ok(g.shuttle.airTime < 4, "재서브되어 체공 시간이 리셋돼야 함");
});

test("링은 바닥과 겹치지 않고 네트 오른쪽에 있다", () => {
  for (const z of ZONES) {
    assert.ok(z.cy - z.r > 0.2, z.id);
    assert.ok(z.cx - z.r > NET_X + 1, z.id);
  }
});

test("링 중심을 지나는 타구는 zone 이벤트, 옛 박스 모서리(원 바깥)는 이벤트 없음", () => {
  const about = ZONES.find((z) => z.id === "about") as Zone;
  const at = (x: number, y: number) => {
    const g = createGame(() => 0.5);
    g.waitingServe = false;
    Object.assign(g.shuttle, { x, y, px: x, py: y, vx: -5, vy: 0, resting: false, byPlayer: true });
    return tickFor(g, DT);
  };
  assert.ok(at(about.cx, about.cy).includes("zone:about"));
  assert.ok(!at(about.cx + 0.65, about.cy + 0.5).includes("zone:about"));
});

// ---------- 모바일 서브 ----------

test("serveLaunch: 발사 방향은 당김의 반대", () => {
  const l = serveLaunch(-0.5, -0.5)!;
  assert.ok(l.vx > 0 && l.vy > 0);
  assert.ok(Math.abs(l.vx - l.vy) < 1e-9);
  const m = serveLaunch(0.6, 0)!;
  assert.ok(m.vx < 0 && Math.abs(m.vy) < 1e-9);
});

test("serveLaunch: 파워는 당김 길이에 비례하고 PULL_MAX에서 상한", () => {
  const half = serveLaunch(-PULL_MAX / 2, 0)!;
  assert.ok(Math.abs(Math.hypot(half.vx, half.vy) - SERVE_V_MAX / 2) < 1e-9);
  const over = serveLaunch(-PULL_MAX * 3, -PULL_MAX * 3)!;
  assert.ok(Math.abs(Math.hypot(over.vx, over.vy) - SERVE_V_MAX) < 1e-9);
});

test("serveLaunch: 임계(PULL_MIN) 미만이면 null(취소)", () => {
  assert.equal(serveLaunch(0, 0), null);
  assert.equal(serveLaunch(-PULL_MIN * 0.9, 0), null);
  assert.ok(serveLaunch(-PULL_MIN * 1.01, 0));
});

test("autoServeLaunch: 네트에 닿지 않고 x>0에 착지", () => {
  const l = autoServeLaunch();
  const s = airborne(HAND_X, HAND_Y, l.vx, l.vy);
  const ev = run(s, 6);
  assert.ok(!ev.includes("net"), "net");
  assert.ok(s.x > 0, `x=${s.x}`);
  assert.ok(!zonesHit(l.vx, l.vy).size, "링을 지나지 않는다");
  assert.ok(predictPath(HAND_X, HAND_Y, l.vx, l.vy, 6).every((p) => p.y < 3.95), "정점 ≤ 3.9m");
});

test("predictPath: 직접 시뮬레이션과 일치, 바닥에서 멈춤", () => {
  const l = serveLaunch(-0.8, -0.6)!;
  const pts = predictPath(HAND_X, HAND_Y, l.vx, l.vy, 10);
  const s = airborne(HAND_X, HAND_Y, l.vx, l.vy);
  for (let i = 1; i < pts.length; i++) {
    step(s, DT);
    assert.ok(Math.abs(pts[i].x - s.x) < 1e-9 && Math.abs(pts[i].y - s.y) < 1e-9, `i=${i}`);
  }
  assert.ok(pts[pts.length - 1].y <= FLOOR_Y + 1e-9);
  assert.ok(predictPath(HAND_X, HAND_Y, l.vx, l.vy, 0.35).length <= Math.ceil(0.35 / DT) + 1);
});

function zonesHit(vx: number, vy: number): Set<string> {
  const g = createServeGame();
  launchFromHand(g, vx, vy);
  const ids = new Set<string>();
  for (let i = 0; i < 120 * 10 && !g.waitingServe; i++)
    for (const e of tickServeGame(g, { holdServe: true })) if (e.type === "zone") ids.add(e.zone.id);
  return ids;
}

test("모바일 서브: 당김 격자에서 About·Blog 링 모두 명중 가능(byPlayer 판정)", () => {
  const found = new Set<string>();
  for (let ang = 10; ang <= 85; ang += 5)
    for (let len = 0.3; len <= PULL_MAX + 1e-9; len += 0.1) {
      const a = (ang * Math.PI) / 180;
      const l = serveLaunch(-Math.cos(a) * len, -Math.sin(a) * len)!;
      for (const id of zonesHit(l.vx, l.vy)) found.add(id);
    }
  assert.ok(found.has("about") && found.has("blog"), [...found].join());
});

test("모바일 서브: 발사 직후 byPlayer=true, 대기 해제", () => {
  const g = createServeGame();
  assert.equal(g.waitingServe, true);
  launchFromHand(g, 5, 5);
  assert.equal(g.shuttle.byPlayer, true);
  assert.equal(g.waitingServe, false);
});

test("모바일 서브: 대기 중엔 셔틀이 손에 머문다", () => {
  const g = createServeGame();
  for (let i = 0; i < 600; i++) tickServeGame(g);
  assert.equal(g.shuttle.x, HAND_X);
  assert.equal(g.shuttle.y, HAND_Y);
  assert.equal(g.waitingServe, true);
});

test("모바일 서브: 정착 + REST_TIME 뒤 손으로 재장전(byPlayer 해제)", () => {
  const g = createServeGame();
  const l = autoServeLaunch();
  launchFromHand(g, l.vx, l.vy);
  let t = 0;
  while (!g.waitingServe && t < 20) { tickServeGame(g); t += DT; }
  assert.equal(g.waitingServe, true);
  assert.ok(t > REST_TIME_TO_SERVE, `t=${t}`);
  assert.equal(g.shuttle.x, HAND_X);
  assert.equal(g.shuttle.y, HAND_Y);
  assert.equal(g.shuttle.resting, true);
  assert.equal(g.shuttle.byPlayer, false);
});

test("모바일 서브: holdServe 동안 재장전하지 않고, 해제하면 재장전", () => {
  const g = createServeGame();
  const l = autoServeLaunch();
  launchFromHand(g, l.vx, l.vy);
  for (let i = 0; i < 120 * 8; i++) tickServeGame(g, { holdServe: true });
  assert.equal(g.waitingServe, false);
  assert.equal(g.shuttle.resting, true);
  tickServeGame(g);
  assert.equal(g.waitingServe, true);
});

test("모바일 서브: 보이는 영역 밖으로 나가면 1초 안에 재장전(holdServe면 보류)", () => {
  const view = { xMin: -1.5, xMax: 5.9 };
  const g = createServeGame();
  launchFromHand(g, -22, 6);
  let t = 0;
  while (!g.waitingServe && t < 5) { tickServeGame(g, { view }); t += DT; }
  assert.equal(g.waitingServe, true);
  assert.ok(t < 1, `t=${t}`);
  const h = createServeGame();
  launchFromHand(h, -22, 6);
  for (let i = 0; i < 120; i++) tickServeGame(h, { view, holdServe: true });
  assert.equal(h.waitingServe, false);
});

test("racketHitArea: 라켓 헤드(중심·타원 범위)가 s=36/46/78에서 영역 안, 좌측은 박스 안", () => {
  for (const s of [36, 46, 78]) {
    const w = s * 7.4;
    const h = s * 4.6;
    const lay = serveLayout(w, h);
    const a = racketHitArea(lay);
    assert.ok(a.x0 >= 0 && a.x1 - a.x0 >= 72 - 1e-9 && a.y1 - a.y0 >= 72 - 1e-9, `s=${s}`);
    const head = racketHeadWorld();
    for (const [dx, dy] of [[0, 0], [0.2, 0], [-0.2, 0], [0, 0.2], [0, -0.2]]) {
      const x = lay.ox + (head.x + dx) * lay.s;
      const y = lay.oy - (head.y + dy) * lay.s;
      assert.ok(x >= a.x0 && x <= a.x1 && y >= a.y0 && y <= a.y1, `s=${s} d=${dx},${dy}`);
    }
  }
});
