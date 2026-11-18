import { certifications, education } from "@/content/credentials";

const CARD =
  "rounded-md border border-gray-200 bg-white/60 p-4 transition-colors hover:border-amber-400/70 dark:border-gray-700 dark:bg-gray-900/40 dark:hover:border-amber-400/60";

interface Item {
  title: string;
  meta: string;
  detail: string;
}

function Group({ label, items }: { label: string; items: Item[] }) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
        {label}
      </h4>
      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.title} className={CARD}>
            <div className="flex items-baseline justify-between gap-2">
              <h5 className="text-sm font-semibold text-gray-900 dark:text-white">
                {item.title}
              </h5>
              <span className="flex-none font-mono text-xs text-gray-500 dark:text-gray-400">
                {item.meta}
              </span>
            </div>
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
              {item.detail}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CredentialsBlock() {
  return (
    <div className="mt-6 space-y-8">
      <Group
        label="교육"
        items={education.map((e) => ({
          title: e.title,
          meta: e.period,
          detail: e.detail,
        }))}
      />
      <Group
        label="자격·수상"
        items={certifications.map((c) => ({
          title: c.title,
          meta: c.date,
          detail: c.detail,
        }))}
      />
    </div>
  );
}
