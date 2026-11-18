/**
 * 모바일 서브 코트의 월드(m) ↔ 박스(px) 변환. 순수 TS — ServeCourt(React)와 serveScene(캔버스)이 공유한다.
 * 월드 뷰: x ∈ [-5.0, 6.0], y ∈ [0, 5.2](바닥 아래 0.2m 여백 포함). 박스에 균일 스케일로 맞춘다.
 * 박스 비율은 VIEW_W:VIEW_H(11:5.2)와 같게 CSS에서 예약한다(ServeCourt의 aspect). 폰(박스 342px)에서
 * ≈31px/m → 서브 링(SERVE_ZONES, 지름 1.84m) ≈ 57px, 라켓 헤드는 박스 왼쪽에서 ≈23%.
 * 넓힐수록 라켓 뒤 공간·궤적이 보이지만 링이 작아진다(PC 뷰는 x ∈ [-7, 7]).
 */
import { HAND_X, HAND_Y, PULL_MAX, PULL_MIN, autoServeLaunch } from "./physics.ts";

export const VIEW_X0 = -5.0;
export const VIEW_W = 11.0;
export const VIEW_H = 5.2;
export const FLOOR_MARGIN = 0.2;

export interface ServeLayout {
  /** px per meter */
  s: number;
  ox: number;
  oy: number;
}

export function serveLayout(w: number, h: number): ServeLayout {
  const s = Math.min(w / VIEW_W, h / VIEW_H);
  return {
    s,
    ox: w / 2 - (VIEW_X0 + VIEW_W / 2) * s,
    oy: h - FLOOR_MARGIN * s,
  };
}

/**
 * 라켓 포즈. 라켓은 "면의 법선 = 발사 방향 u"로 정의한다. 현은 u에 수직이고, 헤드 중심 C는
 * 접촉점(HAND)에서 u 반대쪽으로 d(m)만큼 물러나 있다. d=0이면 면의 중심이 셔틀(HAND)을 정확히 지난다.
 * 샤프트는 면과 같은 평면(u에 수직)으로 아래쪽에 뻗는다. 순수 TS — 렌더(serveScene)와 테스트가 공유.
 */
/** 당김 중 점선 궤적 미리보기 길이(초). 전체 경로가 아니라 일부만 보여준다. */
export const PREVIEW_SECONDS = 0.55;
export const D_IDLE = 0.3; // 대기 시 면~셔틀 거리
export const D_MAX = 1.0; // 최대 당김 시 면~셔틀 거리
export const FACE_HALF = 0.26; // 면 반길이(면 방향)
export const FACE_THICK = 0.09; // 면 반두께(법선 방향, 옆에서 본 얇은 타원)
export const SHAFT_LEN = 0.9;

export interface RacketPose {
  /** 발사 방향(단위벡터) = 면 법선 */
  ux: number;
  uy: number;
  /** 면 중심이 접촉점에서 물러난 거리(m). 음수면 접촉점을 지나 follow-through */
  d: number;
}

export interface RacketGeom {
  /** 헤드(면 중심) 월드 좌표 */
  cx: number;
  cy: number;
  /** 샤프트 방향(단위, 면과 같은 평면) */
  sx: number;
  sy: number;
}

export function racketGeom(pose: RacketPose): RacketGeom {
  const { ux, uy, d } = pose;
  // u를 -90° 회전(항상 같은 쪽 → 연속). 발사 방향이 오른쪽(ux>0)이면 아래쪽으로 뻗는다.
  const [sx, sy] = [uy, -ux];
  return { cx: HAND_X - ux * d, cy: HAND_Y - uy * d, sx, sy };
}

/** 대기 포즈: 기본(탭) 서브 방향을 향한다. */
export function idlePose(): RacketPose {
  const l = autoServeLaunch();
  const n = Math.hypot(l.vx, l.vy);
  return { ux: l.vx / n, uy: l.vy / n, d: D_IDLE };
}

/** 당김 벡터(월드 m, 손 기준) → 포즈. 방향은 발사 방향(당김의 반대), 거리는 당김 비율. PULL_MIN 미만이면 대기 방향. */
export function pullPose(pullX: number, pullY: number): RacketPose {
  const len = Math.hypot(pullX, pullY);
  const f = Math.min(len, PULL_MAX) / PULL_MAX;
  const idle = idlePose();
  const d = D_IDLE + f * (D_MAX - D_IDLE);
  if (len < PULL_MIN) return { ux: idle.ux, uy: idle.uy, d };
  return { ux: -pullX / len, uy: -pullY / len, d };
}

/** 라켓 헤드 대기 위치(월드 m) — 히트 영역 판정용. */
export function racketHeadWorld(): { x: number; y: number } {
  const g = racketGeom(idlePose());
  return { x: g.cx, y: g.cy };
}

/**
 * 라켓 터치 히트 영역(박스 px). 한 변 ≥ 88px이고 스케일(px/m)에 따라 커진다(half ≥ 0.9m).
 * 중심은 대기 포즈 라켓 헤드와 접촉점(HAND) 사이 근처(≈(HAND_X-0.05, HAND_Y), 면 중심은 HAND 뒤 D_IDLE). 좌측은 박스 안(≥0)으로 밀어
 * 화면 가장자리(iOS 뒤로가기 스와이프)와 겹치지 않게 한다 — 박스는 뷰포트 왼쪽에서 24px 안쪽.
 */
export function racketHitArea(lay: ServeLayout): {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
} {
  const half = Math.max(44, 0.9 * lay.s);
  const cx = lay.ox + (HAND_X - 0.05) * lay.s;
  const cy = lay.oy - HAND_Y * lay.s;
  const x0 = Math.max(cx - half, 0);
  const x1 = Math.max(cx + half, x0 + 2 * half);
  return { x0, x1, y0: cy - half, y1: cy + half };
}
