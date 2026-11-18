import type { Metric, Social } from "./types";

export const sidebarRole = "프론트엔드 개발자";
export const sidebarIntro =
  "코딩 교육 서비스의 웹·모바일 웹앱·운영 어드민을 2년간 개발하고 운영했습니다.";

export const brandingStatement =
  "기능은 배포했을 때가 아니라 매일 쓰일 때 끝납니다.";

export const shortBio = [
  "**유리프트 Product 팀**에서 코딩 교육 서비스의 웹·모바일 웹앱·운영 어드민을 2년간 개발하고 운영했습니다. 이 중 6개월은 프론트엔드를 혼자 맡아 기획 리뷰부터 개발·배포·운영까지 담당했습니다.",
  "회사 밖에서는 동호회 3곳과 가족이 매일 쓰는 서비스를 직접 만들고 운영하고 있습니다.",
];

// bar = 개선폭 비율. MetricsBand/CountUp에 그대로 전달된다.
export const metrics: Metric[] = [
  { value: 32.8, suffix: "%", decimals: 1, label: "LCP 개선", bar: 0.328 },
  { value: 37.8, suffix: "%", decimals: 1, label: "FCP 개선", bar: 0.378 },
];

export const metricsCaption =
  "홍보 페이지 · 2인 작업 · Lighthouse 모바일 5회 측정(최대·최소 제외 평균)";

export const socials: Social[] = [
  { label: "GitHub", href: "https://github.com/harry7435", icon: "github" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/ik-jun-cho-998292212/",
    icon: "linkedin",
  },
  { label: "Velog", href: "https://velog.io/@harry7435", icon: "velog" },
  { label: "Email", href: "mailto:harry960629@naver.com", icon: "mail" },
];

export const stackGroups = {
  work: [
    "Next.js 14·15 (App Router)",
    "React 18",
    "TypeScript",
    "Tailwind CSS",
    "Zustand",
    "Firebase",
    "Hygraph",
    "Vercel",
    "Mixpanel",
    "Sentry",
    "Claude Code",
  ],
  side: [
    "Next.js 15",
    "React 19",
    "Supabase",
    "TanStack Query",
    "NestJS",
    "Prisma",
    "PostgreSQL",
    "Docker",
    "GitHub Actions",
    "Playwright",
    "Vitest",
  ],
};
