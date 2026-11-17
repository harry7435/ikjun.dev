"use client";

import SidebarNav from "./SidebarNav";
import SidebarSocials from "./SidebarSocials";
import ScrambleText from "./effects/ScrambleText";
import ParticleField from "./effects/ParticleField";
import { sidebarIntro, sidebarRole } from "@/content/profile";

export default function Sidebar() {
  return (
    <aside className="relative lg:sticky lg:top-16 lg:flex lg:h-[calc(100vh-4rem)] lg:w-[46%] lg:max-w-xl lg:flex-col lg:justify-between lg:py-20">
      <ParticleField className="pointer-events-none absolute inset-0 -z-10 opacity-70" />

      <div>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          조익준
        </h1>
        <h2 className="mt-3 text-lg font-medium text-gray-700 dark:text-gray-200 sm:text-xl">
          <ScrambleText text={sidebarRole} />
        </h2>
        <p className="mt-4 max-w-xs text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          {sidebarIntro}
        </p>

        <SidebarNav />
      </div>

      <SidebarSocials />
    </aside>
  );
}
