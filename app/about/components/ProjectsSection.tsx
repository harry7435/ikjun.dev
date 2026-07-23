"use client";

import { useState } from "react";
import SectionHeading from "./SectionHeading";
import ProjectItem from "./ProjectItem";
import ProjectDetailOverlay, { type OverlayState } from "./ProjectDetailOverlay";
import { projects, type Project } from "../data/about-data";

export default function ProjectsSection() {
  const [overlay, setOverlay] = useState<OverlayState | null>(null);

  const open = (project: Project, origin: { x: number; y: number }) => {
    setOverlay({ project, origin });
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
