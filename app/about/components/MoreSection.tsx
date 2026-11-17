import CredentialsBlock from "./CredentialsBlock";
import TechTagCloud from "./TechTagCloud";
import { stackGroups } from "@/content/profile";

const HEADING =
  "text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400";

export default function MoreSection() {
  return (
    <section id="more" className="mb-24 scroll-mt-20 lg:mb-36">
      <div>
        <h3 className={HEADING}>Stack</h3>
        <h4 className="mt-6 text-sm font-semibold text-gray-800 dark:text-gray-200">
          실무
        </h4>
        <TechTagCloud items={stackGroups.work} />
        <h4 className="mt-8 text-sm font-semibold text-gray-800 dark:text-gray-200">
          사이드
        </h4>
        <TechTagCloud items={stackGroups.side} />
      </div>

      <div className="mt-12">
        <h3 className={HEADING}>Credentials</h3>
        <CredentialsBlock />
      </div>
    </section>
  );
}
