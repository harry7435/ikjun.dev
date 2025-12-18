"use client";

import { useState } from "react";
import type { NotionPost } from "@/lib/types/notion";
import PostCard from "./PostCard";
import CategoryFilter from "./CategoryFilter";

type CategoryType = "all" | "posts" | "notes";

interface BlogClientProps {
  posts: NotionPost[];
  stats: {
    all: number;
    posts: number;
    notes: number;
  };
}

export default function BlogClient({ posts, stats }: BlogClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>("all");

  const filteredContent =
    selectedCategory === "all"
      ? posts
      : posts.filter((item) => item.category === selectedCategory);

  return (
    <>
      <CategoryFilter
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        stats={stats}
      />

      <div className="flex flex-col gap-y-6">
        {filteredContent.length > 0 ? (
          filteredContent.map((item, idx) => (
            <PostCard
              key={`${item.category}-${idx}`}
              href={item.url}
              title={item.title || "제목 없음"}
              postDate={item.date}
              subtitle={item.subtitle}
              category={item.category}
              tags={item.tags || []}
            />
          ))
        ) : (
          <div className="py-12 text-center text-stone-500 dark:text-gray-400">
            해당 카테고리에 글이 없습니다.
          </div>
        )}
      </div>
    </>
  );
}
