"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/content/types";
import TiltCard from "./effects/TiltCard";
import HoverTag from "./effects/HoverTag";
import ChangeSummary from "./ChangeSummary";

interface Props {
  project: Project;
  onOpen: (state: {
    project: Project;
    origin: { x: number; y: number };
  }) => void;
}

export default function ProjectCard({ project, onOpen }: Props) {
  const isSide = project.group === "side";
  const wide = isSide && !!project.wide;

  // 원형 리빌은 클릭 지점에서 퍼진다. clientX/Y는 뷰포트 좌표라
  // 오버레이의 고정 레이어 좌표계와 그대로 맞는다.
  const openFromEvent = (
    e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>
  ) => {
    if ("clientX" in e && e.clientX !== 0) {
      onOpen({ project, origin: { x: e.clientX, y: e.clientY } });
      return;
    }
    // 키보드로 열 때는 클릭 좌표가 없으니 카드 중심에서 퍼지게 한다.
    const rect = e.currentTarget.getBoundingClientRect();
    onOpen({
      project,
      origin: { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 },
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openFromEvent(e);
    }
  };

  const shot = isSide ? project.screenshots?.[0] : undefined;
  const thumb = shot && (
    <div
      className={`relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-900 ${
        wide ? "mx-auto max-w-[220px] sm:max-w-none" : ""
      }`}
    >
      <Image
        src={shot.src}
        alt={shot.alt}
        fill
        sizes={
          wide
            ? "(min-width: 640px) 320px, 220px"
            : "(min-width: 640px) 320px, 90vw"
        }
        className="object-cover object-top"
      />
    </div>
  );

  return (
    <li
      className={`list-none${isSide && project.wide ? " sm:col-span-2" : ""}`}
    >
      <TiltCard
        max={5}
        className="group relative h-full rounded-lg border border-gray-200 bg-white/40 p-4 transition-all duration-200 hover:border-gray-300 hover:bg-white/70 hover:shadow-[0_10px_30px_-12px_rgb(0_0_0/0.15)] dark:border-gray-800 dark:bg-gray-900/20 dark:hover:border-gray-700/70 dark:hover:bg-gray-900/50 dark:hover:shadow-[0_10px_30px_-10px_rgb(0_0_0/0.6)]"
      >
        <div
          role="button"
          tabIndex={0}
          aria-haspopup="dialog"
          aria-label={`${project.title} 프로젝트 상세 보기`}
          onClick={openFromEvent}
          onKeyDown={handleKeyDown}
          className={`h-full cursor-pointer rounded-md ${
            wide ? "grid gap-4 sm:grid-cols-2 sm:gap-6" : "flex flex-col gap-3"
          }  focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-4 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-950`}
        >
          <div className="flex flex-col gap-3">
            {!wide && thumb}
            {isSide && project.users && (
              <p className="flex items-center gap-1.5 text-xs font-medium text-gray-700 dark:text-gray-300">
                <span
                  className="block size-1.5 flex-none rounded-full bg-emerald-500"
                  aria-hidden
                />
                {project.users}
              </p>
            )}

            <div className="flex items-start justify-between gap-2">
              <h4 className="inline-flex items-center gap-1.5 text-base font-semibold text-gray-900 transition-colors group-hover:text-amber-700 dark:text-white dark:group-hover:text-amber-300">
                {project.title}
                <ArrowUpRight className="size-4 flex-none transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </h4>
              {project.tag && (
                <span className="flex-none rounded-full bg-gray-100 px-2 py-0.5 font-mono text-[11px] text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                  {project.tag}
                </span>
              )}
            </div>

            {project.change && <ChangeSummary change={project.change} />}

            {isSide && project.summary && (
              <p className="text-sm leading-6 text-gray-700 dark:text-gray-300">
                {project.summary}
              </p>
            )}

            {!isSide && project.note && (
              <p className="font-mono text-[11px] text-gray-500 dark:text-gray-400">
                {project.note}
              </p>
            )}
          </div>
          <div className={wide ? "flex flex-col gap-3" : "contents"}>
            {wide && thumb}
            {isSide && project.cardPoints && (
              <ul className="space-y-1.5">
                {project.cardPoints.map((point) => (
                  <li
                    key={point}
                    className="flex gap-2 text-[13px] leading-5 text-gray-600 dark:text-gray-400"
                  >
                    <span
                      className="mt-[7px] block size-1 flex-none rounded-full bg-amber-500"
                      aria-hidden
                    />
                    {point}
                  </li>
                ))}
              </ul>
            )}

            {isSide && project.stack && (
              <ul className={`flex flex-wrap gap-1.5 ${wide ? "" : "mt-auto"}`}>
                {project.stack.map((tech) => (
                  <HoverTag
                    key={tech}
                    className="rounded-full bg-amber-100/70 px-2.5 py-0.5 font-mono text-[11px] text-amber-800 dark:bg-amber-900/30 dark:text-amber-200"
                  >
                    {tech}
                  </HoverTag>
                ))}
              </ul>
            )}
          </div>
        </div>
      </TiltCard>
    </li>
  );
}
