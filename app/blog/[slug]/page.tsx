import { format, parseISO } from "date-fns";
import { allPosts } from "contentlayer/generated";

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
            <h1 className="text-3xl font-bold">{post.title}</h1>
          </div>
          <div
            className="prose prose-lg max-w-none dark:prose-invert
              prose-headings:font-bold prose-headings:text-gray-900 prose-h2:text-2xl
              prose-h3:text-xl prose-p:text-gray-700
              prose-a:text-blue-600 prose-a:no-underline
              hover:prose-a:underline prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4
              prose-blockquote:italic prose-code:rounded prose-code:bg-gray-100 prose-code:px-1 prose-code:text-pink-500
              prose-pre:rounded prose-pre:bg-gray-100 prose-pre:p-4 prose-ol:list-decimal
              prose-ul:list-disc prose-img:mx-auto
              prose-img:rounded-lg dark:prose-headings:text-gray-100 dark:prose-p:text-gray-300 dark:prose-a:text-blue-400
              dark:prose-code:bg-gray-800 dark:prose-pre:bg-gray-800 [&>*:last-child]:mb-0 [&>*]:mb-3"
            dangerouslySetInnerHTML={{ __html: post.body.html }}
          />
        </article>
      </div>
    </main>
  );
}
