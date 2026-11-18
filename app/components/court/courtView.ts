/**
 * PC 히어로 3D 장면의 카메라·코트 기하(순수 TS, three/DOM/React import 금지).
 * scene.ts(three)와 CourtLayer(로딩 중 코트 SVG)가 같은 상수를 써서 두 화면이 픽셀 단위로 일치한다.
 */
import { NET_TOP } from "./physics.ts";

export const CAM_DIST = 11;
export const WORLD_HALF_W = 7.2;
export const CAM_BASE = { x: 0.4, y: 3.3, z: CAM_DIST } as const;
export const CAM_LOOK = { x: 0, y: 1.9, z: 0 } as const;
export const CAM_NEAR = 0.1;
export const CAM_FAR = 80;

export const COURT_L = 13.4;
export const COURT_W = 6.1;
/** 코트 바닥 판(라인 바깥 여백 포함) 크기 */
export const COURT_PAD = 1.6;
export const LINE_WIDTH = 0.04;
export const LINE_Y = 0.004;

export const NET_Y0 = 0.76;
export const NET_CELL = 0.1;
export const POST_RADIUS = { top: 0.035, bottom: 0.04 } as const;
export const POST_H = NET_TOP + 0.05;
export const POST_Z_OFFSET = 0.08;
export const TAPE = { thick: 0.03, h: 0.075 } as const;

/** 종횡비에 따른 세로 fov(도). 월드 가로 ±7.2m가 항상 보이도록 넓히되 40° 이하로 좁히지 않는다. */
export function fovForAspect(aspect: number): number {
  return Math.max(40, (2 * Math.atan(WORLD_HALF_W / aspect / CAM_DIST) * 180) / Math.PI);
}

/** 바닥 라인 중심선 [x1, z1, x2, z2] (폭 LINE_WIDTH, y=LINE_Y) */
export function courtLineSegments(): [number, number, number, number][] {
  const hl = COURT_L / 2;
  const hw = COURT_W / 2;
  const sw = 5.18 / 2;
  const out: [number, number, number, number][] = [
    [-hl, -hw, hl, -hw],
    [-hl, hw, hl, hw],
    [-hl, -hw, -hl, hw],
    [hl, -hw, hl, hw],
    [-hl, -sw, hl, -sw],
    [-hl, sw, hl, sw],
  ];
  for (const sgn of [-1, 1]) {
    out.push([sgn * 1.98, -hw, sgn * 1.98, hw]);
    out.push([sgn * 5.94, -hw, sgn * 5.94, hw]);
    out.push([sgn * 1.98, 0, sgn * hl, 0]);
  }
  return out;
}

/** 네트 격자 선분을 [x,y,z,x,y,z,...]로 (x=0 평면) */
export function netGridPoints(): number[] {
  const hw = COURT_W / 2;
  const pts: number[] = [];
  for (let z = -hw; z <= hw + 1e-6; z += NET_CELL) pts.push(0, NET_Y0, z, 0, NET_TOP, z);
  for (let y = NET_Y0; y <= NET_TOP + 1e-6; y += NET_CELL) pts.push(0, y, -hw, 0, y, hw);
  return pts;
}

export const POST_ZS = [-COURT_W / 2 - POST_Z_OFFSET, COURT_W / 2 + POST_Z_OFFSET] as const;

// ---------------------------------------------------------------------------
// 투영 — three PerspectiveCamera(lookAt) 와 동일 (up = +Y)
// ---------------------------------------------------------------------------

type V3 = [number, number, number];
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a: V3): V3 => {
  const l = Math.hypot(a[0], a[1], a[2]) || 1;
  return [a[0] / l, a[1] / l, a[2] / l];
};

const zAxis = norm(sub([CAM_BASE.x, CAM_BASE.y, CAM_BASE.z], [CAM_LOOK.x, CAM_LOOK.y, CAM_LOOK.z]));
const xAxis = norm(cross([0, 1, 0], zAxis));
const yAxis = cross(zAxis, xAxis);

/** 월드 점 → 박스(width×height CSS px) 기준 픽셀. 카메라 뒤(near 이전)면 null */
export function projectPoint(x: number, y: number, z: number, width: number, height: number): { x: number; y: number } | null {
  const d = sub([x, y, z], [CAM_BASE.x, CAM_BASE.y, CAM_BASE.z]);
  const vx = d[0] * xAxis[0] + d[1] * xAxis[1] + d[2] * xAxis[2];
  const vy = d[0] * yAxis[0] + d[1] * yAxis[1] + d[2] * yAxis[2];
  const vz = d[0] * zAxis[0] + d[1] * zAxis[1] + d[2] * zAxis[2];
  if (-vz <= CAM_NEAR) return null;
  const aspect = width / height;
  const f = 1 / Math.tan((fovForAspect(aspect) * Math.PI) / 360);
  const nx = (vx * (f / aspect)) / -vz;
  const ny = (vy * f) / -vz;
  return { x: (nx * 0.5 + 0.5) * width, y: (-ny * 0.5 + 0.5) * height };
}

export interface Pt {
  x: number;
  y: number;
}

export interface CourtOutline {
  /** 코트 바닥 판 (사각형) */
  floor: Pt[];
  /** 라인 폴리곤들 */
  lines: Pt[][];
  /** 네트 격자 선분 [a, b] */
  net: [Pt, Pt][];
  /** 네트 상단 테이프 */
  tape: Pt[];
  /** 포스트(사다리꼴) */
  posts: Pt[][];
}

/** 3D 장면이 그리는 코트(바닥·라인·네트·포스트)를 박스 픽셀 좌표로 투영 */
export function courtOutlinePx(width: number, height: number): CourtOutline {
  const P = (x: number, y: number, z: number): Pt => projectPoint(x, y, z, width, height) ?? { x: NaN, y: NaN };
  const hw = COURT_W / 2;

  const fx = (COURT_L + COURT_PAD) / 2;
  const fz = (COURT_W + COURT_PAD) / 2;
  const floor = [P(-fx, 0, -fz), P(fx, 0, -fz), P(fx, 0, fz), P(-fx, 0, fz)];

  const lines = courtLineSegments().map(([x1, z1, x2, z2]) => {
    const dx = x2 - x1;
    const dz = z2 - z1;
    const l = Math.hypot(dx, dz) || 1;
    const nx = (-dz / l) * (LINE_WIDTH / 2);
    const nz = (dx / l) * (LINE_WIDTH / 2);
    return [P(x1 + nx, LINE_Y, z1 + nz), P(x2 + nx, LINE_Y, z2 + nz), P(x2 - nx, LINE_Y, z2 - nz), P(x1 - nx, LINE_Y, z1 - nz)];
  });

  const g = netGridPoints();
  const net: [Pt, Pt][] = [];
  for (let i = 0; i < g.length; i += 6) net.push([P(g[i], g[i + 1], g[i + 2]), P(g[i + 3], g[i + 4], g[i + 5])]);

  const ty1 = NET_TOP + 0.0025;
  const ty0 = NET_TOP - 0.035 - TAPE.h / 2;
  const tz = hw + 0.08;
  const tape = [P(0, ty0, -tz), P(0, ty1, -tz), P(0, ty1, tz), P(0, ty0, tz)];

  const posts = POST_ZS.map((z) => [
    P(-POST_RADIUS.bottom, 0, z),
    P(POST_RADIUS.bottom, 0, z),
    P(POST_RADIUS.top, POST_H, z),
    P(-POST_RADIUS.top, POST_H, z),
  ]);

  return { floor, lines, net, tape, posts };
}
