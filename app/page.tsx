import CardLink from "./components/card-link";

export default function Home() {
  return (
    <main className="dark:bg-gray-900">
      <div className="container mx-auto px-6 pb-12 pt-24">
        <section className="mb-16">
          <h1 className="mb-6 text-4xl font-bold text-gray-800 dark:text-white md:text-5xl">
            안녕하세요!
            <br className="sm:hidden" />
            <span className="text-blue-500"> Ik Jun</span>입니다.
          </h1>
          <h2 className="max-w-2xl text-xl text-gray-600 dark:text-gray-300">
            사람을 위해, 사람과 함께
            <br className="sm:hidden" /> 성장하는 개발자를 꿈꿉니다.
          </h2>
        </section>

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
