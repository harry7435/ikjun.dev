import CardLink from "./components/card-link";
import CourtHero from "./components/court/CourtHero";

export default function Home() {
  return (
    <main className="min-h-screen bg-stone-100 dark:bg-gray-900">
      {/* 기본은 원래 홈(텍스트+카드). court 화면(PC 정밀 포인터·모션 허용)에서만 높이 고정 코트 히어로(CLS 0). */}
      <section className="court:relative court:h-svh court:min-h-[560px] court:overflow-hidden">
        <div className="container pointer-events-none relative z-[1] mx-auto px-6 pb-16 pt-24 court:pb-0">
          <h1 className="mb-6 text-4xl font-bold text-stone-700 dark:text-white md:text-5xl">
            안녕하세요!
            <br className="sm:hidden" />
            <span className="text-amber-600"> Ik Jun</span>입니다.
          </h1>
          <h2 className="max-w-2xl text-xl text-stone-600 dark:text-gray-300">
            매일 쓰이는 서비스를 만들고,
            <br className="sm:hidden" /> 운영합니다.
          </h2>
        </div>
        <div className="absolute inset-0 hidden court:block" id="court-stage">
          <CourtHero />
        </div>
      </section>

      <div className="container mx-auto px-6 pb-12 court:pt-12">
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
