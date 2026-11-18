"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;
import { courtOutlinePx, type Pt } from "./courtView";

const poly = (pts: Pt[]) => pts.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ");

/**
 * 3D 로딩 중 보이는 코트(바닥·라인·네트·포스트)만의 SVG. 3D 장면과 같은 카메라 상수(courtView)로
 * 투영해 크로스페이드 때 코트가 움직이지 않는다. 박스 크기를 재기 전에는 아무것도 그리지 않는다.
 * 색은 3D 렌더 결과(조명 포함)를 샘플링한 값이다.
 */
export default function CourtLayer({ className = "", hidden = false }: { className?: string; hidden?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      setSize((p) => (p && p.w === r.width && p.h === r.height ? p : { w: r.width, h: r.height }));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const o = size && size.w > 0 && size.h > 0 ? courtOutlinePx(size.w, size.h) : null;

  return (
    <div
      ref={ref}
      aria-hidden
      className={`absolute inset-0 ${className}`}
      // 숨김은 위의 3D 캔버스 페이드인(300ms)이 끝난 뒤에 적용해 중간 프레임에 코트가 비지 않게 한다
      style={{ opacity: hidden ? 0 : 1, transition: hidden ? "opacity 0s linear 300ms" : "none" }}
    >
      {o && size && (
        <svg width={size.w} height={size.h} viewBox={`0 0 ${size.w} ${size.h}`} className="absolute inset-0 block">
          <polygon points={poly(o.floor)} className="fill-[var(--cl-court)]" />
          {o.lines.map((l, i) => (
            <polygon key={i} points={poly(l)} className="fill-[var(--cl-line)]" />
          ))}
          <g stroke="var(--cl-net)" strokeOpacity={0.75} strokeWidth={1}>
            {o.net.map(([a, b], i) => (
              <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
            ))}
          </g>
          {o.posts.map((p, i) => (
            <polygon key={i} points={poly(p)} className="fill-[var(--cl-post)]" />
          ))}
          <polygon points={poly(o.tape)} className="fill-[var(--cl-tape)]" />
        </svg>
      )}
    </div>
  );
}
