import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

interface CardLinkProps {
  href: string;
  title: string;
  description: string;
  linkText: string;
}

export default function CardLink({
  href,
  title,
  description,
  linkText,
}: CardLinkProps) {
  return (
    <Link href={href}>
      <div className="rounded-lg border border-gray-100 bg-white p-6 shadow transition-[transform,shadow] hover:translate-y-[-2px] hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:shadow-gray-900/30 dark:hover:shadow-lg dark:hover:shadow-gray-700/30">
        <h3 className="mb-3 text-xl font-semibold text-gray-800 dark:text-white">
          {title}
        </h3>
        <p className="mb-4 text-gray-600 dark:text-gray-300">{description}</p>
        <span className="inline-flex items-center text-blue-500 transition-colors hover:text-blue-600 dark:hover:text-blue-400">
          {linkText} <FiArrowRight className="ml-1 size-4" />
        </span>
      </div>
    </Link>
  );
}
