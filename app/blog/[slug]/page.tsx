import { format, parseISO } from "date-fns";
import Link from "next/link";
import { getAllPosts, getPostBySlug } from "@/lib/notion";
import { notFound } from "next/navigation";
import MarkdownRenderer from "./components/MarkdownRenderer";

export const revalidate = 0;

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const content = await getPostBySlug(slug);

  if (!content) return { title: "Post Not Found" };

  return { title: content.title };
}

export default async function BlogPostDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const postContent = await getPostBySlug(slug);

  if (!postContent) notFound();

  const category = postContent.category;

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
    <main className="min-h-screen bg-stone-100 text-stone-700 dark:bg-gray-900 dark:text-white">
      <div className="container mx-auto px-6 py-12 pt-16">
        <article className="mx-auto max-w-4xl py-8">
          {/* 뒤로가기 버튼 */}
          <div className="mb-6">
            <Link
              href="/blog"
              className="inline-flex items-center text-sm text-stone-600 transition-colors hover:text-stone-800 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ← 블로그 목록으로 돌아가기
            </Link>
          </div>

          {/* 헤더 */}
          <header className="mb-8 text-center">
            <div className="mb-4 flex items-center justify-center gap-3">
              <span
                className={`rounded-full px-3 py-1 text-sm font-medium ${categoryConfig[category].color}`}
              >
                {categoryConfig[category].label}
              </span>
              <time className="text-sm text-stone-600 dark:text-gray-400">
                {format(parseISO(postContent.date), "LLLL d, yyyy")}
              </time>
            </div>

            <h1 className="mb-3 text-3xl font-bold">{postContent.title}</h1>

            {postContent.subtitle && (
              <p className="mx-auto max-w-2xl text-lg text-stone-600 dark:text-gray-400">
                {postContent.subtitle}
              </p>
            )}

            {/* 태그 */}
            {postContent.tags && postContent.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {postContent.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-stone-200 px-3 py-1 text-sm text-stone-700 dark:bg-gray-700 dark:text-gray-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* 본문 */}
          <div className="border-t border-stone-200 pt-8 dark:border-gray-700">
            <MarkdownRenderer content={postContent.content} />
          </div>

          {/* 푸터 */}
          <footer className="mt-12 border-t border-stone-200 pt-8 dark:border-gray-700">
            <div className="text-center">
              <Link
                href="/blog"
                className="inline-flex items-center rounded-lg bg-amber-500 px-4 py-2 text-white transition-colors hover:bg-amber-600"
              >
                더 많은 글 보기
              </Link>
            </div>
          </footer>
        </article>
      </div>
    </main>
  );
}
