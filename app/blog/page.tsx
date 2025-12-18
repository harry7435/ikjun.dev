import { getAllPosts } from "@/lib/notion";
import BlogClient from "./components/BlogClient";

export const revalidate = 3600; // Revalidate every hour

export default async function BlogPage() {
  const allContent = await getAllPosts();

  const categoryStats = {
    all: allContent.length,
    posts: allContent.filter((item) => item.category === "posts").length,
    notes: allContent.filter((item) => item.category === "notes").length,
  };

  return (
    <main className="min-h-screen bg-stone-100 text-stone-700 dark:bg-gray-900 dark:text-white">
      <div className="container mx-auto px-6 py-12 pt-24">
        <div className="mx-auto max-w-4xl py-8">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-black">블로그 & 노트</h1>
            <p className="text-stone-600 dark:text-gray-400">
              개발 경험과 생각을 기록하는 공간
            </p>
          </div>

          <BlogClient posts={allContent} stats={categoryStats} />
        </div>
      </div>
    </main>
  );
}
