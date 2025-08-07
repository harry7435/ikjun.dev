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
      <div className="rounded-lg border border-stone-300/40 bg-stone-200/60 p-6 shadow-sm backdrop-blur-sm transition-[transform,shadow] hover:translate-y-[-2px] hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:shadow-gray-900/30 dark:hover:shadow-lg dark:hover:shadow-gray-700/30">
        <h3 className="mb-3 text-xl font-semibold text-stone-700 dark:text-white">
          {title}
        </h3>
        <p className="mb-4 text-stone-600 dark:text-gray-300">{description}</p>
        <span className="inline-flex items-center text-amber-600 transition-colors hover:text-amber-700 dark:hover:text-amber-400">
          {linkText} <FiArrowRight className="ml-1 size-4" />
        </span>
      </div>
    </Link>
  );
}
