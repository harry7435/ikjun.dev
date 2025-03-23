import Link from "next/link";
import ThemeToggle from "./dark-mode-button";

export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-10 bg-white/80 shadow-sm backdrop-blur-md dark:bg-gray-800/80">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="text-xl font-bold text-gray-800 dark:text-white"
        >
          ikjun.dev
        </Link>
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
  );
}
