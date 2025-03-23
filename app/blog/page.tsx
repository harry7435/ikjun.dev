// app/page.tsx
import { compareDesc } from "date-fns";
import { allPosts } from "contentlayer/generated";
import PostCard from "./components/post-card";

export default function BlogPage() {
  const posts = allPosts.sort((a, b) =>
    compareDesc(new Date(a.date), new Date(b.date))
  );

  return (
    <main className="dark:bg-gray-900">
      <div className="container mx-auto px-6 py-12 pt-24">
        <div className="mx-auto max-w-xl py-8">
          <h1 className="mb-8 text-center text-2xl font-black">블로그 홈</h1>
          {posts.map((post, idx) => (
            <PostCard
              key={idx}
              href={post.url}
              title={post.title}
              postDate={post.date}
              // description={post.body.html}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
