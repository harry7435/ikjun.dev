interface CategoryFilterProps {
  selectedCategory: "all" | "posts" | "notes";
  onCategoryChange: (category: "all" | "posts" | "notes") => void;
  stats: {
    all: number;
    posts: number;
    notes: number;
  };
}

export default function CategoryFilter({
  selectedCategory,
  onCategoryChange,
  stats,
}: CategoryFilterProps) {
  const categories = [
    { key: "all", label: "전체", count: stats.all },
    { key: "posts", label: "블로그", count: stats.posts },
    { key: "notes", label: "노트", count: stats.notes },
  ] as const;

  return (
    <div className="mb-8">
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map(({ key, label, count }) => {
          const isSelected = selectedCategory === key;
          return (
            <button
              key={key}
              onClick={() => onCategoryChange(key)}
              className={`
                rounded-full px-4 py-2 text-sm font-medium transition-all duration-200
                ${
                  isSelected
                    ? "scale-105 bg-amber-500 text-white shadow-md"
                    : "bg-stone-200/60 text-stone-700 hover:bg-stone-300/60 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                }
              `}
            >
              {label}
              <span
                className={`
                  ml-1 rounded-full px-1.5 py-0.5 text-xs
                  ${
                    isSelected
                      ? "bg-amber-600 text-amber-100"
                      : "bg-stone-300 text-stone-600 dark:bg-gray-600 dark:text-gray-400"
                  }
                `}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
