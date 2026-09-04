"use client";

import { useRef, useState } from "react";
import SectionHeading from "./SectionHeading";
import ProjectItem from "./ProjectItem";
import ProjectDetailOverlay, {
  type OverlayState,
} from "./ProjectDetailOverlay";
import { projects } from "../data/about-data";

export default function ProjectsSection() {
  const [overlay, setOverlay] = useState<OverlayState | null>(null);
  // 열 때마다 새 id를 부여해 오버레이가 항상 새 엘리먼트로 마운트되게 한다.
  const openSeq = useRef(0);

  const open = (next: Omit<OverlayState, "id">) => {
    openSeq.current += 1;
    setOverlay({ ...next, id: openSeq.current });
  };

  return (
    <section id="projects" className="mb-24 scroll-mt-20 lg:mb-36">
      <SectionHeading label="Projects" />
      <ol className="space-y-4">
        {projects.map((proj) => (
          <ProjectItem key={proj.title} project={proj} onOpen={open} />
        ))}
      </ol>

      <ProjectDetailOverlay state={overlay} onClose={() => setOverlay(null)} />
    </section>
  );
}
