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
      // court: useCourtEnabled 훅의 조건과 동일하게 유지할 것. reduced-motion은 보지 않는다(홈 코트는 reduce여도 표시).
      // serve: useServeCourtEnabled의 SERVE_QUERY와 동일하게 유지할 것 — court의 여집합
      // (hover:hover+pointer:fine이면 court, 그 외는 모두 serve; hover:none+pointer:fine·hover:hover+pointer:coarse 혼합 기기도 serve).
      screens: {
        court: {
          raw: "(hover: hover) and (pointer: fine)",
        },
        serve: {
          raw: "(hover: none), (pointer: coarse), (pointer: none)",
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
