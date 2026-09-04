import { cache } from "react";
import { Client } from "@notionhq/client";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { NotionToMarkdown } from "notion-to-md";
import type {
  NotionPost,
  NotionPostMeta,
  NotionDatabaseProperties,
} from "./types/notion";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const n2m = new NotionToMarkdown({ notionClient: notion });

/**
 * Published 페이지 목록을 Notion에서 가져온다.
 * 렌더 패스 단위로 캐싱되어, 같은 요청 안에서는 몇 번을 불러도 Notion 쿼리는 1회다.
 */
const fetchPublishedPages = cache(async (): Promise<PageObjectResponse[]> => {
  const databaseId = process.env.NOTION_DATABASE_ID;

  if (!databaseId) throw new Error("NOTION_DATABASE_ID is not defined");

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

  return response.results.filter(
    (page): page is PageObjectResponse => "properties" in page
  );
});

/**
 * 목록/카드 렌더용 메타데이터. 본문 블록을 가져오지 않으므로 Notion 호출이 쿼리 1회로 끝난다.
 */
export const getAllPostsMeta = cache(async (): Promise<NotionPostMeta[]> => {
  const pages = await fetchPublishedPages();
  return pages.map(getPostMetaFromPage);
});

/**
 * 상세 페이지용. 슬러그가 일치하는 **한 페이지의 본문만** 마크다운으로 변환한다.
 */
export const getPostBySlug = cache(
  async (slug: string): Promise<NotionPost | null> => {
    const decodedSlug = decodeURIComponent(slug);
    const pages = await fetchPublishedPages();

    const match = pages
      .map((page) => ({ page, meta: getPostMetaFromPage(page) }))
      .find(
        ({ meta }) =>
          meta.slug === decodedSlug ||
          decodeURIComponent(meta.slug) === decodedSlug
      );

    if (!match) return null;

    const mdBlocks = await n2m.pageToMarkdown(match.page.id);
    const content = n2m.toMarkdownString(mdBlocks).parent;

    return { ...match.meta, content };
  }
);

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

function getPostMetaFromPage(page: PageObjectResponse): NotionPostMeta {
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

  return {
    id: page.id,
    title,
    subtitle,
    date,
    tags,
    category,
    slug,
    url: `/blog/${slug}`,
  };
}

export async function getPostsByCategory(
  category: "posts" | "notes"
): Promise<NotionPostMeta[]> {
  const allPosts = await getAllPostsMeta();
  return allPosts.filter((post) => post.category === category);
}
