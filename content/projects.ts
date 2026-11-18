import type { Project } from "./types";

// 표시 순서 = 배열 순서. featured 항목이 먼저 보이고 나머지는 "더 보기"로 접힌다.
export const workProjects: Project[] = [
  {
    slug: "promo-page-loading",
    group: "work",
    tag: "성능",
    title: "홍보 페이지 로딩 개선",
    note: "2인 작업",
    featured: true,
    source: "경력기술서 1-a",
    situation: [
      "경영진·마케팅·QA에서 모바일 홍보 페이지의 초기 로딩과 영상·이미지 로딩이 느리다는 피드백",
      "홍보 페이지 LCP가 Core Web Vitals 기준에 미달, FAB 렌더링 시 레이아웃 시프트 발생",
    ],
    actions: [
      "홈·홍보 페이지의 동영상을 뷰포트에 들어올 때 불러오도록 지연 로딩하고, 해당 컴포넌트를 동적 import로 분리해 초기 번들에서 제외",
      "Next.js Image와 WebP를 적용하고, 첫 화면의 핵심 이미지는 priority로 미리 로드",
      "FAB가 그려지기 전 스크롤을 막아 레이아웃 시프트를 없애고, 불필요한 리렌더링 제거",
      "측정 방식(Lighthouse 모바일 5회, 최대·최소 제외 평균)은 동료가 마련",
    ],
    result: "LCP 32.8% · FCP 37.8% 개선",
    change: {
      kind: "metrics",
      items: [
        { value: 32.8, suffix: "%", decimals: 1, label: "LCP 개선" },
        { value: 37.8, suffix: "%", decimals: 1, label: "FCP 개선" },
      ],
      caption: "Lighthouse 모바일 · 2인 작업",
    },
  },
  {
    slug: "webapp-first-entry",
    group: "work",
    tag: "성능",
    title: "웹앱 첫 진입 개선",
    featured: true,
    demos: ["splash-roundtrip", "parallel-fetch"],
    source: "경력기술서 1-b",
    situation: [
      "웹앱 스플래시에서 인증을 확인하고 홈 화면이 뜨기까지 로딩 화면이 오래 보이는 문제",
      "스플래시(클라이언트 컴포넌트)가 서버 액션 5개를 순서대로 기다려, 앞 요청이 끝나야 다음 요청이 시작됨. 그중 로그인 확인과 토큰 발급은 따로 서버를 오가며 토큰 검증도 두 번 일어남",
      "홈에서 수강·청강·즐겨찾기 코스마다 라이선스를 따로 조회해, 코스가 많을수록 요청이 늘어나고 상단 메뉴(GNB)까지 함께 늦게 그려짐",
    ],
    actions: [
      "로그인 확인과 토큰 발급을 한 요청으로 합치고(토큰 검증 2회 → 1회), 데모 쿠키 설정을 페이지 이동 요청 안으로 합치고, 광고 집계용 Meta 이벤트는 응답을 기다리지 않게 바꿔, 서버 요청 5회 → 3회, 사용자가 기다리는 요청 5회 → 2회로 축소",
      "이전 개발자가 남겨둔 임시 2초 대기 코드를 제거하고, 인증 실패 시 안내 메시지 추가",
      "코스마다 하던 라이선스 조회를 한 번의 일괄 조회로 바꾸고, 서로 독립적인 조회 3개(내 코스·전체 코스·즐겨찾기)를 Next.js 서버 함수에서 Promise.all로 병렬 처리",
      "즐겨찾기 여부도 클라이언트에서 따로 확인하지 않고, 서버에서 함께 내려준 값을 쓰도록 개선",
      "Suspense로 상단 메뉴를 먼저 그리고, 본문 데이터는 준비되는 대로 채우도록 구성",
    ],
    result:
      "스플래시에서 홈까지 로딩 화면이 보이는 시간 단축 (QA 확인, 별도 정량 측정은 하지 않음)",
    change: {
      kind: "pairs",
      items: [
        { label: "사용자가 기다리는 요청", before: "5회", after: "2회" },
        { label: "서버 요청", before: "5회", after: "3회" },
        { label: "토큰 검증", before: "2회", after: "1회" },
        { label: "라이선스 조회", before: "코스마다", after: "한 번" },
      ],
    },
  },
  {
    slug: "llm-streaming",
    group: "work",
    tag: "AI",
    title: "AI 실습 LLM 스트리밍",
    note: "백엔드와 협업",
    featured: true,
    demos: ["sse-stream"],
    source: "경력기술서 3",
    situation: [
      "AI 실습 코스에서 학습자가 만든 프롬프트로 LLM 결과를 받아 보여주는 화면이 필요했고, 응답이 길면 끝날 때까지 빈 화면을 보고 있어야 했음",
      "모바일 웹앱에서 실습 중 가상키보드가 올라오면 스크롤과 레이아웃이 깨짐",
    ],
    actions: [
      "라이브러리 없이 fetch와 ReadableStream reader로 SSE 응답을 읽어, 생성되는 대로 화면에 출력",
      "start·chunk·end·error 네 가지 이벤트 형식을 백엔드와 맞춰 정의",
      "TextDecoder를 stream 모드로 써서 청크 경계에서 한글이 깨지지 않도록 처리",
      "출력 중지 시 AbortController로 연결을 끊고, 새 요청을 시작하면 이전 요청을 먼저 중단",
      "스트리밍 상태를 결과 영역 컴포넌트에만 두어, 응답 조각(chunk)이 올 때마다 페이지 전체가 다시 그려지지 않게 구성",
      "visualViewport API로 실제 보이는 영역을 기준으로 레이아웃을 맞추고, 지원이 다른 환경은 focusin 이벤트로 보완",
      "텍스트 → 파일·이미지 멀티모달 → 이미지 생성으로 이어진 기능 확장에 맞춰 기획자·디자이너와 실습 화면과 흐름 설계",
    ],
    result:
      "실시간 응답 기반 AI 실습 코스 런칭·안정 운영, iOS·Android 모바일 실습 지원",
    change: {
      kind: "text",
      before: "끝날 때까지 빈 화면",
      after: "생성되는 대로 화면에 출력",
    },
  },
  {
    slug: "web-to-webapp-auth",
    group: "work",
    tag: "인증",
    title: "웹 → 웹앱 인증 방식 변경",
    featured: true,
    demos: ["token-handoff"],
    source: "경력기술서 2-b",
    situation: [
      "웹과 웹앱이 서브도메인 쿠키(SameSite=Lax)를 공유해 인증했는데, 웹앱에서 쿠키를 간헐적으로 읽지 못해 로그인한 사용자가 익명(무료체험) 상태로 접속됨",
      "웹 탭에서만 로그아웃하면 웹앱 쪽 쿠키가 지워지지 않아, 계정을 바꿔도 웹앱에는 이전 계정으로 접속되는 문제",
    ],
    actions: [
      "쿠키 공유에 의존하지 않도록, 웹앱으로 이동할 때마다 토큰을 쿼리스트링으로 명시 전달",
      "웹앱 스플래시에서 인증 직후 router.replace로 주소에서 토큰을 지워 브라우저 기록에 남지 않게 처리",
    ],
    result:
      "계정 불일치·이전 계정 잔존 문제 해소, 이후 같은 유형의 인증 문의 재발 없음",
    change: {
      kind: "text",
      before: "서브도메인 쿠키 공유",
      after: "이동할 때마다 토큰을 명시 전달",
    },
  },
  {
    slug: "flutter-webview",
    group: "work",
    tag: "앱 웹뷰",
    title: "Flutter 앱 웹뷰 연동",
    note: "앱 개발자와 협업",
    source: "경력기술서 2-a",
    situation: [
      "앱에서 웹의 일부 화면을 그대로 써야 했고, 앱 로그인 후 웹뷰에 들어가면 인증이 간헐적으로 실패",
    ],
    actions: [
      "한국 앱 웹뷰 화면 개발: 앱 내 랜딩, 6대 특징 소개 페이지, 상품 목록, 코스 상세, 마이페이지(결제 상세·쿠폰 상세·결제 내역)",
      "일본 출시 앱에 상품 목록과 특징 소개 페이지 적용 (번역 문구는 사내에서 제공)",
      "앱 브릿지로 헤더 타이틀 변경과 네이티브 비디오 플레이어 연동의 웹 쪽 구현",
      "인증 실패 원인 추적: 웹 인증 로직을 먼저 점검해 웹 쪽 원인을 배제하고, dev 환경 웹뷰에 디버깅 콘솔을 붙여 배포한 뒤 앱 개발자와 함께 재현",
    ],
    result:
      "원인을 앱 쪽 토큰 갱신 누락으로 규명해 해결, 핵심 화면을 웹뷰로 전환",
    change: {
      kind: "text",
      before: "앱 로그인 후 웹뷰 인증이 간헐적으로 실패",
      after: "원인을 앱 쪽 토큰 갱신 누락으로 규명해 해결",
    },
  },
  {
    slug: "payment-coupon-analytics",
    group: "work",
    tag: "결제·분석",
    title: "결제·쿠폰·사용자 행동 분석",
    source: "경력기술서 4",
    situation: [
      "결제 상세 페이지 이탈이 많음",
      "쿠폰 모달·FAB·배너가 각자 쿠폰 상태를 가지고 있어 서로 어긋나던 문제",
      "마케팅팀이 광고 성과를 측정할 방법이 없음",
    ],
    actions: [
      "popstate와 히스토리 상태로 뒤로가기를 감지해 이탈 직전에 확인 모달을 띄움",
      "일반 결제와 흐름이 다른 평생교육이용권 결제를 진입 라우트 분기부터 폼·모달까지 전용 페이지로 신규 구축하되, 결제 로직은 기존 결제 페이지 것을 그대로 재사용해 코드 중복을 줄임",
      "Zustand 전역 스토어 하나로 모아 세 곳을 동기화하고, 로그인하지 않은 사용자가 쿠폰을 받아두면 로그인 직후 자동으로 적용되는 흐름 구현",
      "Mixpanel을 새로 도입하고, SPA 특성상 페이지뷰가 첫 진입에만 기록되던 문제를 초기 로드와 라우팅 이벤트를 나눠 해결",
      "기획자와 논의해 쿠폰 클릭·상품 비교표 등 구매 흐름 이벤트를 정의·구현하고, 마케팅 요청으로 UTM 추적 추가",
    ],
    result:
      "채널별 광고 성과와 무료체험 → 결제 퍼널 확인 가능, 마케팅 성과 보고와 경영진 의사결정 회의에 활용",
    change: {
      kind: "pairs",
      items: [
        {
          label: "쿠폰 상태",
          before: "모달·FAB·배너 각자",
          after: "스토어 하나",
        },
        {
          label: "페이지뷰 기록",
          before: "첫 진입에만",
          after: "초기 로드·라우팅 분리",
        },
      ],
    },
  },
  {
    slug: "cms-admin",
    group: "work",
    tag: "운영",
    title: "홍보 페이지 CMS 전환 · 운영 어드민",
    note: "제안·설계",
    source: "경력기술서 5",
    situation: [
      "마케팅팀이 A/B 테스트를 위해 라우트별로 홍보 페이지를 나눠 달라고 요청해 비슷한 섹션이 페이지마다 반복됐고, 광고 집행에 맞춰 내용을 자주 바꿀 때마다 코드 수정과 배포가 필요했음",
    ],
    actions: [
      "이미 쓰고 있던 Hygraph를 홍보 페이지까지 넓혀 CMS로 관리하자고 제안",
      "쿠폰 이미지·코스북·무료체험·이벤트 배너 등 섹션 대부분을 랜딩 버전에 맞게 갈아끼울 수 있는 GraphQL 스키마 설계",
      "스테이징·dev에서도 미리 확인하도록 CMS 호출 API에서 환경을 구분",
      "라우트별로 나뉘어 있던 A/B 테스트용 홍보 페이지도, CMS에서 버전별 콘텐츠만 다르게 설정하면 바뀌도록 정리",
      "운영 어드민: 코스 수강 통계 화면, 매출 이력 통계·시각화, 주문·배송 관리 페이지(카카오 배송 알림톡 발송 기능을 Next.js 서버 쪽에 구현, 이후 백엔드로 이전)",
    ],
    result: "마케팅·운영팀이 개발 배포 없이 콘텐츠를 직접 교체",
    change: {
      kind: "text",
      before: "바꿀 때마다 코드 수정과 배포",
      after: "개발 배포 없이 콘텐츠를 직접 교체",
    },
  },
  {
    slug: "nextjs-15-migration",
    group: "work",
    tag: "마이그레이션",
    title: "Next.js 14 → 15 마이그레이션",
    source: "경력기술서 6",
    situation: [
      "React 19의 성능 개선과 Vercel 관련 보안 패치를 받기 위해 운영 중인 웹·웹앱의 업그레이드가 필요했음",
    ],
    actions: [
      "비동기로 바뀐 params·cookies 등 요청 API의 사용처를 찾아 일괄 수정",
      "fetch 캐싱 기본값이 바뀐 것에 맞춰 데이터 조회마다 캐시 동작을 다시 확인",
      "React 19 업그레이드에 따른 라이브러리 호환성 점검",
      "변경 지점 탐색과 반복 수정은 Claude Code를 활용해 빠르게 진행",
    ],
    result: "웹·웹앱을 서비스 장애 없이 Next.js 15로 전환 (2026년 초)",
    change: {
      kind: "pairs",
      items: [{ label: "Next.js", before: "14", after: "15" }],
      caption: "서비스 장애 없이 · 2026년 초",
    },
  },
  {
    slug: "claude-code-team",
    group: "work",
    tag: "AI 개발 환경",
    title: "Claude Code 팀 세팅",
    source: "경력기술서 7",
    situation: [
      "700줄이 넘는 단일 컨텍스트 문서(CLAUDE.md) 때문에 토큰 낭비가 컸고, 에이전트가 환경변수 등 민감정보를 코드에 하드코딩할 위험이 있었음",
      "PR 작성·CMS 연동·커밋 정리 같은 반복 작업에 매번 수동 개입이 필요",
    ],
    actions: [
      "컨텍스트 문서를 인덱스와 13개 서브 문서로 나눠 작업에 필요한 문서만 읽도록 구성",
      "PreToolUse 훅으로 민감정보 패턴을 감지해 하드코딩을 차단",
      "빌더·리뷰어 두 에이전트로 역할을 나눠, 같은 에이전트가 자기 결과를 검토하는 편향을 줄임",
      "PR 초안·커밋 분할·CMS 연동 등 반복 작업을 커스텀 커맨드로 만들고, Figma·Hygraph MCP로 디자인과 스키마를 직접 조회",
      "문서 구조와 사용 컨벤션을 온보딩 가이드로 정리해 동료와 백엔드 담당자에게 공유",
    ],
    result: "민감정보 노출 조기 차단, 팀 전체가 같은 AI 개발 환경을 사용",
    change: {
      kind: "pairs",
      items: [
        {
          label: "컨텍스트 문서",
          before: "700줄+ 단일",
          after: "인덱스 + 13개",
        },
      ],
    },
  },
];

