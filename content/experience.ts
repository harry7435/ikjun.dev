import type { Experience } from "./types";

export const experience: Experience = {
  company: "유리프트 Product 팀",
  role: "Product 엔지니어",
  period: "2024.07 — 2026.07",
  link: { href: "https://www.codingvalley.com/", label: "코딩밸리" },
  summary:
    "AI 코딩밸리(코딩 교육 플랫폼)의 고객용 웹, 모바일 웹앱, 운영 어드민 개발·운영. 프론트엔드 2인 1년 → 1인 6개월 → 2인 6개월",
  highlights: [
    "홍보 페이지 영상·이미지 지연 로딩과 동적 import로 **LCP 32.8% · FCP 37.8% 개선** (2인 작업, Lighthouse 모바일)",
    "웹앱 첫 진입의 서버 요청 **5회 → 3회**, 코스마다 따로 하던 라이선스 조회를 한 번으로 통합",
    "Flutter 앱 웹뷰 화면과 앱 브릿지를 구현해 한국·일본 앱에 적용",
    "LLM 응답 스트리밍 UI를 라이브러리 없이 구현해 AI 실습 코스 런칭",
    "홍보 페이지 섹션 대부분을 CMS로 전환해 마케팅이 배포 없이 콘텐츠 교체",
  ],
  ways: [
    "**1인 체제 6개월**: 기획·디자인 리뷰부터 개발, 배포, 운영 대응까지 담당하며 기술 결정을 직접 내림",
    "**2인 협업**: 코드 리뷰 기반으로 개발하고 Git Flow로 브랜치 운영",
    "**직군 간 협업**: 기획자와 결제·쿠폰 흐름과 분석 이벤트를, 디자이너와 실습 화면 UX를, 앱 개발자와 인증 문제를 함께 풀어감",
  ],
  techStack: [
    "Next.js 14·15",
    "React 18",
    "TypeScript",
    "Tailwind CSS",
    "Zustand",
    "Firebase",
    "Hygraph",
    "Mixpanel",
    "Sentry",
    "Claude Code",
    "MCP",
  ],
};
