// About 페이지 상수 및 데이터

export const brandingStatement =
  "사용자 경험을 중점적으로 웹페이지 성능을 최적화하고 유연한 소프트 스킬로 팀에 잘 스며드는 프론트엔드 개발자";

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

export const projects = [
  {
    title: "To Find Crew 🏸",
    description: "배드민턴 크루 관리 서비스",
    period: "2025 ~ 현재",
    links: [
      { href: "https://to-find-crew.vercel.app/", label: "배포 링크" },
    ],
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
    period: "2025 ~ 현재",
    links: [
      { href: "https://2k-jii-money.vercel.app/", label: "배포 링크" },
    ],
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
    period: "2025.03 ~ 현재",
    links: [{ href: "https://choice-eat.vercel.app/", label: "배포 링크" }],
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

export const certifications = [
  {
    title: "🥇 DACON 공모전 1등",
    description: "월간 데이콘 KOSPI 기반 분석 시각화 경진대회",
    date: "2022.11",
    detail: "📈 데이터 분석 및 시각화 역량 인정",
    color: "amber" as const,
  },
  {
    title: "📜 SQLD 자격증",
    description: "한국데이터산업진흥원",
    date: "2022.12",
    detail: "🗃️ SQL 및 데이터베이스 활용 능력 보유",
    color: "sky" as const,
  },
];

export const education = {
  school: "🏛️ 성균관대학교",
  major: "전자전기공학부 학사 (2022.02 졸업)",
};

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
