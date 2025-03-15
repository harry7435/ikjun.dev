export default function Footer() {
  return (
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
  );
}
