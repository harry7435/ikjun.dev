"use client";

import ReactMarkdown from "react-markdown";
import SectionHeading from "./SectionHeading";
import { TypingText } from "./TypingText";
import { brandingStatement, shortBio } from "../data/about-data";

export default function AboutSection() {
  return (
    <section id="about" className="mb-24 scroll-mt-20 lg:mb-36">
      <SectionHeading label="About" />

      <p className="mb-8 text-sm font-medium leading-relaxed text-amber-700 dark:text-amber-300">
        <TypingText text={brandingStatement} />
      </p>

      <div className="space-y-4 text-base leading-7 text-gray-700 dark:text-gray-300">
        {shortBio.map((paragraph, i) => (
          <ReactMarkdown
            key={i}
            components={{
              p: ({ ...props }) => <p {...props} />,
              strong: ({ ...props }) => (
                <strong
                  className="font-semibold text-gray-900 dark:text-white"
                  {...props}
                />
              ),
              a: ({ ...props }) => (
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-amber-700 underline decoration-amber-500/60 underline-offset-2 transition-colors hover:text-amber-600 dark:text-amber-300 dark:hover:text-amber-200"
                  {...props}
                />
              ),
            }}
          >
            {paragraph}
          </ReactMarkdown>
        ))}
      </div>
    </section>
  );
}
