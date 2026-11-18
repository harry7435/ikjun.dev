"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import ProjectCard from "./ProjectCard";
import ProjectDetailOverlay, {
  type OverlayState,
} from "./ProjectDetailOverlay";
import { sideProjects, workProjects } from "@/content/projects";

const GRID = "grid grid-cols-1 gap-4 sm:grid-cols-2";
const SUBHEADING =
  "mb-4 text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400";

export default function ProjectsSection() {
  const [overlay, setOverlay] = useState<OverlayState | null>(null);
  const [expanded, setExpanded] = useState(false);
  const reduced = useReducedMotion();
  // 열 때마다 새 id를 부여해 오버레이가 항상 새 엘리먼트로 마운트되게 한다.
  const openSeq = useRef(0);

  const open = (next: Omit<OverlayState, "id">) => {
    openSeq.current += 1;
    setOverlay({ ...next, id: openSeq.current });
  };

  const featured = workProjects.filter((p) => p.featured);
  const rest = workProjects.filter((p) => !p.featured);

  return (
    <section id="projects" className="mb-24 scroll-mt-20 lg:mb-36">
      <SectionHeading label="Projects" />

      <h3 className={SUBHEADING}>실무 · 유리프트 Product 팀</h3>
      <ol className={GRID}>
        {featured.map((p) => (
          <ProjectCard key={p.slug} project={p} onOpen={open} />
        ))}
      </ol>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="rest"
            id="projects-more"
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={
              reduced
                ? { opacity: 0, transition: { duration: 0 } }
                : { height: 0, opacity: 0 }
            }
            transition={{ duration: reduced ? 0 : 0.25 }}
            className="overflow-hidden"
          >
            {/* overflow-hidden이 카드 그림자를 자르지 않도록 여백을 준다 */}
            <ol className={`${GRID} pt-4`}>
              {rest.map((p) => (
                <ProjectCard key={p.slug} project={p} onOpen={open} />
              ))}
            </ol>
          </motion.div>
        )}
      </AnimatePresence>

      {rest.length > 0 && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-controls="projects-more"
          className="mt-4 rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:border-amber-500 hover:text-amber-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 dark:border-gray-700 dark:text-gray-300 dark:hover:border-amber-400 dark:hover:text-amber-300"
        >
          {expanded ? "접기" : `더 보기 (${rest.length})`}
        </button>
      )}

      <h3 className={`${SUBHEADING} mt-14`}>사이드 프로젝트</h3>
      <ol className={GRID}>
        {sideProjects.map((p) => (
          <ProjectCard key={p.slug} project={p} onOpen={open} />
        ))}
      </ol>

      <ProjectDetailOverlay state={overlay} onClose={() => setOverlay(null)} />
    </section>
  );
}
