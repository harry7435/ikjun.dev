/**
 * 셔틀 명중 → "이동할까요?" 팝오버 상태(순수). 자동 이동하지 않고 사용자가 고른다.
 * 열림 중 추가 명중(다른/같은 영역)은 무시해 처음 명중한 영역에 고정, 6초 무응답이면 닫힘.
 */
import type { ZoneId } from "./physics";

export const POPOVER_TTL_MS = 6000;

export interface PopoverState {
  zone: ZoneId;
  openedAt: number;
}

export type PopoverAction =
  | { type: "hit"; zone: ZoneId; now: number }
  | { type: "dismiss" }
  | { type: "tick"; now: number };

export function popoverReducer(
  state: PopoverState | null,
  action: PopoverAction
): PopoverState | null {
  switch (action.type) {
    case "hit":
      if (state) return state;
      return { zone: action.zone, openedAt: action.now };
    case "dismiss":
      return null;
    case "tick":
      if (state && action.now - state.openedAt >= POPOVER_TTL_MS) return null;
      return state;
  }
}
