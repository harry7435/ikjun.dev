import Image from "next/image";
import { FaExternalLinkAlt } from "react-icons/fa";
import type { Project } from "../data/about-data";

interface Props {
  project: Project;
}

export default function ProjectItem({ project }: Props) {
  const primaryLink = project.links[0];
  const hasImage = Boolean(project.image);

  return (
    <li className="group relative -mx-4 grid grid-cols-1 gap-4 rounded-lg border border-transparent px-4 py-6 transition-all duration-200 hover:border-gray-200 hover:bg-white/70 hover:shadow-[0_10px_30px_-12px_rgb(0_0_0/0.15)] dark:hover:border-gray-700/70 dark:hover:bg-gray-900/50 dark:hover:shadow-[0_10px_30px_-10px_rgb(0_0_0/0.6)] sm:grid-cols-12 sm:gap-6">
      {hasImage && (
        <div className="relative sm:col-span-4">
          <div className="relative aspect-video overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
            <Image
              src={project.image!}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, 200px"
            />
          </div>
        </div>
      )}

      <div className={hasImage ? "sm:col-span-8" : "sm:col-span-12"}>
        <h3 className="text-base font-semibold text-gray-900 transition-colors group-hover:text-amber-700 dark:text-white dark:group-hover:text-amber-300">
          {primaryLink ? (
            <a
              href={primaryLink.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5"
            >
              {project.title}
              <FaExternalLinkAlt className="size-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          ) : (
            project.title
          )}
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {project.description}{" "}
          <span className="font-mono">· {project.period}</span>
        </p>

        <p className="mt-3 text-sm leading-6 text-gray-700 dark:text-gray-300">
          {project.whyContent}
        </p>

        <ul className="mt-3 space-y-1.5 text-sm leading-6 text-gray-700 dark:text-gray-300">
          {project.resultContent.slice(0, 2).map((bullet, i) => (
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

        <ul className="mt-4 flex flex-wrap gap-1.5">
          {project.techStack.map((tech) => (
            <li
              key={tech}
              className="rounded-full bg-amber-100/70 px-2.5 py-0.5 font-mono text-[11px] text-amber-800 dark:bg-amber-900/30 dark:text-amber-200"
            >
              {tech}
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}
