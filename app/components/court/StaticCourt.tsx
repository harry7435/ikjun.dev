import Link from "next/link";
import { ZONES } from "./physics";

/**
 * 히어로 정적 폴백(SVG). 게이트 false·3D 로딩 중·3D 실패 시 표시된다.
 * 월드 좌표(m) → viewBox: x ∈ [-7.2, 7.2], y ∈ [0, 6] (y 반전).
 * About/Blog 영역은 실제 링크라 터치로도 이동할 수 있다.
 */
const VX = (x: number) => (x + 7.2) * 100;
const VY = (y: number) => (6 - y) * 100;

export default function StaticCourt() {
  return (
    <svg
      viewBox="0 0 1440 600"
      preserveAspectRatio="xMidYMax meet"
      className="absolute inset-0 size-full text-stone-700 dark:text-gray-300"
    >
      {/* 바닥 */}
      <line
        x1={VX(-6.7)}
        y1={VY(0)}
        x2={VX(6.7)}
        y2={VY(0)}
        stroke="currentColor"
        strokeOpacity={0.35}
        strokeWidth={4}
      />
      {/* 네트 */}
      <line
        x1={VX(0)}
        y1={VY(0)}
        x2={VX(0)}
        y2={VY(1.55)}
        stroke="currentColor"
        strokeOpacity={0.5}
        strokeWidth={3}
      />
      <rect
        x={VX(0) - 4}
        y={VY(1.55)}
        width={8}
        height={VY(0.7) - VY(1.55)}
        fill="currentColor"
        fillOpacity={0.12}
      />
      {/* 클리어 궤적(점선) */}
      <path
        d={`M ${VX(5.7)} ${VY(1.5)} Q ${VX(1.2)} ${VY(7.2)} ${VX(-3.1)} ${VY(0.05)}`}
        fill="none"
        className="stroke-amber-600 dark:stroke-amber-500"
        strokeWidth={3}
        strokeDasharray="10 12"
        strokeOpacity={0.7}
      />
      {/* 셔틀 (궤적 하강부, 코르크가 진행 방향) */}
      <g transform={`translate(${VX(-1.9)} ${VY(2.6)}) rotate(118)`}>
        <path
          d="M -4 0 L -30 -26 L 30 -26 L 4 0 Z"
          fill="#fff"
          stroke="currentColor"
          strokeOpacity={0.5}
        />
        <circle r={9} fill="#e9d6a8" />
      </g>
      {/* 영역 링크 */}
      {ZONES.map((z) => (
        <Link
          key={z.id}
          href={z.href}
          aria-label={`${z.label} 페이지로 이동`}
          className="group outline-none"
        >
          <circle
            cx={VX(z.cx)}
            cy={VY(z.cy)}
            r={z.r * 100}
            className="fill-amber-600/15 stroke-amber-600 transition-colors group-hover:fill-amber-600/30 group-focus-visible:stroke-[6] dark:fill-amber-500/15 dark:stroke-amber-500"
            strokeWidth={3}
          />
          <text
            x={VX(z.cx)}
            y={VY(z.cy) + 8}
            textAnchor="middle"
            className="fill-amber-700 text-[26px] font-extrabold dark:fill-amber-400"
          >
            {z.label}
          </text>
        </Link>
      ))}
    </svg>
  );
}
