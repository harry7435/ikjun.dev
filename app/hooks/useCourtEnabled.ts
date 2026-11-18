"use client";

import { useEffect, useState } from "react";

/**
 * 홈 PC 3D 코트를 켜도 되는 환경인지 판별한다.
 * = 마우스 등 정밀 포인터 + hover 가능(`(hover: hover) and (pointer: fine)`). reduced-motion과 무관하다.
 * (/about 효과용 useInteractiveEnabled와 달리 reduced-motion을 보지 않는다 — 홈 코트는 reduce여도 표시.)
 * SSR(마운트 전)은 false.
 *
 * 아래 쿼리는 tailwind.config.ts의 `court` 화면(raw)과 반드시 같아야 한다.
 */
const COURT_QUERY = "(hover: hover) and (pointer: fine)";

export function useCourtEnabled() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(COURT_QUERY);
    const update = () => setEnabled(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  return enabled;
}
