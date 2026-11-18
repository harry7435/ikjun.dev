import { useEffect, type Dispatch, type RefObject } from "react";
import type { PopoverAction, PopoverState } from "./popover";

/** 팝오버가 열려 있는 동안 6초 TTL tick·Esc·바깥 포인터 다운으로 닫는다(popover.ts는 순수 유지). */
export function usePopoverDismiss(
  popover: PopoverState | null,
  dispatch: Dispatch<PopoverAction>,
  popoverRef: RefObject<HTMLDivElement | null>
) {
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
  }, [popover, dispatch, popoverRef]);
}
