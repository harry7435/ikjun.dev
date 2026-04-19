import SectionHeading from "./SectionHeading";
import ExperienceItem from "./ExperienceItem";
import { experiences } from "../data/about-data";

export default function ExperienceSection() {
  return (
    <section id="experience" className="mb-24 scroll-mt-20 lg:mb-36">
      <SectionHeading label="Experience" />
      <ol className="space-y-4">
        {experiences.map((exp) => (
          <ExperienceItem key={exp.company} experience={exp} />
        ))}
      </ol>
    </section>
  );
}
