import Link from "next/link";
import { FaExternalLinkAlt } from "react-icons/fa";
import { ReactNode } from "react";

interface ExperienceCardProps {
  company: string;
  period: string;
  children: ReactNode;
}

interface ExperienceSubsectionProps {
  title: string;
  isLink?: boolean;
  href?: string;
  children: ReactNode;
}

export function ExperienceCard({
  company,
  period,
  children,
}: ExperienceCardProps) {
  return (
    <div className="p-6 pt-4 max-md:px-4">
      <div className="flex flex-col gap-8 md:flex-row">
        {/* 왼쪽 고정 열 */}
        <div className="w-full md:sticky md:top-24 md:h-fit md:w-1/4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            {company}
          </h3>
          <p className="mt-2 text-gray-600 dark:text-gray-400">{period}</p>
        </div>

        {/* 오른쪽 스크롤 가능한 열 */}
        <div className="w-full md:w-3/4 md:overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

export function ExperienceSubsection({
  title,
  isLink,
  href,
  children,
}: ExperienceSubsectionProps) {
  const titleElement =
    isLink && href ? (
      <Link
        target="_blank"
        rel="noopener noreferrer"
        href={href}
        className="hover:text-blue-500 dark:hover:text-blue-300"
      >
        {title}
        <FaExternalLinkAlt className="ml-1 inline-block size-3" />
      </Link>
    ) : (
      title
    );

  return (
    <div className="mb-4">
      <h5 className="mb-2 font-medium text-blue-600 dark:text-blue-400">
        {titleElement}
      </h5>
      {children}
    </div>
  );
}

interface TechStackProps {
  techStack: string[];
}

export function TechStack({ techStack }: TechStackProps) {
  return (
    <div>
      <h4 className="mb-3 font-semibold text-gray-800 dark:text-white">
        기술 스택
      </h4>
      <div className="flex flex-wrap gap-2">
        {techStack.map((tech, index) => (
          <span
            key={index}
            className="rounded-lg bg-amber-100/60 px-2 py-1 text-sm text-amber-800 dark:bg-blue-900/30 dark:text-blue-300"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}
