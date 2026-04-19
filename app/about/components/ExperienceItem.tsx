import { FaExternalLinkAlt } from "react-icons/fa";
import type { Experience } from "../data/about-data";

interface Props {
  experience: Experience;
}

export default function ExperienceItem({ experience }: Props) {
  return (
    <li className="group relative -mx-4 flex flex-col gap-4 rounded-lg border border-transparent px-4 py-6 transition-all duration-200 hover:border-gray-200 hover:bg-white/70 hover:shadow-[0_10px_30px_-12px_rgb(0_0_0/0.15)] dark:hover:border-gray-700/70 dark:hover:bg-gray-900/50 dark:hover:shadow-[0_10px_30px_-10px_rgb(0_0_0/0.6)] sm:flex-row sm:gap-6">
      <div className="sm:w-36 sm:flex-none sm:pt-1">
        <p className="font-mono text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
          {experience.period}
        </p>
      </div>

      <div className="flex-1">
        <h3 className="text-base font-semibold text-gray-900 transition-colors group-hover:text-amber-700 dark:text-white dark:group-hover:text-amber-300">
          {experience.role}{" "}
          <span className="text-gray-600 dark:text-gray-400">·</span>{" "}
          <span className="font-medium text-gray-700 dark:text-gray-200">
            {experience.company}
          </span>
        </h3>

        <div className="mt-4 space-y-5">
          {experience.subsections.map((sub) => (
            <div key={sub.title}>
              <h4 className="flex flex-wrap items-baseline gap-x-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
                {sub.title}
                {sub.link && (
                  <a
                    href={sub.link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 underline decoration-amber-500/60 underline-offset-2 transition-colors hover:text-amber-600 dark:text-amber-300 dark:hover:text-amber-200"
                  >
                    {sub.link.label}
                    <FaExternalLinkAlt className="size-2.5" />
                  </a>
                )}
              </h4>
              <ul className="mt-2 space-y-1.5 text-sm leading-6 text-gray-700 dark:text-gray-300">
                {sub.bullets.map((bullet, i) => (
                  <li key={i} className="flex gap-2">
                    <span
                      className="mt-2 block size-1 flex-none rounded-full bg-amber-500 dark:bg-amber-400"
                      aria-hidden
                    />
                    <span
                      dangerouslySetInnerHTML={{ __html: bullet }}
                      className="[&_strong]:font-semibold [&_strong]:text-gray-900 dark:[&_strong]:text-white"
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {experience.techStack && (
          <ul className="mt-5 flex flex-wrap gap-1.5">
            {experience.techStack.map((tech) => (
              <li
                key={tech}
                className="rounded-full bg-amber-100/70 px-2.5 py-0.5 font-mono text-[11px] text-amber-800 dark:bg-amber-900/30 dark:text-amber-200"
              >
                {tech}
              </li>
            ))}
          </ul>
        )}
      </div>
    </li>
  );
}
