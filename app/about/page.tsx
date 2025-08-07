import { FaExternalLinkAlt, FaGithub } from "react-icons/fa";
import { Mail } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { FiArrowRight } from "react-icons/fi";
import Link from "next/link";
import { Metadata } from "next";

// About 페이지의 메타데이터 설정
export const generateMetadata = (): Metadata => {
  return {
    title: "About | ikjun.dev",
    description: "프론트엔드 개발자 조익준의 소개 페이지입니다.",
    openGraph: {
      title: "About | ikjun.dev",
      description: "프론트엔드 개발자 조익준의 소개 페이지입니다.",
      type: "website",
      locale: "ko_KR",
      url: "https://ikjun-dev.vercel.app/about",
      siteName: "ikjun.dev",
      images: [
        {
          url: "https://ikjun-dev.vercel.app/ikjun-dev.png", // 기존 이미지 재사용
          width: 800,
          height: 800,
          alt: "ikjun.dev 프로필",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "About | ikjun.dev",
      description: "프론트엔드 개발자 조익준의 소개 페이지입니다.",
      images: ["https://ikjun-dev.vercel.app/ikjun-dev.png"],
    },
  };
};

// 한 줄 브랜딩 문구
const brandingStatement =
  "사용자 경험을 중점적으로 웹페이지 성능을 최적화하고 유연한 소프트 스킬로 팀에 잘 스며드는 프론트엔드 개발자";

const executiveSummary = `
**팀**과 함께 성장하는 개발자 **조익준**입니다.

UI/UX를 고려한 개발을 중요하게 생각하며, React, Next.js, TypeScript를 중심으로 성능 최적화와 디자인 시스템 구축에 관심이 많습니다.

현재는 **유리프트** Product 팀에서 프론트엔드 엔지니어로 **코딩밸리** 서비스를 운영하고 있습니다.

이전에는 **프로그래머스 프론트엔드 데브코스** 교육을 수료하며 3번의 팀 프로젝트에서 팀장 역할을 수행했습니다.

개발자의 커뮤니케이션에 대해 고민하며 "**개발관계론**"이라는 주제로 발표를 해본 경험이 있습니다.
`;

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-stone-100 dark:bg-gray-900">
      <div className="container mx-auto px-6 py-12 pt-24">
        {/* 히어로 섹션 - 브랜딩 문구 */}
        <section className="mb-12 w-full">
          <h1 className="mb-4 text-2xl font-bold text-gray-700 dark:text-white md:text-3xl">
            안녕하세요! 조익준입니다.
          </h1>
          {/*  한 줄 브랜딩 */}
          <div className="mx-auto mb-6 rounded-lg bg-gradient-to-r from-amber-50/70 to-orange-50/70 p-6 shadow-sm dark:from-blue-900/20 dark:to-indigo-900/20">
            <p className="text-lg font-semibold text-gray-700 dark:text-white md:text-xl">
              📌 {brandingStatement}
            </p>
          </div>
        </section>

        {/* 자기소개 카드 */}
        <section className="mb-8 flex flex-col gap-8">
          <div className="rounded-lg border border-stone-300/40 bg-stone-200/60 shadow-sm backdrop-blur-sm transition-[shadow,transform] hover:translate-y-[-2px] hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:shadow-gray-900/30 dark:hover:shadow-lg dark:hover:shadow-gray-700/30">
            {/* Executive Summary 헤더 - sticky 적용 */}
            <div className="top-[68px] z-[1] rounded-lg border-stone-300/40 bg-stone-200/80 px-6 py-4 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                💡 Executive Summary
              </h2>
            </div>

            {/* 자기소개 내용 */}
            <div className="p-6 pt-4 max-md:px-4">
              <div className="text-gray-700 dark:text-gray-300">
                <ReactMarkdown
                  components={{
                    // 강조(bold) 텍스트에 파란색 스타일 적용
                    strong: ({ ...props }) => (
                      <strong
                        className="text-lg font-semibold text-blue-600 dark:text-blue-400"
                        {...props}
                      />
                    ),
                    // 문단에 간격 추가
                    p: ({ ...props }) => <p className="mb-4" {...props} />,
                  }}
                >
                  {executiveSummary}
                </ReactMarkdown>
              </div>
            </div>
          </div>

          {/* 기술 스택 카드 */}
          <div className="rounded-lg border border-stone-300/40 bg-stone-200/60 shadow-sm backdrop-blur-sm transition-[shadow,transform] hover:translate-y-[-2px] hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:shadow-gray-900/30 dark:hover:shadow-lg dark:hover:shadow-gray-700/30">
            {/* 기술 스택 헤더 - sticky 적용 */}
            <div className="top-[68px] z-[1] rounded-lg border-stone-300/40 bg-stone-200/80 px-6 py-4 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                🛠 Key Tech Stack
              </h2>
            </div>

            {/* 기술 스택 내용 */}
            <div className="p-6 pt-4 max-md:px-4">
              <div className="flex flex-wrap gap-3">
                <span className="rounded-lg bg-stone-200/60 px-3 py-1.5 text-stone-700 dark:bg-gray-700 dark:text-gray-300">
                  Next.js
                </span>
                <span className="rounded-lg bg-stone-200/60 px-3 py-1.5 text-stone-700 dark:bg-gray-700 dark:text-gray-300">
                  TypeScript
                </span>
                {/* <span className="rounded-lg bg-gray-100 px-3 py-1.5 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                  React
                </span>
                <span className="rounded-lg bg-stone-200/60 px-3 py-1.5 text-stone-700 dark:bg-gray-700 dark:text-gray-300">
                  React Query
                </span> */}
                <span className="rounded-lg bg-stone-200/60 px-3 py-1.5 text-stone-700 dark:bg-gray-700 dark:text-gray-300">
                  Zustand
                </span>
                <span className="rounded-lg bg-stone-200/60 px-3 py-1.5 text-stone-700 dark:bg-gray-700 dark:text-gray-300">
                  firebase
                </span>
                <span className="rounded-lg bg-stone-200/60 px-3 py-1.5 text-stone-700 dark:bg-gray-700 dark:text-gray-300">
                  hygraph(graphQL)
                </span>
                <span className="rounded-lg bg-stone-200/60 px-3 py-1.5 text-stone-700 dark:bg-gray-700 dark:text-gray-300">
                  tailwindcss
                </span>
                {/* <span className="rounded-lg bg-gray-100 px-3 py-1.5 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                  Styled-Components
                </span> */}
                {/* <span className="rounded-lg bg-gray-100 px-3 py-1.5 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                  Axios
                </span> */}
              </div>
            </div>
          </div>

          {/* 경험 카드 - 왼쪽 고정, 오른쪽 스크롤 레이아웃 */}
          <div className="rounded-lg border border-stone-300/40 bg-stone-200/60 shadow-sm backdrop-blur-sm transition-[shadow,transform] hover:translate-y-[-2px] hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:shadow-gray-900/30 dark:hover:shadow-lg dark:hover:shadow-gray-700/30">
            {/* 경험 헤더 - sticky 적용 */}
            <div className="top-[68px] z-[1] rounded-lg border-stone-300/40 bg-stone-200/80 px-6 py-4 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                💼 경력 & 교육
              </h2>
            </div>

            {/* 경험 내용 */}
            <div className="p-6 pt-4 max-md:px-4">
              <div className="flex flex-col gap-8 md:flex-row">
                {/* 왼쪽 고정 열 */}
                <div className="w-full md:sticky md:top-24 md:h-fit md:w-1/4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    유리프트
                    <br className="max-md:hidden" /> Product 팀
                  </h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    2024.07 ~ 현재
                  </p>
                </div>

                {/* 오른쪽 스크롤 가능한 열 */}
                <div className="flex w-full flex-col gap-6 md:w-3/4 md:overflow-y-auto">
                  <div>
                    <h4 className="mb-3 font-semibold text-gray-800 dark:text-white">
                      주요 담당 업무
                    </h4>

                    <div className="mb-4">
                      <h5 className="mb-2 font-medium text-blue-600 dark:text-blue-400">
                        <Link
                          target="_blank"
                          rel="noopener noreferrer"
                          href="https://www.codingvalley.com/"
                          className="hover:text-blue-500 dark:hover:text-blue-300"
                        >
                          코딩밸리 서비스 웹페이지 랜딩화 및 고도화
                          <FaExternalLinkAlt className="ml-1 inline-block size-3" />
                        </Link>
                      </h5>
                      <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
                        <li>
                          강의 무료체험을 위한 무료체험 페이지 구현으로{" "}
                          <strong>사용자 전환율 25% 향상</strong>
                        </li>
                        <li>
                          <strong>마케팅 전략 및 기획</strong>에 맞는 신규
                          페이지 및{" "}
                          <Link
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://www.codingvalley.com/ldm/7"
                            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            LDM(홍보) 페이지
                            <FaExternalLinkAlt className="ml-1 inline-block size-3" />
                          </Link>{" "}
                          구현 및 개선
                        </li>
                        <li>
                          이미지 및 동영상 최적화를 통한{" "}
                          <strong>{"LCP 3.71초 > 1.14초 단축"}</strong> 경험
                        </li>
                        <li>
                          기존 웹페이지를 <strong>웹뷰</strong>로 구현하여
                          네이티브 앱에서도 동일한 서비스 제공
                        </li>
                        <li>
                          <strong>고객 인바운드를 반영</strong>한 코딩밸리
                          서비스 UI 개선
                        </li>
                      </ul>
                    </div>

                    <div className="mb-4">
                      <h5 className="mb-2 font-medium text-blue-600 dark:text-blue-400">
                        코딩밸리 PC 웹앱 전환 프로젝트
                      </h5>
                      <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
                        <li>
                          기존 네이티브 앱 내 강의, 커뮤니티 기능을{" "}
                          <strong>웹앱</strong>으로 구현
                        </li>
                        <li>
                          <strong>크로스 플랫폼</strong> 지원으로 사용자 접근성
                          확대
                        </li>
                        <li>
                          반응형 디자인 적용으로 다양한 디바이스 환경 지원
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-3 font-semibold text-gray-800 dark:text-white">
                      기술 스택
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-lg bg-amber-100/60 px-2 py-1 text-sm text-amber-800 dark:bg-blue-900/30 dark:text-blue-300">
                        Next.js
                      </span>
                      <span className="rounded-lg bg-amber-100/60 px-2 py-1 text-sm text-amber-800 dark:bg-blue-900/30 dark:text-blue-300">
                        TypeScript
                      </span>
                      <span className="rounded-lg bg-amber-100/60 px-2 py-1 text-sm text-amber-800 dark:bg-blue-900/30 dark:text-blue-300">
                        tailwindcss
                      </span>
                      <span className="rounded-lg bg-amber-100/60 px-2 py-1 text-sm text-amber-800 dark:bg-blue-900/30 dark:text-blue-300">
                        firebase
                      </span>
                      <span className="rounded-lg bg-amber-100/60 px-2 py-1 text-sm text-amber-800 dark:bg-blue-900/30 dark:text-blue-300">
                        hygraph(graphQL)
                      </span>
                      <span className="rounded-lg bg-amber-100/60 px-2 py-1 text-sm text-amber-800 dark:bg-blue-900/30 dark:text-blue-300">
                        playwright
                      </span>
                      <span className="rounded-lg bg-amber-100/60 px-2 py-1 text-sm text-amber-800 dark:bg-blue-900/30 dark:text-blue-300">
                        Vercel
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 pt-4 max-md:px-4">
              <div className="flex flex-col gap-8 md:flex-row">
                {/* 왼쪽 고정 열 */}
                <div className="w-full md:sticky md:top-24 md:h-fit md:w-1/4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    프로그래머스
                    <br className="max-md:hidden" /> 프론트엔드 데브코스
                  </h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    2023.09 ~ 2024.03
                  </p>
                </div>

                {/* 오른쪽 스크롤 가능한 열 */}
                <div className="w-full md:w-3/4 md:overflow-y-auto">
                  <div>
                    <h4 className="mb-3 font-semibold text-gray-800 dark:text-white">
                      주요 활동 및 성과
                    </h4>

                    <div className="mb-4">
                      <h5 className="mb-2 font-medium text-blue-600 dark:text-blue-400">
                        팀 프로젝트 리더십
                      </h5>
                      <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
                        <li>
                          <strong>3개의 팀 프로젝트에서 팀장 역할 수행</strong>{" "}
                          (AlgoBaro, Styled, Notion 클로닝)
                        </li>
                        <li>
                          Git Flow 기반 브랜치 전략 수립으로 팀 개발 프로세스
                          표준화
                        </li>
                        <li>코드 리뷰 문화 정착 및 팀 협업 효율성 향상</li>
                      </ul>
                    </div>

                    <div className="mb-4">
                      <h5 className="mb-2 font-medium text-blue-600 dark:text-blue-400">
                        기술 스터디 및 지식 공유
                      </h5>
                      <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
                        <li>TypeScript 스터디 진행 및 딥다이브 발표</li>
                        <li>
                          &ldquo;개발관계론&rdquo; 발표를 통한 팀 커뮤니케이션
                          개선
                        </li>
                        <li>UI 컴포넌트 라이브러리 개발 및 문서화</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 프로젝트 카드 - 왼쪽 고정, 오른쪽 스크롤 레이아웃 */}
          <div className="rounded-lg border border-stone-300/40 bg-stone-200/60 shadow-sm backdrop-blur-sm transition-[shadow,transform] hover:translate-y-[-2px] hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:shadow-gray-900/30 dark:hover:shadow-lg dark:hover:shadow-gray-700/30">
            {/* 프로젝트 헤더 - sticky 적용 */}
            <div className="top-[68px] z-[1] rounded-lg border-stone-300/40 bg-stone-200/80 px-6 py-4 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                🚀 핵심 프로젝트
              </h2>
            </div>

            {/* 프로젝트 내용 */}
            <div className="p-6 pt-4 max-md:px-4">
              <div className="flex flex-col gap-12">
                {/* AlgoBaro 프로젝트 */}
                <div className="flex flex-col gap-4 md:flex-row">
                  {/* 왼쪽 고정 열 */}
                  <div className="w-full md:sticky md:top-24 md:h-fit md:w-1/4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      AlgoBaro
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      코딩 테스트 학습 플랫폼
                    </p>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      2023.12 ~ 2024.02
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Link
                        href="https://algobaro.vercel.app/"
                        className="inline-flex items-center text-blue-500 transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        배포 링크 <FiArrowRight className="ml-1 size-3" />
                      </Link>
                      <Link
                        href="https://github.com/1e5i-Shark/algobaro-fe"
                        className="inline-flex items-center text-blue-500 transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        GitHub <FiArrowRight className="ml-1 size-3" />
                      </Link>
                    </div>
                  </div>

                  {/* 오른쪽 스크롤 가능한 열 */}
                  <div className="w-full md:w-3/4 md:overflow-y-auto">
                    <div className="mb-4">
                      <h4 className="mb-2 font-semibold text-blue-600 dark:text-blue-400">
                        Why - 문제 상황
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300">
                        기존 코딩 테스트 플랫폼들이 개별 학습에만 집중하여,
                        팀원들과 함께 문제를 해결하고 코드 리뷰를 통해 학습하는
                        환경이 부족
                      </p>
                    </div>

                    <div className="mb-4">
                      <h4 className="mb-2 font-semibold text-green-600 dark:text-green-400">
                        How - 해결 방법
                      </h4>
                      <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
                        <li>
                          <strong>실시간 협업</strong>: WebSocket 기반 그룹
                          스터디 채팅 시스템 구현
                        </li>
                        <li>
                          <strong>코드 리뷰</strong>: 팀원 간 코드 공유 및
                          피드백 기능 개발
                        </li>
                        <li>
                          <strong>개발 효율성</strong>: 공용 API 인스턴스로 팀
                          개발 속도 40% 향상
                        </li>
                        <li>
                          <strong>사용자 경험</strong>: Code Mirror 기반 실시간
                          코드 에디터 구현
                        </li>
                      </ul>
                    </div>

                    <div className="mb-6">
                      <h4 className="mb-2 font-semibold text-purple-600 dark:text-purple-400">
                        Result - 성과
                      </h4>
                      <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
                        <li>
                          <strong>팀 개발 효율성 40% 향상</strong> (공용 API
                          설정으로)
                        </li>
                        <li>
                          <strong>실시간 협업 기능</strong>으로 사용자 참여도
                          증대
                        </li>
                        <li>
                          <strong>반응형 디자인</strong>으로 모바일 접근성 100%
                          지원
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="mb-3 font-semibold text-gray-800 dark:text-white">
                        사용 기술
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-lg bg-amber-100/60 px-2 py-1 text-sm text-amber-800 dark:bg-blue-900/30 dark:text-blue-300">
                          React
                        </span>
                        <span className="rounded-lg bg-amber-100/60 px-2 py-1 text-sm text-amber-800 dark:bg-blue-900/30 dark:text-blue-300">
                          TypeScript
                        </span>
                        <span className="rounded-lg bg-amber-100/60 px-2 py-1 text-sm text-amber-800 dark:bg-blue-900/30 dark:text-blue-300">
                          React Query
                        </span>
                        <span className="rounded-lg bg-amber-100/60 px-2 py-1 text-sm text-amber-800 dark:bg-blue-900/30 dark:text-blue-300">
                          WebSocket
                        </span>
                        <span className="rounded-lg bg-amber-100/60 px-2 py-1 text-sm text-amber-800 dark:bg-blue-900/30 dark:text-blue-300">
                          Code Mirror
                        </span>
                        <span className="rounded-lg bg-amber-100/60 px-2 py-1 text-sm text-amber-800 dark:bg-blue-900/30 dark:text-blue-300">
                          Zustand
                        </span>
                        <span className="rounded-lg bg-amber-100/60 px-2 py-1 text-sm text-amber-800 dark:bg-blue-900/30 dark:text-blue-300">
                          Styled-Components
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Styled 프로젝트 */}
                <div className="flex flex-col gap-4 md:flex-row">
                  {/* 왼쪽 고정 열 */}
                  <div className="w-full md:sticky md:top-24 md:h-fit md:w-1/4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      Styled
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      패션 SNS 서비스
                    </p>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      2023.10 ~ 2023.12
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Link
                        href="https://styled-rho.vercel.app/"
                        className="inline-flex items-center text-blue-500 transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        배포 링크 <FiArrowRight className="ml-1 size-3" />
                      </Link>
                      <Link
                        href="https://github.com/prgrms-fe-devcourse/FEDC5_STYLED_sehee"
                        className="inline-flex items-center text-blue-500 transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        GitHub <FiArrowRight className="ml-1 size-3" />
                      </Link>
                    </div>
                  </div>

                  {/* 오른쪽 스크롤 가능한 열 */}
                  <div className="w-full md:w-3/4 md:overflow-y-auto">
                    <div className="mb-4">
                      <h4 className="mb-2 font-semibold text-blue-600 dark:text-blue-400">
                        Why - 문제 상황
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300">
                        기존 패션 플랫폼들의 느린 로딩 속도와 단조로운 UI로 인해
                        사용자 이탈률이 높았습니다. 특히 이미지 중심의 SNS에서
                        최적화된 사용자 경험이 필요
                      </p>
                    </div>

                    <div className="mb-4">
                      <h4 className="mb-2 font-semibold text-green-600 dark:text-green-400">
                        How - 해결 방법
                      </h4>
                      <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
                        <li>
                          <strong>성능 최적화</strong>: React Query 캐싱으로
                          데이터 로딩 최적화
                        </li>
                        <li>
                          <strong>UX 개선</strong>: 스켈레톤 UI와 무한 스크롤로
                          매끄러운 경험 제공
                        </li>
                        <li>
                          <strong>이미지 최적화</strong>: 지연 로딩과 미리보기로
                          로딩 속도 개선
                        </li>
                        <li>
                          <strong>반응형 설계</strong>: 모바일 퍼스트 접근으로
                          다양한 기기 지원
                        </li>
                      </ul>
                    </div>

                    <div className="mb-6">
                      <h4 className="mb-2 font-semibold text-purple-600 dark:text-purple-400">
                        Result - 성과
                      </h4>
                      <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
                        <li>
                          <strong>페이지 로딩 속도 60% 향상</strong> (React
                          Query 캐싱)
                        </li>
                        <li>
                          <strong>사용자 경험 개선</strong>으로 체류 시간 증가
                        </li>
                        <li>
                          <strong>모바일 최적화</strong>로 크로스 플랫폼 사용성
                          확보
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="mb-3 font-semibold text-gray-800 dark:text-white">
                        사용 기술
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-lg bg-amber-100/60 px-2 py-1 text-sm text-amber-800 dark:bg-blue-900/30 dark:text-blue-300">
                          React
                        </span>
                        <span className="rounded-lg bg-amber-100/60 px-2 py-1 text-sm text-amber-800 dark:bg-blue-900/30 dark:text-blue-300">
                          TypeScript
                        </span>
                        <span className="rounded-lg bg-amber-100/60 px-2 py-1 text-sm text-amber-800 dark:bg-blue-900/30 dark:text-blue-300">
                          React Query
                        </span>
                        <span className="rounded-lg bg-amber-100/60 px-2 py-1 text-sm text-amber-800 dark:bg-blue-900/30 dark:text-blue-300">
                          Styled-Components
                        </span>
                        <span className="rounded-lg bg-amber-100/60 px-2 py-1 text-sm text-amber-800 dark:bg-blue-900/30 dark:text-blue-300">
                          Zustand
                        </span>
                        <span className="rounded-lg bg-amber-100/60 px-2 py-1 text-sm text-amber-800 dark:bg-blue-900/30 dark:text-blue-300">
                          Infinite Scroll
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 자격증 및 수상 카드 */}
          <div className="rounded-lg border border-stone-300/40 bg-stone-200/60 shadow-sm backdrop-blur-sm transition-[shadow,transform] hover:translate-y-[-2px] hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:shadow-gray-900/30 dark:hover:shadow-lg dark:hover:shadow-gray-700/30">
            {/* 자격증 및 수상 헤더 - sticky 적용 */}
            <div className="top-[68px] z-[1] rounded-lg border-stone-300/40 bg-stone-200/80 px-6 py-4 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                🏆 자격증 & 수상 이력
              </h2>
            </div>

            {/* 자격증 및 수상 내용 */}
            <div className="p-6 pt-4 max-md:px-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg bg-amber-50/70 p-4 shadow-sm dark:bg-yellow-900/20">
                  <h4 className="mb-2 font-semibold text-amber-800 dark:text-yellow-300">
                    🥇 DACON 공모전 1등
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    월간 데이콘 KOSPI 기반 분석 시각화 경진대회 (2022.11)
                  </p>
                  <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                    📈 데이터 분석 및 시각화 역량 인정
                  </p>
                </div>
                <div className="rounded-lg bg-sky-50/70 p-4 shadow-sm dark:bg-blue-900/20">
                  <h4 className="mb-2 font-semibold text-sky-800 dark:text-blue-300">
                    📜 SQLD 자격증
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    한국데이터산업진흥원 (2022.12)
                  </p>
                  <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                    🗃️ SQL 및 데이터베이스 활용 능력 보유
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 학력 카드 */}
          <div className="rounded-lg border border-stone-300/40 bg-stone-200/60 shadow-sm backdrop-blur-sm transition-[shadow,transform] hover:translate-y-[-2px] hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:shadow-gray-900/30 dark:hover:shadow-lg dark:hover:shadow-gray-700/30">
            {/* 학력 헤더 - sticky 적용 */}
            <div className="top-[68px] z-[1] rounded-lg border-stone-300/40 bg-stone-200/80 px-6 py-4 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                🎓 학력
              </h2>
            </div>

            {/* 학력 내용 */}
            <div className="p-6 pt-4 max-md:px-4">
              <div className="rounded-lg bg-sky-50/70 p-4 shadow-sm dark:bg-blue-900/20">
                <h4 className="mb-2 font-semibold text-sky-800 dark:text-blue-300">
                  🏛️ 성균관대학교
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  전자전기공학부 학사 (2022.02 졸업)
                </p>
              </div>
            </div>
          </div>

          {/* 연락처 & 링크 카드 */}
          <div className="rounded-lg border border-stone-300/40 bg-stone-200/60 shadow-sm backdrop-blur-sm transition-[shadow,transform] hover:translate-y-[-2px] hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:shadow-gray-900/30 dark:hover:shadow-lg dark:hover:shadow-gray-700/30">
            {/* 연락처 헤더 - sticky 적용 */}
            <div className="top-[68px] z-[1] rounded-lg border-stone-300/40 bg-stone-200/80 px-6 py-4 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                📞 Contact
              </h2>
            </div>

            {/* 연락처 내용 */}
            <div className="p-6 pt-4 max-md:px-4">
              <div className="flex flex-wrap gap-4">
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://github.com/harry7435"
                  className="inline-flex items-center gap-2 text-gray-800 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                >
                  <FaGithub size={20} />
                  GitHub
                </Link>
                {/* <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://velog.io/@harry7435"
                  className="inline-flex items-center gap-2 text-gray-800 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                >
                  Velog
                </Link> */}
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href="mailto:harry960629@naver.com"
                  className="inline-flex items-center gap-2 text-gray-800 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                >
                  <Mail size={20} />
                  Email
                </Link>
              </div>
            </div>
          </div>

          {/* 홈으로 돌아가기 버튼 */}
          {/* <div className="mt-4 text-center">
            <Link
              href="/"
              className="inline-flex items-center text-blue-500 transition-colors hover:text-blue-600 dark:hover:text-blue-400"
            >
              홈으로 돌아가기 <FiArrowRight className="ml-1 size-4" />
            </Link>
          </div> */}
        </section>
      </div>
    </main>
  );
}
