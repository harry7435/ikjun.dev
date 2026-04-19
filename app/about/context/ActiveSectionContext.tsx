"use client";

import { createContext, ReactNode, useContext } from "react";
import { useActiveSection } from "../hooks/useActiveSection";

const ActiveSectionContext = createContext<string>("");

interface Props {
  sectionIds: string[];
  children: ReactNode;
}

export function ActiveSectionProvider({ sectionIds, children }: Props) {
  const activeId = useActiveSection(sectionIds);
  return (
    <ActiveSectionContext.Provider value={activeId}>
      {children}
    </ActiveSectionContext.Provider>
  );
}

export function useActiveSectionContext(): string {
  return useContext(ActiveSectionContext);
}
