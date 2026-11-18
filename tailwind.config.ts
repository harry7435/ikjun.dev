import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      // court: useInteractiveEnabled 훅의 조건과 동일하게 유지할 것.
      // serve: useServeCourtEnabled의 SERVE_QUERY와 동일하게 유지할 것 — court(+no-preference)의 여집합
      // (hover:hover+pointer:fine이면 court, 그 외 no-preference는 모두 serve; hover:none+pointer:fine·hover:hover+pointer:coarse 혼합 기기도 serve).
      screens: {
        court: {
          raw: "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
        },
        serve: {
          raw: "(prefers-reduced-motion: no-preference) and (hover: none), (prefers-reduced-motion: no-preference) and (pointer: coarse), (prefers-reduced-motion: no-preference) and (pointer: none)",
        },
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      typography: {
        DEFAULT: {
          css: {
            "pre code": {
              backgroundColor: "#2d2d2d",
              color: "#f8f8f2",
              padding: "0.2rem 0.4rem",
              borderRadius: "0.25rem",
            },
            code: {
              backgroundColor: "#2d2d2d",
              color: "#f8f8f2",
              padding: "0.2rem 0.4rem",
              borderRadius: "0.25rem",
            },
          },
        },
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require("@tailwindcss/typography")],
} satisfies Config;
