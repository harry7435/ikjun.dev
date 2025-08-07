import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

interface ProjectLink {
  href: string;
  label: string;
}

interface ProjectCardProps {
  title: string;
  description: string;
  period: string;
  links: ProjectLink[];
  whyContent: string;
  howContent: string[];
  resultContent: string[];
  techStack: string[];
}

export function ProjectCard({
  title,
  description,
  period,
  links,
  whyContent,
  howContent,
  resultContent,
  techStack,
}: ProjectCardProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row">
      {/* 왼쪽 고정 열 */}
      <div className="w-full md:sticky md:top-24 md:h-fit md:w-1/4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {period}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {links.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className="inline-flex items-center text-blue-500 transition-colors hover:text-blue-600 dark:hover:text-blue-400"
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.label} <FiArrowRight className="ml-1 size-3" />
            </Link>
          ))}
        </div>
      </div>

      {/* 오른쪽 스크롤 가능한 열 */}
      <div className="w-full md:w-3/4 md:overflow-y-auto">
        <div className="mb-4">
          <h4 className="mb-2 font-semibold text-blue-600 dark:text-blue-400">
            Why - 문제 상황
          </h4>
          <p className="text-gray-700 dark:text-gray-300">{whyContent}</p>
        </div>

        <div className="mb-4">
          <h4 className="mb-2 font-semibold text-green-600 dark:text-green-400">
            How - 해결 방법
          </h4>
          <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
            {howContent.map((item, index) => (
              <li key={index} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <h4 className="mb-2 font-semibold text-purple-600 dark:text-purple-400">
            Result - 성과
          </h4>
          <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
            {resultContent.map((item, index) => (
              <li key={index} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-semibold text-gray-800 dark:text-white">
            사용 기술
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
      </div>
    </div>
  );
}
