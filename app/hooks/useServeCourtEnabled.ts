"use client";

import { useEffect, useState } from "react";

/**
 * 모바일·태블릿 2D 서브 코트를 켜도 되는 환경인지 판별한다.
 * = reduced-motion 아님 AND NOT PC(`(hover: hover) and (pointer: fine)`, Tailwind `court` 화면·useInteractiveEnabled 조건).
 * hover:none+pointer:fine, hover:hover+pointer:coarse 같은 혼합 기기도 PC 조건이 아니므로 서브로 들어온다.
 * SSR(마운트 전)은 false.
 *
 * 아래 쿼리는 tailwind.config.ts의 `serve` 화면(raw)과 반드시 같아야 한다.
 * court 조건(useInteractiveEnabled)과는 서로 겹치지 않는 여집합이어야 한다.
 */
const SERVE_QUERY =
  "(prefers-reduced-motion: no-preference) and (hover: none), (prefers-reduced-motion: no-preference) and (pointer: coarse), (prefers-reduced-motion: no-preference) and (pointer: none)";

export function useServeCourtEnabled() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(SERVE_QUERY);
    const update = () => setEnabled(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  return enabled;
}
