import { Fragment } from "react";
import ReactMarkdown from "react-markdown";

interface Props {
  children: string;
}

/**
 * **굵게**와 [링크](url)만 렌더하는 인라인 마크다운.
 * 문단은 <p>로 감싸지 않고 Fragment로 풀어, 부모 요소(li/span 등) 안에 그대로 들어간다.
 * HTML은 해석하지 않는다.
 */
export default function InlineMarkdown({ children }: Props) {
  return (
    <ReactMarkdown
      allowedElements={["p", "strong", "a"]}
      unwrapDisallowed
      components={{
        p: ({ children }) => <Fragment>{children}</Fragment>,
        strong: ({ children }) => (
          <strong className="font-semibold text-gray-900 dark:text-white">
            {children}
          </strong>
        ),
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-amber-700 underline decoration-amber-500/60 underline-offset-2 transition-colors hover:text-amber-600 dark:text-amber-300 dark:hover:text-amber-200"
          >
            {children}
          </a>
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
