import { FaExternalLinkAlt, FaGithub } from "react-icons/fa";
import { Mail } from "lucide-react";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import { Metadata } from "next";
import { SectionCard } from "./components/section-card";
import { ProjectCard } from "./components/project-card";
import {
  ExperienceCard,
  ExperienceSubsection,
  TechStack,
} from "./components/experience-card";
import { CertificationGrid } from "./components/certification-grid";
import {
  brandingStatement,
  executiveSummary,
  keyTechStack,
  projects,
  certifications,
  education,
} from "./data/about-data";

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
          url: "https://ikjun-dev.vercel.app/ikjun-dev.png",
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

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-stone-100 dark:bg-gray-900">
      <div className="container mx-auto px-6 py-12 pt-24">
        {/* 히어로 섹션 - 브랜딩 문구 */}
        <section className="mb-12 w-full">
          <h1 className="mb-4 text-2xl font-bold text-gray-700 dark:text-white md:text-3xl">
            안녕하세요! 조익준입니다.
          </h1>
          {/* 한 줄 브랜딩 */}
          <div className="mx-auto mb-6 rounded-lg bg-gradient-to-r from-amber-50/70 to-orange-50/70 p-6 shadow-sm dark:from-blue-900/20 dark:to-indigo-900/20">
            <p className="text-lg font-semibold text-gray-700 dark:text-white md:text-xl">
              📌 {brandingStatement}
            </p>
          </div>
        </section>

        {/* 메인 섹션들 */}
        <section className="mb-8 flex flex-col gap-8">
          {/* Executive Summary */}
          <SectionCard title="Executive Summary" icon="💡">
            <div className="text-gray-700 dark:text-gray-300">
              <ReactMarkdown
                components={{
                  strong: ({ ...props }) => (
                    <strong
                      className="text-lg font-semibold text-blue-600 dark:text-blue-400"
                      {...props}
                    />
                  ),
                  p: ({ ...props }) => <p className="mb-4" {...props} />,
                }}
              >
                {executiveSummary}
              </ReactMarkdown>
            </div>
          </SectionCard>

          {/* 기술 스택 */}
          <SectionCard title="Key Tech Stack" icon="🛠">
            <div className="flex flex-wrap gap-3">
              {keyTechStack.map((tech, index) => (
                <span
                  key={index}
                  className="rounded-lg bg-stone-200/60 px-3 py-1.5 text-stone-700 dark:bg-gray-700 dark:text-gray-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </SectionCard>

          {/* 경력 & 교육 */}
          <SectionCard title="경력 & 교육" icon="💼">
            {/* 유리프트 경험 */}
            <ExperienceCard
              company="유리프트 Product 팀"
              period="2024.07 ~ 현재"
            >
              <div>
                <h4 className="mb-3 font-semibold text-gray-800 dark:text-white">
                  주요 담당 업무
                </h4>

                <ExperienceSubsection
                  title="코딩밸리 서비스 웹페이지 랜딩화 및 고도화"
                  isLink
                  href="https://www.codingvalley.com/"
                >
                  <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
                    <li>
                      강의 무료체험을 위한 무료체험 페이지 구현으로{" "}
                      <strong>사용자 전환율 25% 향상</strong>
                    </li>
                    <li>
                      <strong>마케팅 전략 및 기획</strong>에 맞는 신규 페이지 및{" "}
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
                      기존 웹페이지를 <strong>웹뷰</strong>로 구현하여 네이티브
                      앱에서도 동일한 서비스 제공
                    </li>
                    <li>
                      <strong>고객 인바운드를 반영</strong>한 코딩밸리 서비스 UI
                      개선
                    </li>
                  </ul>
                </ExperienceSubsection>

                <ExperienceSubsection title="코딩밸리 PC 웹앱 전환 프로젝트">
                  <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
                    <li>
                      기존 네이티브 앱 내 강의, 커뮤니티 기능을{" "}
                      <strong>웹앱</strong>으로 구현
                    </li>
                    <li>
                      <strong>크로스 플랫폼</strong> 지원으로 사용자 접근성 확대
                    </li>
                    <li>반응형 디자인 적용으로 다양한 디바이스 환경 지원</li>
                  </ul>
                </ExperienceSubsection>
              </div>

              <TechStack
                techStack={[
                  "Next.js",
                  "TypeScript",
                  "tailwindcss",
                  "firebase",
                  "hygraph(graphQL)",
                  "playwright",
                  "Vercel",
                ]}
              />
            </ExperienceCard>

            {/* 프로그래머스 경험 */}
            <ExperienceCard
              company="프로그래머스 프론트엔드 데브코스"
              period="2023.09 ~ 2024.03"
            >
              <div>
                <h4 className="mb-3 font-semibold text-gray-800 dark:text-white">
                  주요 활동 및 성과
                </h4>

                <ExperienceSubsection title="팀 프로젝트 리더십">
                  <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
                    <li>
                      <strong>3개의 팀 프로젝트에서 팀장 역할 수행</strong>{" "}
                      (AlgoBaro, Styled, Notion 클로닝)
                    </li>
                    <li>
                      Git Flow 기반 브랜치 전략 수립으로 팀 개발 프로세스 표준화
                    </li>
                    <li>코드 리뷰 문화 정착 및 팀 협업 효율성 향상</li>
                  </ul>
                </ExperienceSubsection>

                <ExperienceSubsection title="기술 스터디 및 지식 공유">
                  <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
                    <li>TypeScript 스터디 진행 및 딥다이브 발표</li>
                    <li>
                      &ldquo;개발관계론&rdquo; 발표를 통한 팀 커뮤니케이션 개선
                    </li>
                    <li>UI 컴포넌트 라이브러리 개발 및 문서화</li>
                  </ul>
                </ExperienceSubsection>
              </div>
            </ExperienceCard>
          </SectionCard>

          {/* 핵심 프로젝트 */}
          <SectionCard title="핵심 프로젝트" icon="🚀">
            <div className="flex flex-col gap-12">
              {projects.map((project, index) => (
                <ProjectCard key={index} {...project} />
              ))}
            </div>
          </SectionCard>

          {/* 자격증 & 수상 이력 */}
          <SectionCard title="자격증 & 수상 이력" icon="🏆">
            <CertificationGrid certifications={certifications} />
          </SectionCard>

          {/* 학력 */}
          <SectionCard title="학력" icon="🎓">
            <div className="rounded-lg bg-sky-50/70 p-4 shadow-sm dark:bg-blue-900/20">
              <h4 className="mb-2 font-semibold text-sky-800 dark:text-blue-300">
                {education.school}
              </h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {education.major}
              </p>
            </div>
          </SectionCard>

          {/* 연락처 */}
          <SectionCard title="Contact" icon="📞">
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
                href="mailto:harry960629@naver.com"
                className="inline-flex items-center gap-2 text-gray-800 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
              >
                <Mail size={20} />
                Email
              </Link>
            </div>
          </SectionCard>
        </section>
      </div>
    </main>
  );
}
