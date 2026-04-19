"use client";

import { cn } from "@/lib/utils";
import { useActiveSectionContext } from "../context/ActiveSectionContext";

const ITEMS = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "more", label: "More" },
] as const;

export default function SidebarNav() {
  const active = useActiveSectionContext();

  return (
    <nav className="hidden lg:block" aria-label="섹션 내비게이션">
      <ul className="mt-12 space-y-4 text-sm font-medium uppercase tracking-widest">
        {ITEMS.map((item) => {
          const isActive = active === item.id;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="group flex items-center py-1.5 transition-opacity"
              >
                <span
                  className={cn(
                    "mr-4 h-px bg-gray-400 transition-all duration-300 dark:bg-gray-500",
                    isActive
                      ? "w-16 bg-amber-600 dark:bg-amber-400"
                      : "w-8 group-hover:w-12 group-hover:bg-gray-600 dark:group-hover:bg-gray-300"
                  )}
                />
                <span
                  className={cn(
                    "transition-colors",
                    isActive
                      ? "text-amber-700 dark:text-amber-300"
                      : "text-gray-500 group-hover:text-gray-800 dark:text-gray-400 dark:group-hover:text-gray-100"
                  )}
                >
                  {item.label}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
