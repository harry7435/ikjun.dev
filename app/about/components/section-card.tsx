import { ReactNode } from "react";

interface SectionCardProps {
  title: string;
  icon?: string;
  children: ReactNode;
  className?: string;
}

export function SectionCard({
  title,
  icon,
  children,
  className = "",
}: SectionCardProps) {
  return (
    <div
      className={`rounded-lg border border-stone-300/40 bg-stone-200/60 shadow-sm backdrop-blur-sm transition-[shadow,transform] hover:translate-y-[-2px] hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:shadow-gray-900/30 dark:hover:shadow-lg dark:hover:shadow-gray-700/30 ${className}`}
    >
      {/* 헤더 - sticky 적용 */}
      <div className="top-[68px] z-[1] rounded-lg border-stone-300/40 bg-stone-200/80 px-6 py-4 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
          {icon && `${icon} `}
          {title}
        </h2>
      </div>

      {/* 내용 */}
      <div className="p-6 pt-4 max-md:px-4">{children}</div>
    </div>
  );
}
