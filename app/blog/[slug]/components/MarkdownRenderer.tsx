"use client";

import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div
      className="prose prose-lg prose-stone dark:prose-invert
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
        prose-img:rounded-lg
        prose-img:shadow-md prose-hr:my-8
        prose-hr:border-stone-200 dark:prose-h2:border-gray-700
        dark:prose-a:text-blue-400 dark:prose-blockquote:bg-blue-900/20 dark:prose-code:bg-gray-800 dark:prose-hr:border-gray-700 [&_.syntax-highlighter]:overflow-x-auto"
    >
      <ReactMarkdown
        components={{
          pre({ children }) {
            return (
              <div className="not-prose my-4 w-full overflow-x-auto rounded-lg">
                {children}
              </div>
            );
          },
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const codeString = String(children).replace(/\n$/, "");

            if (match) {
              return (
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
              );
            }

            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
