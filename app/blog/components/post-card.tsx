import { format, parseISO } from "date-fns";
import Link from "next/link";

interface CardLinkProps {
  href: string;
  title: string;
  postDate: string;
  subtitle?: string;
}

export default function PostCard({
  href,
  title,
  postDate,
  subtitle,
}: CardLinkProps) {
  return (
    <Link href={href}>
      <div className="group flex flex-col rounded-lg border border-gray-100 bg-white p-6 shadow transition-[transform,shadow] hover:translate-y-[-2px] hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:shadow-gray-900/30 dark:hover:shadow-lg dark:hover:shadow-gray-700/30">
        <p className="flex items-center text-blue-500 transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
          {title}
        </p>
        <span className="mt-2 block text-xs text-gray-600">
          {format(parseISO(postDate), "LLLL d, yyyy")}
        </span>
        {subtitle && (
          <div
            className="mt-3 max-h-[69px] overflow-hidden text-ellipsis text-gray-600 dark:text-gray-300"
            dangerouslySetInnerHTML={{ __html: subtitle }}
          />
        )}
      </div>
    </Link>
  );
}
