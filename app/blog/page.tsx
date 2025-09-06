"use client";

import { compareDesc } from "date-fns";
import { allPosts, allNotes } from "contentlayer/generated";
import { useState } from "react";
import PostCard from "./components/post-card";
import CategoryFilter from "./components/category-filter";

type CategoryType = "all" | "posts" | "notes";

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>("all");

  // Posts와 Notes를 통합
  const allContent = [
    ...allPosts.map((post) => ({ ...post, category: "posts" as const })),
    ...allNotes.map((note) => ({ ...note, category: "notes" as const })),
  ].sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)));

  // 카테고리에 따른 필터링
  const filteredContent =
    selectedCategory === "all"
      ? allContent
      : allContent.filter((item) => item.category === selectedCategory);

  const categoryStats = {
    all: allContent.length,
    posts: allPosts.length,
    notes: allNotes.length,
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

          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            stats={categoryStats}
          />

          <div className="flex flex-col gap-y-6">
            {filteredContent.length > 0 ? (
              filteredContent.map((item, idx) => (
                <PostCard
                  key={`${item.category}-${idx}`}
                  href={item.url}
                  title={item.title || "제목 없음"}
                  postDate={item.date}
                  subtitle={"subtitle" in item ? item.subtitle : undefined}
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
        </div>
      </div>
    </main>
  );
}
