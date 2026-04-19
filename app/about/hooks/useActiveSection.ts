"use client";

import { useEffect, useState } from "react";

export function useActiveSection(ids: string[]): string {
  const [activeId, setActiveId] = useState<string>(ids[0] ?? "");

  useEffect(() => {
    if (ids.length === 0) return;

    let rafId = 0;

    const compute = () => {
      rafId = 0;

      // 페이지 바닥에 닿았으면 마지막 섹션을 강제 활성화.
      // 짧은 마지막 섹션이 중간 활성 라인에 못 닿아도 올바르게 잡히도록 함.
      const scrollBottom = window.scrollY + window.innerHeight;
      const pageBottom = document.documentElement.scrollHeight;
      if (scrollBottom >= pageBottom - 4) {
        setActiveId(ids[ids.length - 1]);
        return;
      }

      // 섹션 top이 viewport 상단 33% 라인을 넘는 마지막 섹션을 활성으로 본다.
      const activationY = window.scrollY + window.innerHeight * 0.33;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top + window.scrollY;
        if (top <= activationY) current = id;
      }
      setActiveId(current);
    };

    const schedule = () => {
      if (rafId === 0) rafId = requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [ids]);

  return activeId;
}
