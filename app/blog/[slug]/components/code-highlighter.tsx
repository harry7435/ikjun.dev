"use client";

import { useEffect } from "react";
import "prismjs/themes/prism-tomorrow.css"; // 테마 스타일
import Prism from "prismjs"; // PrismJS 라이브러리

interface CodeHighlighterProps {
  content: string;
}

export default function CodeHighlighter({ content }: CodeHighlighterProps) {
  useEffect(() => {
    // 하이라이팅 적용
    Prism.highlightAll();
  }, [content]); // content가 변경될 때마다 다시 하이라이팅

  return (
    <div
      className={`prose prose-lg max-w-none dark:prose-invert`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
