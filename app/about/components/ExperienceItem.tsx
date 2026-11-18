"use client";

import { FaExternalLinkAlt } from "react-icons/fa";
import type { Experience } from "@/content/types";
import TiltCard from "./effects/TiltCard";
import HoverTag from "./effects/HoverTag";
import InlineMarkdown from "./InlineMarkdown";

interface Props {
  experience: Experience;
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="mt-2 space-y-1.5 text-sm leading-6 text-gray-700 dark:text-gray-300">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2">
          <span
            className="mt-2 block size-1 flex-none rounded-full bg-amber-500 dark:bg-amber-400"
            aria-hidden
          />
          <span>
            <InlineMarkdown>{item}</InlineMarkdown>
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function ExperienceItem({ experience }: Props) {
  return (
    <li className="list-none">
      <TiltCard
        max={5}
        className="group relative -mx-4 flex flex-col gap-4 rounded-lg border border-transparent px-4 py-6 transition-all duration-200 hover:border-gray-200 hover:bg-white/70 hover:shadow-[0_10px_30px_-12px_rgb(0_0_0/0.15)] dark:hover:border-gray-700/70 dark:hover:bg-gray-900/50 dark:hover:shadow-[0_10px_30px_-10px_rgb(0_0_0/0.6)] sm:flex-row sm:gap-6"
      >
        <div className="sm:w-20 sm:flex-none sm:pt-1">
          <p className="font-mono text-xs uppercase leading-relaxed tracking-wider text-gray-500 dark:text-gray-400">
            {experience.period}
          </p>
        </div>

        <div className="flex-1">
          <h3 className="flex flex-wrap items-baseline gap-x-2 text-base font-semibold text-gray-900 transition-colors group-hover:text-amber-700 dark:text-white dark:group-hover:text-amber-300">
            <span>
              {experience.role}{" "}
              <span className="text-gray-600 dark:text-gray-400">·</span>{" "}
              <span className="font-medium text-gray-700 dark:text-gray-200">
                {experience.company}
              </span>
            </span>
            {experience.link && (
              <a
                href={experience.link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 underline decoration-amber-500/60 underline-offset-2 transition-colors hover:text-amber-600 dark:text-amber-300 dark:hover:text-amber-200"
              >
                {experience.link.label}
                <FaExternalLinkAlt className="size-2.5" />
              </a>
            )}
          </h3>

          <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
            {experience.summary}
          </p>

          <Bullets items={experience.highlights} />

          <h4 className="mt-5 text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">
            일하는 방식
          </h4>
          <Bullets items={experience.ways} />

          <a
            href="#projects"
            className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-amber-700 underline decoration-amber-500/60 underline-offset-2 transition-colors hover:text-amber-600 dark:text-amber-300 dark:hover:text-amber-200"
          >
            실무 사례 보기 ↓
          </a>

          <ul className="mt-5 flex flex-wrap gap-1.5">
            {experience.techStack.map((tech) => (
              <HoverTag
                key={tech}
                className="rounded-full bg-amber-100/70 px-2.5 py-0.5 font-mono text-[11px] text-amber-800 dark:bg-amber-900/30 dark:text-amber-200"
              >
                {tech}
              </HoverTag>
            ))}
          </ul>
        </div>
      </TiltCard>
    </li>
  );
}
