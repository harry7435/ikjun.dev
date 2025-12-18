import { Client } from "@notionhq/client";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { NotionToMarkdown } from "notion-to-md";
import type { NotionPost, NotionDatabaseProperties } from "./types/notion";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const n2m = new NotionToMarkdown({ notionClient: notion });

export async function getAllPosts(): Promise<NotionPost[]> {
  const databaseId = process.env.NOTION_DATABASE_ID;

  if (!databaseId) {
    throw new Error("NOTION_DATABASE_ID is not defined");
  }

  const response = await notion.dataSources.query({
    data_source_id: databaseId,
    filter: {
      property: "Status",
      status: {
        equals: "Published",
      },
    },
    sorts: [
      {
        property: "Date",
        direction: "descending",
      },
    ],
  });

  const posts = await Promise.all(
    response.results
      .filter((page): page is PageObjectResponse => "properties" in page)
      .map(async (page) => {
        return await getPostFromPage(page);
      })
  );

  return posts;
}

export async function getPostBySlug(slug: string): Promise<NotionPost | null> {
  // 모든 포스트를 가져와서 슬러그 매칭
  // (자동 생성된 슬러그는 DB 쿼리로 찾을 수 없으므로)
  const allPosts = await getAllPosts();
  const decodedSlug = decodeURIComponent(slug);
  return (
    allPosts.find(
      (post) =>
        post.slug === decodedSlug ||
        decodeURIComponent(post.slug) === decodedSlug
    ) || null
  );
}

function generateSlugFromTitle(title: string): string {
  return (
    title
      .toLowerCase()
      .trim()
      // 특수문자 제거 (알파벳, 숫자, 한글, 공백, 하이픈만 남김)
      .replace(/[^\w\s가-힣-]/g, "")
      // 공백을 하이픈으로 변경
      .replace(/\s+/g, "-")
      // 연속된 하이픈을 하나로
      .replace(/-+/g, "-")
      // 앞뒤 하이픈 제거
      .replace(/^-+|-+$/g, "")
  );
}

async function getPostFromPage(page: PageObjectResponse): Promise<NotionPost> {
  const properties = page.properties as unknown as NotionDatabaseProperties;

  // Extract properties
  const title = properties.Title?.title?.[0]?.plain_text || "Untitled";

  const subtitle = properties.Subtitle?.rich_text?.[0]?.plain_text || undefined;

  const date = properties.Date?.date?.start || new Date().toISOString();

  const tags = properties.Tags?.multi_select?.map((tag) => tag.name) || [];

  const category =
    (properties.Category?.select?.name?.toLowerCase() as "posts" | "notes") ||
    "posts";

  // Slug: 수동 입력이 있으면 사용, 없으면 제목에서 자동 생성
  const manualSlug = properties.Slug?.rich_text?.[0]?.plain_text?.trim();
  const slug = manualSlug || generateSlugFromTitle(title);

  // Get page content as markdown
  const mdBlocks = await n2m.pageToMarkdown(page.id);
  const content = n2m.toMarkdownString(mdBlocks).parent;

  return {
    id: page.id,
    title,
    subtitle,
    date,
    tags,
    category,
    slug,
    url: `/blog/${slug}`,
    content,
  };
}

export async function getPostsByCategory(
  category: "posts" | "notes"
): Promise<NotionPost[]> {
  const allPosts = await getAllPosts();
  return allPosts.filter((post) => post.category === category);
}
