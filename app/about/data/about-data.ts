// About 페이지 상수 및 데이터

export const brandingStatement =
  "사용자 경험을 중점적으로 웹페이지 성능을 최적화하고 유연한 소프트 스킬로 팀에 잘 스며드는 프론트엔드 개발자";

export const shortBio = [
  "현재 **유리프트 Product 팀**에서 [코딩밸리](https://www.codingvalley.com/)의 웹·웹뷰·웹앱을 운영하며, 전환율과 LCP 같은 지표를 코드로 움직이는 일을 좋아합니다.",
  "1인 운영과 팀 협업을 오가며 독립적인 의사결정과 코드 리뷰 기반 개발을 익혔고, 최근에는 **Claude Code와 MCP**로 팀의 개발 컨벤션·온보딩·보안 게이트를 자동화하는 일에 몰두하고 있습니다.",
];

// 레거시 호환용. 새 페이지에서는 shortBio를 사용.
export const executiveSummary = `
1인 체제 운영과 팀 협업을 모두 경험하며 독립적 의사결정과 코드 리뷰 기반 개발을 수행했습니다. Claude Code를 활용해 팀 개발 컨벤션을 확립하고 작업 효율을 높이는 데 관심이 많습니다.

현재는 **유리프트** Product 팀에서 프론트엔드 엔지니어로 **코딩밸리** 서비스를 운영하고 있습니다.
`;

export const keyTechStack = [
  "Next.js",
  "TypeScript",
  "Zustand",
  "firebase",
  "hygraph(graphQL)",
  "tailwindcss",
  "Mixpanel",
  "Claude Code CLI",
  "MCP",
];

export interface ExperienceSubsection {
  title: string;
  link?: { href: string; label: string };
  bullets: string[]; // HTML 허용 (강조, 링크)
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  subsections: ExperienceSubsection[];
  techStack?: string[];
}

export const experiences: Experience[] = [
  {
    company: "유리프트 Product 팀",
    role: "Frontend Engineer",
    period: "2024.07 — 현재",
    subsections: [
      {
        title: "코딩밸리 서비스 고도화",
        link: { href: "https://www.codingvalley.com/", label: "코딩밸리" },
        bullets: [
          "무료체험 페이지 구현으로 <strong>사용자 전환율 25% 향상</strong>",
          '마케팅 <a href="https://www.codingvalley.com/ldm/7" target="_blank" rel="noopener noreferrer" class="underline decoration-amber-500/60 underline-offset-2 hover:text-amber-600 dark:hover:text-amber-400">LDM 페이지</a> 10개 이상 신규 개발 및 A/B 테스트 대응',
          "이미지/영상 최적화를 통한 <strong>LCP 3.71초 → 1.14초 단축</strong>",
        ],
      },
      {
        title: "웹뷰 & 웹앱 개발",
        bullets: [
          "네이티브 앱 내 <strong>웹뷰 랜딩 페이지 최적화</strong> 및 웹/웹뷰 구분 아키텍처 설계",
          "네이티브 앱 기능을 <strong>웹앱</strong>으로 전환, 크로스 플랫폼 사용자 경험 통합",
          "가상키보드 표출 시 화면 쉬프트 현상 해결로 <strong>UX 개선</strong>",
        ],
      },
      {
        title: "AI/LLM 기능 개발",
        bullets: [
          "LLM 실습 코스를 위한 <strong>스트리밍 응답 UI</strong> 구현 및 최적화",
          "신규 백엔드 API 연동 및 실시간 응답 처리 로직 개발",
        ],
      },
      {
        title: "데이터 트래킹 & 분석 환경 구축",
        bullets: [
          "<strong>Mixpanel</strong> 기반 웹/웹앱 전반 사용자 활동 트래킹 환경 구현",
          "마케팅 팀에서 활용 가능한 데이터 분석 기반 마련",
        ],
      },
      {
        title: "개발 문화 & 프로세스 개선",
        bullets: [
          "팀원과 <strong>Claude Code</strong> 커맨드/스킬/에이전트 활용한 개발 컨벤션 확립",
          "신규 개발자 온보딩을 위한 AI 도구 활용 가이드 문서화로 <strong>작업 효율 향상</strong>",
        ],
      },
      {
        title: "AI 코딩 도구(Claude Code) 개발 환경 구축",
        bullets: [
          "모놀리식 CLAUDE.md → <strong>모듈형 13개 서브 문서</strong> 시스템 재설계로 토큰 소비 70% 절감",
          "PreToolUse 훅 기반 <strong>민감정보 유출 방지 보안 게이트</strong> 구축",
          "<strong>빌더/리뷰어 2-에이전트 분리 아키텍처</strong> 설계로 코드 품질 구조적 보장",
          "4개 커스텀 스킬 + <strong>14개+ 슬래시 커맨드</strong> 구축 (PR, CMS, 디자인, SEO 워크플로우 자동화)",
          "<strong>Figma MCP, Hygraph MCP</strong> 연동으로 디자인·CMS 데이터 AI 직접 접근 환경 구축",
        ],
      },
    ],
    techStack: [
      "Next.js",
      "TypeScript",
      "tailwindcss",
      "firebase",
      "hygraph(graphQL)",
      "playwright",
      "Mixpanel",
      "Vercel",
      "Claude Code CLI",
      "MCP",
    ],
  },
  {
    company: "프로그래머스 프론트엔드 데브코스",
    role: "Team Lead × 3",
    period: "2023.09 — 2024.03",
    subsections: [
      {
        title: "팀 프로젝트 리더십",
        bullets: [
          "<strong>3개의 팀 프로젝트에서 팀장 역할 수행</strong> (AlgoBaro, Styled, Notion 클로닝)",
          "Git Flow 기반 브랜치 전략 수립으로 팀 개발 프로세스 표준화",
          "코드 리뷰 문화 정착 및 팀 협업 효율성 향상",
        ],
      },
      {
        title: "기술 스터디 및 지식 공유",
        bullets: [
          "TypeScript 스터디 진행 및 딥다이브 발표",
          "&ldquo;개발관계론&rdquo; 발표를 통한 팀 커뮤니케이션 개선",
          "UI 컴포넌트 라이브러리 개발 및 문서화",
        ],
      },
    ],
  },
];

