// app/page.tsx
import { compareDesc } from "date-fns";
import { allPosts } from "contentlayer/generated";
import PostCard from "./components/post-card";

export default function BlogPage() {
  const posts = allPosts.sort((a, b) =>
    compareDesc(new Date(a.date), new Date(b.date))
  );

  return (
    <main className="min-h-screen bg-stone-100 text-stone-700 dark:bg-gray-900 dark:text-white">
      <div className="container mx-auto px-6 py-12 pt-24">
        <div className="mx-auto max-w-3xl py-8">
          <h1 className="mb-8 text-center text-2xl font-black">블로그 홈</h1>
          <div className="flex flex-col gap-y-6">
            {posts.map((post, idx) => (
              <PostCard
                key={idx}
                href={post.url}
                title={post.title}
                postDate={post.date}
                subtitle={post.subtitle}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
