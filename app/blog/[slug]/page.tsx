import { format, parseISO } from "date-fns";
import { allPosts } from "contentlayer/generated";
import CodeHighlighter from "./components/code-highlighter";

export const generateStaticParams = async () =>
  allPosts.map((post) => ({ slug: post._raw.flattenedPath }));

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const post = allPosts.find((post) => post._raw.flattenedPath === slug);
  if (!post) throw new Error(`Post not found for slug: ${slug}`);
  return { title: post.title };
};

export default async function BlogPostDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = allPosts.find((post) => post._raw.flattenedPath === slug);
  if (!post) throw new Error(`Post not found for slug: ${slug}`);

  return (
    <main className="text-gray-800 dark:bg-gray-900 dark:text-white">
      <div className="container mx-auto px-6 py-12 pt-16">
        <article className="mx-auto max-w-3xl py-8">
          <div className="mb-8 text-center">
            <p className="mb-1 text-xs text-gray-600">
              {format(parseISO(post.date), "LLLL d, yyyy")}
            </p>
            <h1 className="mt-2 text-3xl font-bold">{post.title}</h1>
          </div>
          <CodeHighlighter content={post.body.html} />
        </article>
      </div>
    </main>
  );
}
