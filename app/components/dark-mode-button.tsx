"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // 마운트된 후에만 UI를 렌더링하여 hydration 불일치 방지
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="size-9"></div>; // 마운트되기 전 플레이스홀더
  }

  return (
    <button
      aria-label="Toggle Dark Mode"
      className="rounded-md p-2 focus:opacity-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? (
        <FiSun className="size-5 text-yellow-300" />
      ) : (
        <FiMoon className="size-5 text-gray-600" />
      )}
    </button>
  );
}
