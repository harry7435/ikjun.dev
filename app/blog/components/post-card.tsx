import { format, parseISO } from "date-fns";
import Link from "next/link";

interface PostCardProps {
  href: string;
  title: string;
  postDate: string;
  subtitle?: string;
  category?: "posts" | "notes";
  tags?: string[];
}

export default function PostCard({
  href,
  title,
  postDate,
  subtitle,
  category,
  tags = [],
}: PostCardProps) {
  const categoryConfig = {
    posts: {
      label: "블로그",
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    },
    notes: {
      label: "노트",
      color:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    },
  };

  return (
    <Link href={href}>
      <article className="group flex flex-col rounded-lg border border-stone-300/40 bg-stone-200/60 p-6 shadow-sm backdrop-blur-sm transition-[transform,shadow] hover:translate-y-[-2px] hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:shadow-gray-900/30 dark:hover:shadow-lg dark:hover:shadow-gray-700/30">
        {/* 카테고리와 날짜 */}
        <div className="mb-3 flex items-center justify-between">
          {category && (
            <span
              className={`
                rounded-full px-2 py-1 text-xs font-medium
                ${categoryConfig[category].color}
              `}
            >
              {categoryConfig[category].label}
            </span>
          )}
          <time className="text-xs text-stone-600 dark:text-gray-400">
            {format(parseISO(postDate), "LLLL d, yyyy")}
          </time>
        </div>

        {/* 제목 */}
        <h2 className="mb-2 text-lg font-semibold text-amber-600 transition-colors group-hover:text-amber-700 dark:group-hover:text-amber-400">
          {title}
        </h2>

        {/* 부제목 */}
        {subtitle && (
          <div
            className="mb-3 line-clamp-3 text-sm text-stone-600 dark:text-gray-300"
            dangerouslySetInnerHTML={{ __html: subtitle }}
          />
        )}

        {/* 태그 */}
        {tags.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-1">
            {tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="rounded bg-stone-300/50 px-2 py-1 text-xs text-stone-600 dark:bg-gray-700 dark:text-gray-400"
              >
                #{tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="px-2 py-1 text-xs text-stone-500 dark:text-gray-500">
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}
      </article>
    </Link>
  );
}