export interface Project {
  title: string;
  description: string;
  period: string;
  image?: string; // /projects/*.png 경로. 없으면 이니셜 폴백.
  links: { href: string; label: string }[];
  whyContent: string;
  howContent: string[]; // HTML 허용
  resultContent: string[]; // HTML 허용
  techStack: string[];
}

export const projects: Project[] = [
  {
    title: "To Find Crew",
    description: "배드민턴 크루 관리 서비스",
    period: "2025 — 현재",
    image: undefined,
    links: [{ href: "https://to-find-crew.vercel.app/", label: "Live" }],
    whyContent:
      "배드민턴 동호회에서 매번 팀 배분, 코트 배정, 참가자 관리를 수기로 하면서 시간이 낭비되고 형평성 문제가 발생했습니다.",
    howContent: [
      "<strong>크루 시스템</strong>: 관심사 기반 크루 생성, 역할(OWNER/ADMIN/MEMBER) 기반 권한 관리",
      "<strong>게임 매니저</strong>: 선수 등록 + 실력별 랜덤 팀 뽑기 + 코트 배정 자동화",
      "<strong>게스트 참가 지원</strong>: 회원가입 없이 이름/성별/실력으로 즉시 참여 가능",
      "<strong>소셜 로그인 & PWA</strong>: Google, Kakao 인증 지원 및 모바일 앱 설치 지원",
    ],
    resultContent: [
      "<strong>실제 배드민턴 동호회에서 활용 중</strong>",
      "<strong>Supabase RLS</strong> 기반 역할별 접근 제어로 데이터 보안 확보",
    ],
    techStack: [
      "Next.js 15",
      "TypeScript",
      "Supabase",
      "Tailwind CSS v4",
      "shadcn/ui",
      "React Hook Form",
      "Zod",
      "PWA",
    ],
  },
  {
    title: "우리집 가계부",
    description: "가족 공유 가계부 웹 앱",
    period: "2025 — 현재",
    image: undefined,
    links: [{ href: "https://2k-jii-money.vercel.app/", label: "Live" }],
    whyContent:
      "기존 가계부 앱들이 개인 중심이라 가족 단위로 수입/지출을 함께 관리하고 공유하기 어려웠습니다.",
    howContent: [
      "<strong>가족 공유 시스템</strong>: 가족 생성 및 초대 코드/QR 기반 참여로 가족 구성원 간 실시간 가계부 공유",
      "<strong>3단계 카테고리 구조</strong>: 대분류/중분류/소분류로 체계적인 수입·지출 분류",
      "<strong>예산 관리</strong>: 월별 예산 설정 및 진행률 시각화",
      "<strong>대시보드</strong>: recharts 기반 월별 수입/지출 통계 차트",
    ],
    resultContent: [
      "<strong>실제 가족과 함께 일상적으로 사용 중</strong>인 서비스",
      "Zustand persist + TanStack React Query로 <strong>오프라인 대응 및 데이터 캐싱 최적화</strong>",
    ],
    techStack: [
      "Next.js 16",
      "TypeScript",
      "Supabase",
      "Tailwind CSS v4",
      "Zustand",
      "TanStack React Query",
      "recharts",
    ],
  },
  {
    title: "Choice Eat",
    description: "위치 기반 메뉴 선택 서비스",
    period: "2025.03 — 현재",
    image: undefined,
    links: [{ href: "https://choice-eat.vercel.app/", label: "Live" }],
    whyContent:
      '매일 반복되는 "뭐 먹지?" 고민과 선택 장애로 인한 시간 소모, 그리고 현재 위치 주변의 맛집 정보를 찾기 어려운 문제가 있었습니다.',
    howContent: [
      "<strong>위치 기반 서비스</strong>: 사용자의 현재 위치를 기반으로 주변 음식점 검색",
      "<strong>랜덤 추첨 시스템</strong>: 선택 장애 해결을 위한 메뉴 및 음식점 랜덤 추천",
      "<strong>직관적인 UI/UX</strong>: 간단한 클릭만으로 메뉴를 결정할 수 있는 사용자 친화적 인터페이스",
      "<strong>실시간 검색</strong>: 카테고리별 음식점 검색 및 필터링 기능",
    ],
    resultContent: [
      "<strong>사용자 결정 시간 단축</strong> - 복잡한 고민 없이 즉시 메뉴 결정 가능",
      "<strong>위치 기반 맞춤 추천</strong>으로 접근성 높은 맛집 발견",
      "<strong>반응형 웹 디자인</strong>으로 모바일/데스크톱 환경 모두 지원",
    ],
    techStack: [
      "Next.js",
      "TypeScript",
      "Geolocation API",
      "Naver Map API",
      "TailwindCSS",
    ],
  },
];

