import { FaExternalLinkAlt, FaGithub } from "react-icons/fa";
import { Mail } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { FiArrowRight } from "react-icons/fi";
import Link from "next/link";

const introductionText = `
**팀**과 함께 성장하는 개발자 **조익준**입니다.

UI/UX를 고려한 개발을 중요하게 생각하며, React, Next.js, TypeScript를 중심으로 성능 최적화와 디자인 시스템 구축에 관심이 많습니다.

현재는 **유리프트** Product 팀에서 프론트엔드 엔지니어로 **코딩밸리** 서비스를 운영하고 있습니다.

이전에는 **프로그래머스 프론트엔드 데브코스** 교육을 수료하며 3번의 팀 프로젝트에서 팀장 역할을 수행했습니다.

개발자의 커뮤니케이션에 대해 고민하며 "**개발관계론**"이라는 주제로 발표를 해본 경험이 있습니다.
`;

export default function AboutPage() {
  return (
    <main className="dark:bg-gray-900">
      <div className="container mx-auto px-6 py-12 pt-24">
        {/* 히어로 섹션 */}
        <section className="mb-12 text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white md:text-3xl">
            안녕하세요!
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-gray-600 dark:text-gray-300">
            물처럼 팀과 동료에게 잘 스며드는 개발자, 조익준입니다.
          </p>
        </section>

        {/* 자기소개 카드 */}
        <section className="mb-8 flex flex-col gap-8">
          <div className="rounded-lg border border-gray-100 bg-white shadow transition-[shadow,transform] hover:translate-y-[-2px] hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:shadow-gray-900/30 dark:hover:shadow-lg dark:hover:shadow-gray-700/30">
            {/* 자기소개 헤더 - sticky 적용 */}
            <div className="top-[68px] z-[1] rounded-lg border-gray-100 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-800 md:sticky">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                🙋‍♂️ 자기소개
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
                  {introductionText}
                </ReactMarkdown>
              </div>
            </div>
          </div>

          {/* 기술 스택 카드 */}
          <div className="hidden rounded-lg border border-gray-100 bg-white shadow transition-[shadow,transform] hover:translate-y-[-2px] hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:shadow-gray-900/30 dark:hover:shadow-lg dark:hover:shadow-gray-700/30">
            {/* 기술 스택 헤더 - sticky 적용 */}
            <div className="top-[68px] z-[1] rounded-lg border-gray-100 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-800 md:sticky">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                🛠 기술 스택
              </h2>
            </div>

            {/* 기술 스택 내용 */}
            <div className="p-6 pt-4 max-md:px-4">
              <div className="flex flex-wrap gap-3">
                <span className="rounded-lg bg-gray-100 px-3 py-1.5 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                  Next.js
                </span>
                <span className="rounded-lg bg-gray-100 px-3 py-1.5 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                  TypeScript
                </span>
                <span className="rounded-lg bg-gray-100 px-3 py-1.5 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                  React
                </span>
                <span className="rounded-lg bg-gray-100 px-3 py-1.5 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                  React Query
                </span>
                <span className="rounded-lg bg-gray-100 px-3 py-1.5 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                  Zustand
                </span>
                <span className="rounded-lg bg-gray-100 px-3 py-1.5 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                  firebase
                </span>
                <span className="rounded-lg bg-gray-100 px-3 py-1.5 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                  hygraph(graphQL)
                </span>
                <span className="rounded-lg bg-gray-100 px-3 py-1.5 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                  tailwindcss
                </span>
                <span className="rounded-lg bg-gray-100 px-3 py-1.5 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                  Styled-Components
                </span>
                <span className="rounded-lg bg-gray-100 px-3 py-1.5 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                  Axios
                </span>
              </div>
            </div>
          </div>

          {/* 경험 카드 - 왼쪽 고정, 오른쪽 스크롤 레이아웃 */}
          <div className="rounded-lg border border-gray-100 bg-white shadow transition-[shadow,transform] hover:translate-y-[-2px] hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:shadow-gray-900/30 dark:hover:shadow-lg dark:hover:shadow-gray-700/30">
            {/* 경험 헤더 - sticky 적용 */}
            <div className="top-[68px] z-[1] rounded-lg border-gray-100 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-800 md:sticky">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                💼 경험
              </h2>
            </div>

            {/* 경험 내용 */}
            <div className="p-6 pt-4 max-md:px-4">
              <div className="flex flex-col gap-8 md:flex-row">
                {/* 왼쪽 고정 열 */}
                <div className="w-full md:sticky md:top-36 md:h-fit md:w-1/4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    유리프트
                    <br className="max-md:hidden" /> Product 팀
                  </h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    2024.07 ~ 현재
                  </p>
                </div>

                {/* 오른쪽 스크롤 가능한 열 */}
                <div className="flex w-full flex-col gap-4 md:w-3/4 md:overflow-y-auto">
                  <div>
                    <h4 className="mb-2 font-semibold text-gray-800 dark:text-white">
                      <Link
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://www.codingvalley.com/"
                        className="font-semibold text-blue-500 hover:text-blue-400 dark:text-blue-500 dark:hover:text-blue-400"
                      >
                        코딩밸리
                        <FaExternalLinkAlt className="ml-1 inline-block size-3" />
                      </Link>{" "}
                      서비스 웹페이지 랜딩화 및 고도화
                    </h4>
                    <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
                      <li>
                        마케팅 전략 및 기획에 맞는 신규 페이지 및 LDM(홍보)
                        페이지 구현 및 개선
                      </li>
                      <li>강의 무료체험을 위한 무료체험 페이지 구현</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="mb-2 font-semibold text-gray-800 dark:text-white">
                      코딩밸리 PC 웹앱 전환
                    </h4>
                    <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
                      <li>
                        기존 네이티브 앱 내에 있는 강의, 커뮤니티 기능을
                        웹앱으로 구현
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="mb-3 font-semibold text-gray-800 dark:text-white">
                      기술 스택
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-lg bg-blue-100 px-2 py-1 text-sm text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        Next.js
                      </span>
                      <span className="rounded-lg bg-blue-100 px-2 py-1 text-sm text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        TypeScript
                      </span>
                      <span className="rounded-lg bg-blue-100 px-2 py-1 text-sm text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        tailwindcss
                      </span>
                      <span className="rounded-lg bg-blue-100 px-2 py-1 text-sm text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        firebase
                      </span>
                      <span className="rounded-lg bg-blue-100 px-2 py-1 text-sm text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        hygraph(graphQL)
                      </span>
                      <span className="rounded-lg bg-blue-100 px-2 py-1 text-sm text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        playwright
                      </span>
                      <span className="rounded-lg bg-blue-100 px-2 py-1 text-sm text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
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
                <div className="w-full md:sticky md:top-36 md:h-fit md:w-1/4">
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
                  <p className="mb-2 font-semibold text-gray-800 dark:text-white">
                    주요 활동
                  </p>
                  <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
                    <li>3개의 팀 프로젝트에서 팀장 역할 수행</li>
                    <li>
                      AlgoBaro, Styled 팀 프로젝트 및 Notion 클로닝 개인
                      프로젝트 수행
                    </li>
                    <li>TypeScript 스터디 진행 및 딥다이브 발표</li>
                    <li>개발관계론 발표를 통한 팀 커뮤니케이션 개선</li>
                    <li>UI 컴포넌트 라이브러리 개발 및 문서화</li>
                    <li>Git Flow 기반 브랜치 전략 수립</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* 프로젝트 카드 - 왼쪽 고정, 오른쪽 스크롤 레이아웃 */}
          <div className="rounded-lg border border-gray-100 bg-white shadow transition-[shadow,transform] hover:translate-y-[-2px] hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:shadow-gray-900/30 dark:hover:shadow-lg dark:hover:shadow-gray-700/30">
            {/* 프로젝트 헤더 - sticky 적용 */}
            <div className="top-[68px] z-[1] rounded-lg border-gray-100 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-800 md:sticky">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                🚀 주요 프로젝트
              </h2>
            </div>

            {/* 프로젝트 내용 */}
            <div className="p-6 pt-4 max-md:px-4">
              <div className="flex flex-col gap-12">
                {/* AlgoBaro 프로젝트 */}
                <div className="flex flex-col gap-4 md:flex-row">
                  {/* 왼쪽 고정 열 */}
                  <div className="w-full md:sticky md:top-36 md:h-fit md:w-1/4">
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
                    <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
                      <li>회원 인증 (로그인, 회원가입) 기능 구현</li>
                      <li>공용 API 인스턴스 설정을 통한 개발 속도 향상</li>
                      <li>프로필 페이지 및 풀이 히스토리 기능 개발</li>
                      <li>코드 에디터 및 실시간 코드 실행 기능 개발</li>
                      <li>WebSocket을 활용한 실시간 그룹 스터디 채팅 구현</li>
                      <li>코드 리뷰 시스템을 통한 학습 효율성 향상</li>
                      <li>반응형 레이아웃을 통한 다양한 디바이스 지원</li>
                    </ul>

                    <div className="mt-6">
                      <h4 className="mb-3 font-semibold text-gray-800 dark:text-white">
                        사용 기술
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-lg bg-blue-100 px-2 py-1 text-sm text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                          React
                        </span>
                        <span className="rounded-lg bg-blue-100 px-2 py-1 text-sm text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                          TypeScript
                        </span>
                        <span className="rounded-lg bg-blue-100 px-2 py-1 text-sm text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                          React Query
                        </span>
                        <span className="rounded-lg bg-blue-100 px-2 py-1 text-sm text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                          SocketJS
                        </span>
                        <span className="rounded-lg bg-blue-100 px-2 py-1 text-sm text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                          code mirror
                        </span>
                        <span className="rounded-lg bg-blue-100 px-2 py-1 text-sm text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                          Zustand
                        </span>
                        <span className="rounded-lg bg-blue-100 px-2 py-1 text-sm text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                          Styled-Components
                        </span>
                        <span className="rounded-lg bg-blue-100 px-2 py-1 text-sm text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                          Vercel
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Styled 프로젝트 */}
                <div className="flex flex-col gap-4 md:flex-row">
                  {/* 왼쪽 고정 열 */}
                  <div className="w-full md:sticky md:top-36 md:h-fit md:w-1/4">
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
                    <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
                      <li>메인 페이지 및 포스트 상세 모달 페이지 구현</li>
                      <li>페이지네이션 최적화 및 데이터 캐싱 개선</li>
                      <li>스켈레톤 UI 적용으로 UX 향상</li>
                      <li>무한 스크롤 기능을 통한 사용자 경험 개선</li>
                      <li>이미지 업로드 최적화 및 미리보기 기능 구현</li>
                      <li>모바일 환경 대응 및 반응형 레이아웃 구축</li>
                    </ul>

                    <div className="mt-6">
                      <h4 className="mb-3 font-semibold text-gray-800 dark:text-white">
                        사용 기술
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-lg bg-blue-100 px-2 py-1 text-sm text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                          React
                        </span>
                        <span className="rounded-lg bg-blue-100 px-2 py-1 text-sm text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                          TypeScript
                        </span>
                        <span className="rounded-lg bg-blue-100 px-2 py-1 text-sm text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                          React Query
                        </span>
                        <span className="rounded-lg bg-blue-100 px-2 py-1 text-sm text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                          Styled-Components
                        </span>
                        <span className="rounded-lg bg-blue-100 px-2 py-1 text-sm text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                          Zustand
                        </span>
                        <span className="rounded-lg bg-blue-100 px-2 py-1 text-sm text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                          Axios
                        </span>
                        <span className="rounded-lg bg-blue-100 px-2 py-1 text-sm text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                          Vercel
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 자격증 및 수상 카드 */}
          <div className="rounded-lg border border-gray-100 bg-white shadow transition-[shadow,transform] hover:translate-y-[-2px] hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:shadow-gray-900/30 dark:hover:shadow-lg dark:hover:shadow-gray-700/30">
            {/* 자격증 및 수상 헤더 - sticky 적용 */}
            <div className="top-[68px] z-[1] rounded-lg border-gray-100 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-800 md:sticky">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                🏆 자격증 & 수상
              </h2>
            </div>

            {/* 자격증 및 수상 내용 */}
            <div className="p-6 pt-4 max-md:px-4">
              <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
                <li>SQLD (한국데이터산업진흥원, 2022.12)</li>
                <li>
                  DACON 공모전 - 월간 데이콘 KOSPI 기반 분석 시각화 경진대회 1등
                  (2022.11)
                </li>
              </ul>
            </div>
          </div>

          {/* 연락처 & 링크 카드 */}
          <div className="rounded-lg border border-gray-100 bg-white shadow transition-[shadow,transform] hover:translate-y-[-2px] hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:shadow-gray-900/30 dark:hover:shadow-lg dark:hover:shadow-gray-700/30">
            {/* 연락처 헤더 - sticky 적용 */}
            <div className="top-[68px] z-[1] rounded-lg border-gray-100 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-800 md:sticky">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                📞 연락처
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
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://velog.io/@harry7435"
                  className="inline-flex items-center gap-2 text-gray-800 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                >
                  Velog
                </Link>
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
