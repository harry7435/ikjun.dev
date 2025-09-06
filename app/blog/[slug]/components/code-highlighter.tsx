"use client";

import { useEffect, useRef } from "react";

interface CodeHighlighterProps {
  content: string;
}

export default function CodeHighlighter({ content }: CodeHighlighterProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const highlightCode = async () => {
      if (!contentRef.current) return;

      try {
        // PrismJS 동적 import
        const Prism = (await import("prismjs")).default;

        // 필요한 언어들을 동적으로 로드
        const languageModules = [
          "typescript",
          "javascript",
          "jsx",
          "tsx",
          "bash",
          "json",
          "css",
          "python",
        ];

        const loadLanguageModule = async (lang: string) => {
          try {
            return await import(`prismjs/components/prism-${lang}`);
          } catch (error) {
            console.warn(`Failed to load language: ${lang}`, error);
            return null;
          }
        };

        const languageImports = languageModules.map(loadLanguageModule);

        // 모든 언어 모듈 로드 완료까지 대기 (실패한 것들도 무시)
        await Promise.allSettled(languageImports);

        // 컨테이너 내의 모든 code 블록 하이라이팅
        const codeBlocks = contentRef.current?.querySelectorAll(
          "pre code[class*='language-']"
        );

        if (codeBlocks && codeBlocks.length > 0) {
          codeBlocks.forEach((block) => {
            try {
              // 이미 하이라이팅된 블록은 건너뛰기
              if (!block.querySelector(".token")) {
                Prism.highlightElement(block as HTMLElement);
              }
            } catch (error) {
              console.warn("Failed to highlight code block:", error);
            }
          });
        }
      } catch (error) {
        console.error("Failed to load PrismJS:", error);
      }
    };

    // DOM이 완전히 렌더링된 후 하이라이팅 실행
    const timer = setTimeout(highlightCode, 100);
    return () => clearTimeout(timer);
  }, [content]);

  return (
    <div className="max-w-none">
      <div
        ref={contentRef}
        className="prose prose-lg prose-stone dark:prose-invert
          prose-headings:scroll-m-20 prose-headings:font-bold
          prose-h1:mb-6 prose-h1:mt-8 prose-h1:text-3xl
          prose-h2:mb-4 prose-h2:mt-8 prose-h2:border-b prose-h2:border-stone-200 prose-h2:pb-2 prose-h2:text-2xl prose-h3:mb-3
          prose-h3:mt-6 prose-h3:text-xl prose-h4:mb-2
          prose-h4:mt-4 prose-h4:text-lg prose-p:mb-4
          prose-p:text-base prose-p:leading-7 prose-a:text-blue-600
          prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-4 prose-blockquote:border-blue-500
          prose-blockquote:bg-blue-50 prose-blockquote:py-2 prose-blockquote:pl-4 prose-blockquote:italic prose-strong:font-semibold prose-em:italic prose-code:rounded
          prose-code:bg-stone-100 prose-code:px-1 prose-code:py-0.5 prose-code:text-sm prose-code:before:content-none prose-code:after:content-none prose-pre:overflow-x-auto prose-pre:rounded-lg
          prose-pre:bg-gray-900 prose-pre:p-4 prose-pre:text-sm prose-ol:mb-4 prose-ol:list-decimal
          prose-ol:pl-6 prose-ul:mb-4 prose-ul:list-disc
          prose-ul:pl-6 prose-li:mb-1 prose-table:w-full
          prose-table:border-collapse
          prose-thead:bg-stone-50
          prose-th:border
          prose-th:border-stone-200 prose-th:px-4 prose-th:py-2
          prose-th:text-left prose-th:font-semibold
          prose-td:border prose-td:border-stone-200
          prose-td:px-4 prose-td:py-2 prose-img:rounded-lg prose-img:shadow-md prose-hr:my-8 prose-hr:border-stone-200 dark:prose-h2:border-gray-700
          dark:prose-a:text-blue-400 dark:prose-blockquote:bg-blue-900/20 dark:prose-code:bg-gray-800 dark:prose-thead:bg-gray-800 dark:prose-th:border-gray-700
          dark:prose-td:border-gray-700 dark:prose-hr:border-gray-700"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}
