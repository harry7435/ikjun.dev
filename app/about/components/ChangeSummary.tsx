import type { Change } from "@/content/types";

interface Props {
  change: Change;
}

/** 카드와 상세 오버레이가 함께 쓰는 Before → After 요약. */
export default function ChangeSummary({ change }: Props) {
  return (
    <div className="text-sm">
      {change.kind === "metrics" && (
        <dl className="flex flex-wrap gap-x-6 gap-y-2">
          {change.items.map((m) => (
            <div key={m.label}>
              <dd className="font-mono text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
                {m.value.toFixed(m.decimals)}
                {m.suffix}
              </dd>
              <dt className="text-xs text-gray-500 dark:text-gray-400">
                {m.label}
              </dt>
            </div>
          ))}
        </dl>
      )}

      {change.kind === "pairs" && (
        <ul className="space-y-1.5">
          {change.items.map((p) => (
            <li
              key={p.label}
              className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5"
            >
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {p.label}
              </span>
              <span className="text-gray-400 line-through dark:text-gray-500">
                {p.before}
              </span>
              <span aria-hidden className="text-gray-400 dark:text-gray-500">
                →
              </span>
              <span className="sr-only">에서</span>
              <span className="font-bold text-amber-600 dark:text-amber-400">
                {p.after}
              </span>
            </li>
          ))}
        </ul>
      )}

      {change.kind === "text" && (
        <div className="space-y-1">
          <p className="flex gap-2">
            <span className="flex-none font-mono text-xs leading-6 text-gray-400 dark:text-gray-500">
              이전
            </span>
            <span className="text-gray-400 dark:text-gray-500">
              {change.before}
            </span>
          </p>
          <p className="flex gap-2">
            <span className="flex-none font-mono text-xs leading-6 text-amber-600 dark:text-amber-400">
              이후
            </span>
            <span className="font-bold text-amber-600 dark:text-amber-400">
              {change.after}
            </span>
          </p>
        </div>
      )}

      {change.caption && (
        <p className="mt-2 font-mono text-[11px] text-gray-400 dark:text-gray-500">
          {change.caption}
        </p>
      )}
    </div>
  );
}
