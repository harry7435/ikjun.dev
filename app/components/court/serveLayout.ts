/**
 * 모바일 서브 코트의 월드(m) ↔ 박스(px) 변환. 순수 TS — ServeCourt(React)와 serveScene(캔버스)이 공유한다.
 * 월드 뷰: x ∈ [-1.5, 5.9], y ∈ [0, 4.6](바닥 아래 0.2m 여백 포함). 박스에 균일 스케일로 맞춘다.
 * 폰(박스 342px)에서 46px/m → 링(지름 1.4m) ≈ 65px. 좁힐수록 링이 커진다(PC 뷰는 x ∈ [-7, 7]).
 */
import { HAND_X, HAND_Y } from "./physics.ts";

export const VIEW_X0 = -1.5;
export const VIEW_W = 7.4;
export const VIEW_H = 4.6;
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

/** 라켓 지오메트리(월드 m). serveScene이 그리는 값과 같다. */
export const GRIP_X = HAND_X - 0.35;
export const GRIP_Y = HAND_Y - 0.75;
export const RACKET_LEN = 0.9;

/** 라켓 헤드 중심(월드 m): 그립에서 손 방향으로 RACKET_LEN + 0.1. */
export function racketHeadWorld(): { x: number; y: number } {
  const a = Math.atan2(HAND_Y - GRIP_Y, HAND_X - GRIP_X);
  const d = RACKET_LEN + 0.1;
  return { x: GRIP_X + Math.cos(a) * d, y: GRIP_Y + Math.sin(a) * d };
}

/**
 * 라켓 터치 히트 영역(박스 px). 한 변 ≥ 72px이고 스케일(px/m)에 따라 커진다(half ≥ 0.6m).
 * 중심은 라켓 헤드~손(≈(HAND_X-0.05, HAND_Y)). 좌측은 박스 안(≥0)으로 밀어
 * 화면 가장자리(iOS 뒤로가기 스와이프)와 겹치지 않게 한다 — 박스는 뷰포트 왼쪽에서 24px 안쪽.
 */
export function racketHitArea(lay: ServeLayout): {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
} {
  const half = Math.max(36, 0.6 * lay.s);
  const cx = lay.ox + (HAND_X - 0.05) * lay.s;
  const cy = lay.oy - HAND_Y * lay.s;
  const x0 = Math.max(cx - half, 0);
  const x1 = Math.max(cx + half, x0 + 2 * half);
  return { x0, x1, y0: cy - half, y1: cy + half };
}
