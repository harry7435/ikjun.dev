import { format, parseISO } from "date-fns";
import Link from "next/link";
import { getAllPosts, getPostBySlug } from "@/lib/notion";
import { notFound } from "next/navigation";
import MarkdownRenderer from "./components/MarkdownRenderer";
import PostCard from "../components/PostCard";
import type { NotionPost } from "@/lib/types/notion";

export const revalidate = 3600;

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

function getRecentPosts(
  currentPost: NotionPost,
  allPosts: NotionPost[],
  limit: number = 3
): NotionPost[] {
  return allPosts
    .filter((post) => post.slug !== currentPost.slug)
    .slice(0, limit);
}

export default async function BlogPostDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const postContent = await getPostBySlug(slug);

  if (!postContent) notFound();

  // 최신 글 가져오기
  const allPosts = await getAllPosts();
  const recentPosts = getRecentPosts(postContent, allPosts, 3);

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
              ← 목록으로
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
          <MarkdownRenderer content={postContent.content} />
        </article>

        {/* 최신 글 */}
        {recentPosts.length > 0 && (
          <section className="mx-auto mt-16 max-w-4xl">
            <h2 className="mb-6 text-2xl font-bold text-stone-800 dark:text-gray-200">
              다른 포스트
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {recentPosts.map((post) => (
                <PostCard
                  key={post.slug}
                  href={post.url}
                  title={post.title}
                  postDate={post.date}
                  subtitle={post.subtitle}
                  category={post.category}
                  tags={post.tags}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
