import { test } from "node:test";
import assert from "node:assert/strict";
import {
  DT, VT, V_MAX, NET_X, FLOOR_Y,
  createShuttle, step, tryHit, serve, wrapPi, targetAngle, toKmh, shouldShowSpeed,
  ZONES, SERVE_ZONES, createGame, tickGame,
  serveLaunch, autoServeLaunch, predictPath, createServeGame, launchFromHand, tickServeGame,
  HAND_X, HAND_Y, PULL_MIN, PULL_MAX, SERVE_V_MAX, REST_TIME_TO_SERVE,
  type Racket, type Shuttle, type Zone,
} from "./physics.ts";
import { serveLayout, racketHitArea, racketHeadWorld, racketGeom, pullPose, PREVIEW_SECONDS, idlePose, D_IDLE, D_MAX, VIEW_W, VIEW_H, VIEW_X0, FLOOR_MARGIN } from "./serveLayout.ts";

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

/** 발사 후 가장 먼저 맞는 링 id(팝오버는 첫 명중으로 고정되므로). 없으면 null. */
function firstZone(vx: number, vy: number): string | null {
  const g = createServeGame();
  launchFromHand(g, vx, vy);
  for (let i = 0; i < 120 * 10 && !g.waitingServe; i++)
    for (const e of tickServeGame(g, { holdServe: true })) if (e.type === "zone") return e.zone.id;
  return null;
}
const pullAt = (angDeg: number, len: number) => {
  const a = (angDeg * Math.PI) / 180;
  return serveLaunch(-Math.cos(a) * len, -Math.sin(a) * len)!;
};

test("모바일 서브: 링이 세로로 쌓여 있어 높이만으로 목표가 갈린다(첫 명중 기준 각 20칸 이상)", () => {
  const count: Record<string, number> = { about: 0, blog: 0 };
  for (let ang = 0; ang <= 85; ang += 5)
    for (let len = 0.3; len <= PULL_MAX + 1e-9; len += 0.1) {
      const l = pullAt(ang, len);
      const f = firstZone(l.vx, l.vy);
      if (f) count[f]++;
    }
  assert.ok(count.about >= 20 && count.blog >= 20, JSON.stringify(count));
});

test("모바일 서브: 낮은 직구는 Blog(아래 링)를, 높은 클리어는 About(위 링)을 먼저 맞힌다", () => {
  const flat = pullAt(10, 1.8);
  assert.equal(firstZone(flat.vx, flat.vy), "blog");
  const high = pullAt(30, 1.8);
  assert.equal(firstZone(high.vx, high.vy), "about");
});

