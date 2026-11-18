"use client";

import { useEffect, useState } from "react";

/**
 * 화려한 인터랙션(3D 틸트, 파티클, 자석 효과 등)을 켜도 되는 환경인지 판별한다.
 * - 마우스 등 정밀 포인터 + hover 가능한 기기여야 하고
 * - 사용자가 reduced-motion을 요청하지 않았어야 한다.
 * SSR/모바일/터치/reduced-motion 환경에서는 false → 정적 폴백.
 */
export function useInteractiveEnabled() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const pointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const update = () => setEnabled(pointer.matches && !reduced.matches);
    update();

    pointer.addEventListener("change", update);
    reduced.addEventListener("change", update);
    return () => {
      pointer.removeEventListener("change", update);
      reduced.removeEventListener("change", update);
    };
  }, []);

  return enabled;
}
