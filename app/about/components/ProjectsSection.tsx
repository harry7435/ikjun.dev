import SectionHeading from "./SectionHeading";
import ProjectItem from "./ProjectItem";
import { projects } from "../data/about-data";

export default function ProjectsSection() {
  return (
    <section id="projects" className="mb-24 scroll-mt-20 lg:mb-36">
      <SectionHeading label="Projects" />
      <ol className="space-y-4">
        {projects.map((proj) => (
          <ProjectItem key={proj.title} project={proj} />
        ))}
      </ol>
    </section>
  );
}
