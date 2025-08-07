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
      <div className="group flex flex-col rounded-lg border border-stone-300/40 bg-stone-200/60 p-6 shadow-sm backdrop-blur-sm transition-[transform,shadow] hover:translate-y-[-2px] hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:shadow-gray-900/30 dark:hover:shadow-lg dark:hover:shadow-gray-700/30">
        <p className="flex items-center text-amber-600 transition-colors group-hover:text-amber-700 dark:group-hover:text-amber-400">
          {title}
        </p>
        <span className="mt-2 block text-xs text-stone-600">
          {format(parseISO(postDate), "LLLL d, yyyy")}
        </span>
        {subtitle && (
          <div
            className="mt-3 max-h-[69px] overflow-hidden text-ellipsis text-stone-600 dark:text-gray-300"
            dangerouslySetInnerHTML={{ __html: subtitle }}
          />
        )}
      </div>
    </Link>
  );
}
