import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

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
          <div className="rounded-lg border border-gray-100 bg-white p-6 shadow transition-all hover:translate-y-[-2px] hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:shadow-gray-900/30 dark:hover:shadow-lg dark:hover:shadow-gray-700/30">
            <h3 className="mb-3 text-xl font-semibold text-gray-800 dark:text-white">
              About
            </h3>
            <p className="mb-4 text-gray-600 dark:text-gray-300">
              제가 궁금하신가요?
            </p>
            <Link
              href="/about"
              className="inline-flex items-center text-blue-500 transition-colors hover:text-blue-600 dark:hover:text-blue-400"
            >
              프로필 보기 <FiArrowRight className="ml-1 size-4" />
            </Link>
          </div>

          <div className="rounded-lg border border-gray-100 bg-white p-6 shadow transition-all hover:translate-y-[-2px] hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:shadow-gray-900/30 dark:hover:shadow-lg dark:hover:shadow-gray-700/30">
            <h3 className="mb-3 text-xl font-semibold text-gray-800 dark:text-white">
              Blog
            </h3>
            <p className="mb-4 text-gray-600 dark:text-gray-300">
              개발, 취미 등 제 경험을 보고 싶다면
            </p>
            <Link
              href="/blog"
              className="inline-flex items-center text-blue-500 transition-colors hover:text-blue-600 dark:hover:text-blue-400"
            >
              글 보러가기 <FiArrowRight className="ml-1 size-4" />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
