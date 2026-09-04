import { Children, isValidElement } from "react";
import type { ReactElement, ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import SyntaxHighlighter from "react-syntax-highlighter/dist/esm/prism-light";
import oneDark from "react-syntax-highlighter/dist/esm/styles/prism/one-dark";

import bash from "react-syntax-highlighter/dist/esm/languages/prism/bash";
import css from "react-syntax-highlighter/dist/esm/languages/prism/css";
import diff from "react-syntax-highlighter/dist/esm/languages/prism/diff";
import json from "react-syntax-highlighter/dist/esm/languages/prism/json";
import markdown from "react-syntax-highlighter/dist/esm/languages/prism/markdown";
import python from "react-syntax-highlighter/dist/esm/languages/prism/python";
import sql from "react-syntax-highlighter/dist/esm/languages/prism/sql";
import tsx from "react-syntax-highlighter/dist/esm/languages/prism/tsx";
import yaml from "react-syntax-highlighter/dist/esm/languages/prism/yaml";

// prism-light는 등록한 언어만 번들에 포함한다(전체 배럴 import 시 297개 언어가 딸려옴).
// 각 언어 모듈이 의존 언어를 스스로 register 하므로 최상위 언어만 등록하면 된다.
// 예: tsx → jsx · typescript · javascript · clike · markup(html/xml)
// 미등록 언어는 하이라이터 내부 try/catch로 평문 폴백된다.
const LANGUAGES = { bash, css, diff, json, markdown, python, sql, tsx, yaml };

Object.entries(LANGUAGES).forEach(([name, language]) =>
  SyntaxHighlighter.registerLanguage(name, language)
);

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div
      className="prose prose-lg prose-stone mx-auto max-w-none dark:prose-invert
        prose-headings:scroll-m-20 prose-headings:font-bold
        prose-h1:mb-6 prose-h1:mt-8 prose-h1:text-3xl
        prose-h2:mb-4 prose-h2:mt-8 prose-h2:border-b prose-h2:border-stone-200 prose-h2:pb-2 prose-h2:text-2xl
        prose-h3:mb-3 prose-h3:mt-6 prose-h3:text-xl
        prose-h4:mb-2 prose-h4:mt-4 prose-h4:text-lg
        prose-p:mb-4 prose-p:text-base prose-p:leading-7
        prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
        prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:py-2 prose-blockquote:pl-4 prose-blockquote:italic
        prose-strong:font-semibold prose-em:italic
        prose-code:rounded prose-code:bg-stone-100 prose-code:px-1 prose-code:py-0.5 prose-code:text-sm prose-code:font-normal prose-code:before:content-none prose-code:after:content-none
        prose-pre:my-4 prose-pre:bg-transparent prose-pre:p-0
        prose-ol:mb-4
        prose-ol:list-decimal prose-ol:pl-6 prose-ul:mb-4
        prose-ul:list-disc prose-ul:pl-6 prose-li:mb-1
        prose-table:w-full prose-table:border-collapse
        prose-thead:bg-stone-50
        prose-th:border prose-th:border-stone-200 prose-th:px-4 prose-th:py-2 prose-th:text-left prose-th:font-semibold
        prose-td:border prose-td:border-stone-200 prose-td:px-4 prose-td:py-2
        prose-img:rounded-lg
        prose-img:shadow-md prose-hr:my-8
        prose-hr:border-stone-200 dark:prose-h2:border-gray-700
        dark:prose-a:text-blue-400 dark:prose-blockquote:bg-blue-900/20 dark:prose-code:bg-gray-800
        dark:prose-thead:bg-gray-800 dark:prose-th:border-gray-700 dark:prose-td:border-gray-700
        dark:prose-hr:border-gray-700 [&_.syntax-highlighter]:overflow-x-auto"
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // 블록 코드는 전부 여기서 처리한다. `code`를 오버라이드하면 react-markdown이
          // hast 노드를 `node` prop으로 넘겨 `node="[object Object]"`가 DOM에 새어 나가고,
          // 인라인 코드까지 같은 핸들러를 타게 된다.
          pre({ children }) {
            const codeElement = Children.toArray(children).find((child) =>
              isValidElement(child)
            ) as ReactElement<{ className?: string; children?: ReactNode }>;

            const match = /language-(\w+)/.exec(
              codeElement?.props.className ?? ""
            );

            if (match) {
              const codeString = String(
                codeElement.props.children ?? ""
              ).replace(/\n$/, "");

              return (
                <div className="not-prose my-4 w-full overflow-x-auto rounded-lg">
                  <SyntaxHighlighter
                    style={oneDark}
                    language={match[1]}
                    customStyle={{
                      margin: 0,
                      padding: "1rem",
                      borderRadius: "0.5rem",
                      fontSize: "0.875rem",
                      background: "#282c34",
                      overflowX: "auto",
                    }}
                    codeTagProps={{
                      style: {
                        fontFamily:
                          'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
                        lineHeight: "1.7",
                        background: "transparent",
                      },
                    }}
                  >
                    {codeString}
                  </SyntaxHighlighter>
                </div>
              );
            }

            // 언어 표기가 없는 펜스. <pre>를 유지해야 줄바꿈과 들여쓰기가 보존된다
            // (div로 감싸면 white-space가 normal이라 여러 줄이 한 줄로 뭉개진다).
            return (
              <pre className="not-prose my-4 w-full overflow-x-auto rounded-lg bg-[#282c34] p-4 font-mono text-sm leading-[1.7] text-stone-100">
                {children}
              </pre>
            );
          },
          // 넓은 표가 본문 레이아웃을 밀어내지 않도록 표 자체를 가로 스크롤 컨테이너에 가둔다.
          table({ children }) {
            return (
              <div className="my-4 w-full overflow-x-auto">
                <table>{children}</table>
              </div>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
