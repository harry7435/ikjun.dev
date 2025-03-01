import { FaGithub } from "react-icons/fa";
import { Mail } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      {/* 히어로 섹션 */}
      <section className="text-center">
        <h1 className="text-4xl font-bold">안녕하세요! 👋</h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
          물처럼 팀과 동료에게 잘 스며드는 개발자, 조익준입니다.
        </p>
      </section>

      {/* 자기소개 */}
      <section className="mt-10">
        <h2 className="text-2xl font-semibold">🙋‍♂️ 자기소개</h2>
        <div className="mt-2 text-gray-700 dark:text-gray-300">
          <ReactMarkdown>
            {`팀과 함께 성장하는 개발자 조익준입니다. UI/UX를 고려한 개발을 중요하게
          생각하며, React, Next.js, TypeScript를 중심으로 성능 최적화와 디자인
          시스템 구축에 관심이 많습니다. **프로그래머스 프론트엔드 데브코스**를
          수료하며 3번의 팀 프로젝트에서 팀장 역할을 수행했습니다. 개발자의
          커뮤니케이션에 대해 고민하며 "**개발관계론**"이라는 주제로 발표를
          진행했습니다.`}
          </ReactMarkdown>
        </div>
      </section>

      {/* 기술 스택 */}
      <section className="mt-10">
        <h2 className="text-2xl font-semibold">🛠 기술 스택</h2>
        <div className="mt-4 flex flex-wrap gap-4">
          <span className="rounded-lg bg-gray-100 px-3 py-1 dark:bg-gray-700">
            Next.js
          </span>
          <span className="rounded-lg bg-gray-100 px-3 py-1 dark:bg-gray-700">
            TypeScript
          </span>
          <span className="rounded-lg bg-gray-100 px-3 py-1 dark:bg-gray-700">
            React
          </span>
          <span className="rounded-lg bg-gray-100 px-3 py-1 dark:bg-gray-700">
            React Query
          </span>
          <span className="rounded-lg bg-gray-100 px-3 py-1 dark:bg-gray-700">
            Zustand
          </span>
          <span className="rounded-lg bg-gray-100 px-3 py-1 dark:bg-gray-700">
            Styled-Components
          </span>
          <span className="rounded-lg bg-gray-100 px-3 py-1 dark:bg-gray-700">
            Axios
          </span>
        </div>
      </section>

      {/* 경험 */}
      <section className="mt-10">
        <h2 className="text-2xl font-semibold">💼 경험</h2>

        {/* 프로그래머스 데브코스 */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold">
            프로그래머스 프론트엔드 데브코스
          </h3>
          <p className="text-gray-600 dark:text-gray-400">2023.09 ~ 2024.03</p>
          <ul className="mt-2 list-disc pl-5 text-gray-700 dark:text-gray-300">
            <li>3개의 팀 프로젝트에서 팀장 역할 수행</li>
            <li>
              AlgoBaro, Styled 팀 프로젝트 및 Notion 클로닝 개인 프로젝트 수행
            </li>
            <li>TypeScript 스터디 진행 및 딥다이브 발표</li>
          </ul>
        </div>

        {/* 프로젝트 경험 */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold">🚀 주요 프로젝트</h3>

          {/* AlgoBaro */}
          <div className="mt-4">
            <h4 className="text-lg font-semibold">
              AlgoBaro - 코딩 테스트 학습 플랫폼
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              <a
                href="https://algobaro.vercel.app/"
                className="text-blue-500 hover:underline"
              >
                배포 링크
              </a>{" "}
              |
              <a
                href="https://github.com/1e5i-Shark/algobaro-fe"
                className="text-blue-500 hover:underline"
              >
                {" "}
                GitHub
              </a>
            </p>
            <ul className="mt-2 list-disc pl-5 text-gray-700 dark:text-gray-300">
              <li>회원 인증 (로그인, 회원가입) 기능 구현</li>
              <li>공용 API 인스턴스 설정을 통한 개발 속도 향상</li>
              <li>프로필 페이지 및 풀이 히스토리 기능 개발</li>
            </ul>
          </div>

          {/* Styled */}
          <div className="mt-4">
            <h4 className="text-lg font-semibold">Styled - 패션 SNS 서비스</h4>
            <p className="text-gray-600 dark:text-gray-400">
              <a
                href="https://styled-rho.vercel.app/"
                className="text-blue-500 hover:underline"
              >
                배포 링크
              </a>{" "}
              |
              <a
                href="https://github.com/prgrms-fe-devcourse/FEDC5_STYLED_sehee"
                className="text-blue-500 hover:underline"
              >
                {" "}
                GitHub
              </a>
            </p>
            <ul className="mt-2 list-disc pl-5 text-gray-700 dark:text-gray-300">
              <li>메인 페이지 및 포스트 상세 모달 페이지 구현</li>
              <li>페이지네이션 최적화 및 데이터 캐싱 개선</li>
              <li>스켈레톤 UI 적용으로 UX 향상</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 자격증 및 수상 */}
      <section className="mt-10">
        <h2 className="text-2xl font-semibold">🏆 자격증 & 수상</h2>
        <ul className="mt-4 list-disc pl-5 text-gray-700 dark:text-gray-300">
          <li>SQLD (한국데이터산업진흥원, 2022.12)</li>
          <li>
            DACON 공모전 - 월간 데이콘 KOSPI 기반 분석 시각화 경진대회 1등
            (2022.11)
          </li>
        </ul>
      </section>

      {/* 연락처 & 링크 */}
      <section className="mt-10">
        <h2 className="text-2xl font-semibold">📞 연락처</h2>
        <div className="mt-4 flex gap-4">
          <a
            href="https://github.com/harry7435"
            className="flex items-center gap-2 text-gray-800 hover:underline dark:text-gray-300"
          >
            <FaGithub size={20} />
            GitHub
          </a>
          <a
            href="https://velog.io/@harry7435"
            className="flex items-center gap-2 text-gray-800 hover:underline dark:text-gray-300"
          >
            Velog
          </a>
          <a
            href="mailto:harry960629@naver.com"
            className="flex items-center gap-2 text-gray-800 hover:underline dark:text-gray-300"
          >
            <Mail size={20} />
            Email
          </a>
        </div>
      </section>
    </div>
  );
}