export interface Certification {
  title: string;
  description: string;
  date: string;
  detail: string;
}

export const certifications: Certification[] = [
  {
    title: "DACON 공모전 1등",
    description: "월간 데이콘 KOSPI 기반 분석 시각화 경진대회",
    date: "2022.11",
    detail: "데이터 분석 및 시각화 역량 인정",
  },
  {
    title: "SQLD 자격증",
    description: "한국데이터산업진흥원",
    date: "2022.12",
    detail: "SQL 및 데이터베이스 활용 능력 보유",
  },
];

export const education = {
  school: "성균관대학교",
  major: "전자전기공학부 학사",
  period: "2022.02 졸업",
};

export interface Social {
  label: string;
  href: string;
  icon: "github" | "linkedin" | "velog" | "mail";
}

export const socials: Social[] = [
  {
    label: "GitHub",
    href: "https://github.com/harry7435",
    icon: "github",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/ik-jun-cho-998292212/",
    icon: "linkedin",
  },
  {
    label: "Velog",
    href: "https://velog.io/@harry7435",
    icon: "velog",
  },
  {
    label: "Email",
    href: "mailto:harry960629@naver.com",
    icon: "mail",
  },
];

// 레거시 호환용
export const contacts = [
  {
    href: "https://github.com/harry7435",
    label: "GitHub",
    icon: "FaGithub",
  },
  {
    href: "mailto:harry960629@naver.com",
    label: "Email",
    icon: "Mail",
  },
];
