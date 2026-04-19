import CredentialsBlock from "./CredentialsBlock";
import TechTagCloud from "./TechTagCloud";
import { keyTechStack } from "../data/about-data";

export default function MoreSection() {
  return (
    <section id="more" className="mb-24 scroll-mt-20 lg:mb-36">
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">
          Stack
        </h3>
        <TechTagCloud items={keyTechStack} />
      </div>

      <div className="mt-12">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">
          Credentials
        </h3>
        <CredentialsBlock />
      </div>
    </section>
  );
}
