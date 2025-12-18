export interface NotionPost {
  id: string;
  title: string;
  subtitle?: string;
  date: string;
  tags: string[];
  category: "posts" | "notes";
  url: string;
  content: string;
  slug: string;
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
