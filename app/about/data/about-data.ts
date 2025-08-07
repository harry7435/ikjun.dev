// About 페이지 상수 및 데이터

export const brandingStatement =
  "사용자 경험을 중점적으로 웹페이지 성능을 최적화하고 유연한 소프트 스킬로 팀에 잘 스며드는 프론트엔드 개발자";

export const executiveSummary = `
**팀**과 함께 성장하는 개발자 **조익준**입니다.

UI/UX를 고려한 개발을 중요하게 생각하며, React, Next.js, TypeScript를 중심으로 성능 최적화와 디자인 시스템 구축에 관심이 많습니다.

현재는 **유리프트** Product 팀에서 프론트엔드 엔지니어로 **코딩밸리** 서비스를 운영하고 있습니다.

이전에는 **프로그래머스 프론트엔드 데브코스** 교육을 수료하며 3번의 팀 프로젝트에서 팀장 역할을 수행했습니다.

개발자의 커뮤니케이션에 대해 고민하며 "**개발관계론**"이라는 주제로 발표를 해본 경험이 있습니다.
`;

export const keyTechStack = [
  "Next.js",
  "TypeScript",
  "Zustand",
  "firebase",
  "hygraph(graphQL)",
  "tailwindcss",
];

export const projects = [
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
  {
    title: "AlgoBaro",
    description: "코딩 테스트 학습 플랫폼",
    period: "2023.12 ~ 2024.02",
    links: [
      { href: "https://algobaro.vercel.app/", label: "배포 링크" },
      { href: "https://github.com/1e5i-Shark/algobaro-fe", label: "GitHub" },
    ],
    whyContent:
      "기존 코딩 테스트 플랫폼들이 개별 학습에만 집중하여, 팀원들과 함께 문제를 해결하고 코드 리뷰를 통해 학습하는 환경이 부족",
    howContent: [
      "<strong>실시간 협업</strong>: WebSocket 기반 그룹 스터디 채팅 시스템 구현",
      "<strong>코드 리뷰</strong>: 팀원 간 코드 공유 및 피드백 기능 개발",
      "<strong>개발 효율성</strong>: 공용 API 인스턴스로 팀 개발 속도 40% 향상",
      "<strong>사용자 경험</strong>: Code Mirror 기반 실시간 코드 에디터 구현",
    ],
    resultContent: [
      "<strong>팀 개발 효율성 40% 향상</strong> (공용 API 설정으로)",
      "<strong>실시간 협업 기능</strong>으로 사용자 참여도 증대",
      "<strong>반응형 디자인</strong>으로 모바일 접근성 100% 지원",
    ],
    techStack: [
      "React",
      "TypeScript",
      "React Query",
      "WebSocket",
      "Code Mirror",
      "Zustand",
      "Styled-Components",
    ],
  },
  {
    title: "Styled",
    description: "패션 SNS 서비스",
    period: "2023.10 ~ 2023.12",
    links: [
      { href: "https://styled-rho.vercel.app/", label: "배포 링크" },
      {
        href: "https://github.com/prgrms-fe-devcourse/FEDC5_STYLED_sehee",
        label: "GitHub",
      },
    ],
    whyContent:
      "기존 패션 플랫폼들의 느린 로딩 속도와 단조로운 UI로 인해 사용자 이탈률이 높았습니다. 특히 이미지 중심의 SNS에서 최적화된 사용자 경험이 필요",
    howContent: [
      "<strong>성능 최적화</strong>: React Query 캐싱으로 데이터 로딩 최적화",
      "<strong>UX 개선</strong>: 스켈레톤 UI와 무한 스크롤로 매끄러운 경험 제공",
      "<strong>이미지 최적화</strong>: 지연 로딩과 미리보기로 로딩 속도 개선",
      "<strong>반응형 설계</strong>: 모바일 퍼스트 접근으로 다양한 기기 지원",
    ],
    resultContent: [
      "<strong>페이지 로딩 속도 60% 향상</strong> (React Query 캐싱)",
      "<strong>사용자 경험 개선</strong>으로 체류 시간 증가",
      "<strong>모바일 최적화</strong>로 크로스 플랫폼 사용성 확보",
    ],
    techStack: [
      "React",
      "TypeScript",
      "React Query",
      "Styled-Components",
      "Zustand",
      "Infinite Scroll",
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
