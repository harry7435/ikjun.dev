/** 목록/카드 렌더에 필요한 메타데이터. 본문 마크다운을 포함하지 않는다. */
export interface NotionPostMeta {
  id: string;
  title: string;
  subtitle?: string;
  date: string;
  tags: string[];
  category: "posts" | "notes";
  url: string;
  slug: string;
}

/** 상세 페이지용. 메타데이터 + 본문 마크다운. */
export interface NotionPost extends NotionPostMeta {
  content: string;
}

export interface NotionDatabaseProperties {
  Title: { title: Array<{ plain_text: string }> };
  Date: { date: { start: string } | null };
  Subtitle?: { rich_text: Array<{ plain_text: string }> };
  Tags: { multi_select: Array<{ name: string }> };
  Category: { select: { name: string } | null };
  Status: { status: { name: string } | null };
  Slug: { rich_text: Array<{ plain_text: string }> };
}
