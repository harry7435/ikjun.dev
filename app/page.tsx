import Link from "next/link";
import CardLink from "./components/card-link";
import CourtHero from "./components/court/CourtHero";

export default function Home() {
  return (
    <main className="min-h-screen bg-stone-100 dark:bg-gray-900">
      {/* 히어로: 높이 고정(CLS 0). 코트는 배경, 텍스트·링크는 HTML(LCP 요소). */}
      <section className="relative h-svh min-h-[560px] overflow-hidden">
        <div className="container pointer-events-none relative z-10 mx-auto px-6 pt-24">
          <h1 className="mb-6 text-4xl font-bold text-stone-700 dark:text-white md:text-5xl">
            안녕하세요!
            <br className="sm:hidden" />
            <span className="text-amber-600"> Ik Jun</span>입니다.
          </h1>
          <h2 className="max-w-2xl text-xl text-stone-600 dark:text-gray-300">
            사람을 위해, 사람과 함께
            <br className="sm:hidden" /> 성장하는 개발자를 꿈꿉니다.
          </h2>
          <nav
            aria-label="주요 페이지"
            className="pointer-events-auto mt-6 flex gap-3"
          >
            <Link
              href="/about"
              className="rounded-md bg-amber-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-amber-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
            >
              About
            </Link>
            <Link
              href="/blog"
              className="rounded-md border border-amber-600 px-4 py-2 font-semibold text-amber-700 transition-colors hover:bg-amber-600/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 dark:text-amber-400"
            >
              Blog
            </Link>
          </nav>
        </div>
        <div className="absolute inset-0" id="court-stage">
          <CourtHero />
        </div>
      </section>

      <div className="container mx-auto px-6 py-12">
        <section className="flex flex-col gap-8">
          <CardLink
            href="/about"
            title="About"
            description="제가 궁금하신가요?"
            linkText="프로필 보기"
          />
          <CardLink
            href="/blog"
            title="Blog"
            description="개발, 취미 등 제 경험을 정리 중입니다"
            linkText="블로그 보러가기"
          />
        </section>
      </div>
    </main>
  );
}
