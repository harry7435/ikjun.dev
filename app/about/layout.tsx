"use client";

import { ReactNode, useMemo } from "react";
import { ActiveSectionProvider } from "./context/ActiveSectionContext";
import Sidebar from "./components/Sidebar";
import MouseGradient from "./components/MouseGradient";
import { ScrollProgressBar } from "./components/ScrollProgressBar";

export default function AboutLayout({ children }: { children: ReactNode }) {
  const sectionIds = useMemo(
    () => ["about", "experience", "projects", "more"],
    []
  );

  return (
    <ActiveSectionProvider sectionIds={sectionIds}>
      <MouseGradient />
      <ScrollProgressBar />
      <div className="relative isolate mx-auto min-h-screen max-w-screen-xl px-6 pb-16 pt-20 md:px-10 lg:flex lg:gap-16 lg:px-12 lg:pt-0">
        <Sidebar />
        <main className="pb-8 pt-4 lg:flex-1 lg:py-20">{children}</main>
      </div>
    </ActiveSectionProvider>
  );
}
