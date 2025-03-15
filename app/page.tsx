import Link from "next/link";
import ThemeToggle from "./components/dark-mode-button";
import { FiArrowRight } from "react-icons/fi";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-800">
      {/* 헤더 네비게이션 */}
      <header className="fixed inset-x-0 top-0 z-10 bg-white shadow-sm dark:bg-gray-800">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="text-xl font-bold text-gray-800 dark:text-white">
            ikjun.dev
          </div>
          <nav>
            <ul className="flex items-center space-x-3 sm:space-x-8">
              <li>
                <Link
                  href="/"
                  className="text-gray-600 transition-colors hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-600 transition-colors hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-gray-600 transition-colors hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400"
                >
                  Blog
                </Link>
              </li>
              <li>
                <ThemeToggle />
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
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

      {/* 푸터 */}
      <footer className="border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="container mx-auto p-6">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <p className="mb-4 text-sm text-gray-500 dark:text-gray-400 md:mb-0">
              © 2025 All Right ikjun.dev
            </p>
            <div className="flex space-x-5">
              <a
                href="https://github.com/harry7435"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
              >
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/ik-jun-cho-998292212/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
              >
                LinkedIn
              </a>
              <a
                href="https://velog.io/@harry7435"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
              >
                Velog
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