test("서브 링은 같은 x에 세로로 쌓여 있고 사이에 0.3m 이상 간격(About이 위)", () => {
  const [about, blog] = [SERVE_ZONES[0], SERVE_ZONES[1]];
  assert.equal(about.id, "about");
  assert.equal(about.cx, blog.cx);
  assert.ok(about.cy - blog.cy - about.r - blog.r >= 0.3);
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
  const view = { xMin: -5.0, xMax: 6.0 };
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

test("racketHitArea: 라켓 헤드(중심·타원 범위)가 s=25/31/63에서 영역 안, 좌측은 박스 안", () => {
  for (const s of [25, 31, 63]) {
    const w = s * VIEW_W;
    const h = s * VIEW_H;
    const lay = serveLayout(w, h);
    const a = racketHitArea(lay);
    assert.ok(a.x0 >= 0 && a.x1 - a.x0 >= 88 - 1e-9 && a.y1 - a.y0 >= 88 - 1e-9, `s=${s}`);
    const head = racketHeadWorld();
    for (const [dx, dy] of [[0, 0], [0.2, 0], [-0.2, 0], [0, 0.2], [0, -0.2]]) {
      const x = lay.ox + (head.x + dx) * lay.s;
      const y = lay.oy - (head.y + dy) * lay.s;
      assert.ok(x >= a.x0 && x <= a.x1 && y >= a.y0 && y <= a.y1, `s=${s} d=${dx},${dy}`);
    }
  }
});

// ---------- 모바일 레이아웃 (342px 폰 박스) ----------

const PHONE_W = 342;
const phoneLay = () => serveLayout(PHONE_W, (PHONE_W * VIEW_H) / VIEW_W);

test("서브 링: 폰에서 지름 ≥ 56px, 바닥·네트와 겹치지 않고 뷰 안(우측 여백 포함)", () => {
  const { s } = phoneLay();
  for (const z of SERVE_ZONES) {
    assert.ok(z.r * 2 * s >= 56, `${z.id} d=${z.r * 2 * s}`);
    assert.ok(z.cy - z.r > 0.2 && z.cx - z.r > NET_X + 1, z.id);
    assert.ok(z.cx + z.r <= VIEW_X0 + VIEW_W - 0.1, z.id);
    assert.ok(z.cy + z.r < VIEW_H - FLOOR_MARGIN, z.id);
  }
  assert.deepEqual(
    SERVE_ZONES.map((z) => z.id),
    ZONES.map((z) => z.id)
  );
});

test("PC ZONES는 바뀌지 않았다", () => {
  assert.deepEqual(
    ZONES.map((z) => [z.cx, z.cy, z.r]),
    [[2.8, 2.5, 0.7], [5.0, 1.05, 0.7]]
  );
});

test("폰: 라켓 헤드는 박스 왼쪽 20~30%, 왼쪽·아래에 최대 당김(px)만큼 여유", () => {
  const lay = phoneLay();
  const head = racketHeadWorld();
  const hx = lay.ox + head.x * lay.s;
  const hy = lay.oy - head.y * lay.s;
  assert.ok(hx / PHONE_W >= 0.2 && hx / PHONE_W <= 0.3, `${hx / PHONE_W}`);
  const pullPx = PULL_MAX * lay.s;
  assert.ok(pullPx >= 60 && pullPx <= 80, `pull=${pullPx}`);
  assert.ok(hx - pullPx * 0.45 > 0, "라켓 헤드(RACKET_PULL_VIS)가 박스 밖으로 나가지 않는다");
  const handX = lay.ox + HAND_X * lay.s;
  assert.ok(handX > 0, "손은 박스 안");
  assert.ok((PHONE_W * VIEW_H) / VIEW_W - hy > 0);
});

test("폰: 당김 미리보기가 네트를 넘는 호를 보여준다(전체 경로는 아님)", () => {
  const l = serveLaunch(-1.2, -1.2)!;
  const pts = predictPath(HAND_X, HAND_Y, l.vx, l.vy, PREVIEW_SECONDS);
  assert.ok(pts.some((p) => p.x > NET_X), "네트 오른쪽까지 이어진다");
  assert.ok(pts[pts.length - 1].y > FLOOR_Y + 0.1, "미리보기 안에 착지하지 않는다");
});

test("모바일 서브: PC ZONES(r 0.7)가 아닌 SERVE_ZONES로 판정", () => {
  const g = createServeGame();
  launchFromHand(g, 1, 0);
  const z = SERVE_ZONES[0];
  Object.assign(g.shuttle, { x: z.cx + 0.8, y: z.cy, px: z.cx + 0.8, py: z.cy, vx: -5, vy: 0 });
  const ids: string[] = [];
  for (let i = 0; i < 20; i++) for (const e of tickServeGame(g, { holdServe: true })) if (e.type === "zone") ids.push(e.zone.id);
  assert.ok(ids.includes("about"), "r 0.7~0.9 사이 거리(0.8m)에서도 명중");
});

// ---------- 라켓 포즈 (면 법선 = 발사 방향, 접촉점 = HAND) ----------

test("라켓 포즈: 면 법선이 발사 벡터와 평행, 샤프트는 면과 같은 평면(법선에 수직)", () => {
  for (const [dx, dy] of [[-0.5, -0.5], [-1.2, -0.3], [-0.4, -1.6], [-2.0, 0.2]]) {
    const l = serveLaunch(dx, dy)!;
    const pose = pullPose(dx, dy);
    const cross = pose.ux * l.vy - pose.uy * l.vx;
    const dot = pose.ux * l.vx + pose.uy * l.vy;
    assert.ok(Math.abs(cross) < 1e-9 && dot > 0, `${dx},${dy}`);
    const g = racketGeom(pose);
    assert.ok(Math.abs(g.sx * pose.ux + g.sy * pose.uy) < 1e-9);
    assert.ok(g.sy <= 1e-9, "샤프트는 아래쪽");
  }
});

test("라켓 포즈: 접촉(d=0)에서 면 중심 = HAND, 당길수록 셔틀 반대쪽으로 물러난다", () => {
  const pose = pullPose(-1.0, -1.0);
  const contact = racketGeom({ ...pose, d: 0 });
  assert.ok(Math.abs(contact.cx - HAND_X) < 1e-12 && Math.abs(contact.cy - HAND_Y) < 1e-12);
  const back = racketGeom(pose);
  const l = serveLaunch(-1.0, -1.0)!;
  assert.ok((back.cx - HAND_X) * l.vx + (back.cy - HAND_Y) * l.vy < 0, "발사 방향 반대편");
  assert.ok(Math.abs(pullPose(-PULL_MAX * 2, 0).d - D_MAX) < 1e-9);
  assert.ok(Math.abs(pullPose(-PULL_MIN * 0.5, 0).d - D_IDLE) < 0.1);
  const i = idlePose();
  const al = autoServeLaunch();
  assert.ok(Math.abs(i.ux * al.vy - i.uy * al.vx) < 1e-9, "대기 포즈는 자동 서브 방향");
});

test("폰: 최대 당김 때도 라켓 면·샤프트 끝이 박스 안", () => {
  const lay = phoneLay();
  const boxH = (PHONE_W * VIEW_H) / VIEW_W;
  for (let ang = 0; ang <= 85; ang += 5) {
    const a = (ang * Math.PI) / 180;
    const pose = pullPose(-Math.cos(a) * PULL_MAX, -Math.sin(a) * PULL_MAX);
    const g = racketGeom(pose);
    for (const k of [0, 0.26, 1.16]) {
      const x = lay.ox + (g.cx + g.sx * k) * lay.s;
      const y = lay.oy - (g.cy + g.sy * k) * lay.s;
      assert.ok(x >= 0 && x <= PHONE_W && y >= 0 && y <= boxH, `ang=${ang} k=${k} (${x},${y})`);
    }
  }
});

test("라켓 포즈: 샤프트 방향은 면 방향이 수직(ux=0)을 지날 때도 연속", () => {
  let prev = racketGeom({ ux: Math.cos(1.7), uy: Math.sin(1.7), d: 0.5 });
  for (let a = 1.7; a >= 1.4; a -= 0.01) {
    const g = racketGeom({ ux: Math.cos(a), uy: Math.sin(a), d: 0.5 });
    assert.ok(Math.hypot(g.sx - prev.sx, g.sy - prev.sy) < 0.02, `a=${a}`);
    prev = g;
  }
});
