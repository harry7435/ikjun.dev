import TrackedExternalLink from "./analytics/TrackedExternalLink";

const SOCIAL_LINKS = [
  { label: "GitHub", href: "https://github.com/harry7435" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/ik-jun-cho-998292212/" },
  { label: "Velog", href: "https://velog.io/@harry7435" },
] as const;

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="container mx-auto p-6">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <p className="mb-4 text-sm text-gray-500 dark:text-gray-400 md:mb-0">
            © 2025 All Right ikjun.dev
          </p>
          <div className="flex space-x-5">
            {SOCIAL_LINKS.map((link) => (
              <TrackedExternalLink
                key={link.label}
                href={link.href}
                label={link.label}
                surface="footer_social"
                className="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
              >
                {link.label}
              </TrackedExternalLink>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