// 표시 순서: To Find Crew, 우리집 가계부, choice-eat (이력서 순서). lotto-time은 보류.
export const sideProjects: Project[] = [
  {
    slug: "to-find-crew",
    group: "side",
    title: "To Find Crew",
    source: "원장 사이드 프로젝트 / 이력서",
    users: "배드민턴 동호회 3곳에서 사용 · 모임당 회원 50~100명",
    summary: "배드민턴 동호회 코트 배정·참가 인원 관리",
    wide: true,
    screenshots: [
      {
        src: "/projects/to-find-crew-team-draw.png",
        alt: "To Find Crew 팀 뽑기 화면 (체험 모드, 예시 이름)",
      },
      {
        src: "/projects/to-find-crew-players.png",
        alt: "To Find Crew 참석 인원 화면 (체험 모드, 예시 이름)",
      },
    ],
    cardPoints: [
      "코트 배정 시 Web Push 알림, QR 코드로 모임 초대",
      "운영진 오픈 카톡 피드백 → 수정·배포 루프 직접 운영",
    ],
    change: { kind: "text", before: "화이트보드·자석", after: "태블릿·모바일" },
    situation: ["화이트보드로 하던 코트·인원 배정"],
    actions: [
      "코트 배정 시 Web Push 알림, QR 코드로 모임 초대",
      "PWA로 모바일·태블릿에서 사용",
      "운영진 오픈 카톡 피드백 → 수정·배포 루프 직접 운영",
    ],
    result: "모임 3곳에서 사용 (모임당 회원 50~100명)",
    stack: [
      "Next.js 15",
      "React 19",
      "TypeScript",
      "Tailwind CSS 4",
      "Supabase",
      "PWA",
      "Web Push",
      "Sentry",
      "Playwright",
    ],
    links: [
      { href: "https://to-find-crew.vercel.app/", label: "Live" },
      { href: "https://github.com/harry7435/to-find-crew", label: "GitHub" },
    ],
  },
  {
    slug: "family-ledger",
    group: "side",
    title: "우리집 가계부",
    source: "원장 사이드 프로젝트 / 이력서",
    users: "부부 2인 매일 사용",
    summary: "가족 기록 방식에 맞춘 가계부",
    situation: ["가족 기록 방식에 맞춘 가계부가 필요"],
    actions: ["쓰면서 불편했던 입력 모달 UX·지출·자산 통계 화면을 계속 개선"],
    result: "부부 2인 매일 사용",
    stack: ["Next.js", "Supabase"],
    links: [
      { href: "https://2k-jii-money.vercel.app/", label: "Live" },
      { href: "https://github.com/harry7435/2k-jii-money", label: "GitHub" },
    ],
    screenshots: [
      { src: "/projects/family-ledger-list.png", alt: "우리집 가계부 내역 화면 (이름·금액은 예시 값으로 변환)" },
      { src: "/projects/family-ledger-input.png", alt: "우리집 가계부 내역 입력 화면 (이름은 예시 값으로 변환)" },
      { src: "/projects/family-ledger-stats.png", alt: "우리집 가계부 카테고리별 지출 화면 (금액은 예시 값으로 변환)" },
    ],
  },
  {
    slug: "choice-eat",
    group: "side",
    title: "choice-eat",
    source: "원장 사이드 프로젝트 · choice-eat 설계(README 기준)",
    users: "배포 완료 · 지인만 사용",
    summary: "메뉴 추천 서비스",
    screenshots: [
      {
        src: "/projects/choice-eat-result.png",
        alt: "choice-eat 추첨 결과와 주변 매장 지도",
      },
      {
        src: "/projects/choice-eat-candidates.png",
        alt: "choice-eat 후보 음식 선택 화면",
      },
    ],
    situation: ["메뉴 선택 장애 해결"],
    cardPoints: [
      "카카오 REST 키·Gemini 키를 Route Handler 프록시로 서버에만 보관",
      "추첨 로직·추천 요청 검증 등을 lib로 분리하고 Vitest 단위 테스트",
    ],
    actions: [
      "후보·제외 음식 설정 → 무작위 추첨(직전 메뉴 제외) → 반경 2km 매장을 카카오맵에 표시",
      "상황을 입력하면 Gemini가 후보 추천(브라우저당 하루 3회)",
      "카카오 REST 키·Gemini 키를 클라이언트에 노출하지 않으려고 Route Handler 프록시로 서버에만 보관",
      "상태 라이브러리 없이 Context 하나 + localStorage로 후보·제외 목록 유지",
      "주소 검색 실패 시 키워드 검색으로 fallback, 위치 권한이 없을 때 주소·장소·지도 핀으로 위치 지정",
      "추첨 로직·추천 요청 검증 등을 lib로 분리하고 Vitest 단위 테스트",
      "husky + lint-staged, import 정렬 강제로 컨벤션 자동화",
    ],
    result: "배포 완료, 홍보 전이라 지인만 사용",
    stack: [
      "Next.js 14",
      "TypeScript",
      "Tailwind CSS",
      "TanStack Query",
      "카카오맵 SDK",
      "Gemini API",
      "Vitest",
    ],
    links: [{ href: "https://choice-eat.vercel.app", label: "Live" }],
  },
];
