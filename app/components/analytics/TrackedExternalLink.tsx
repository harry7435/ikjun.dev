"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { track } from "./mixpanel";

type Surface =
  | "about_project"
  | "about_project_detail"
  | "footer_social"
  | "sidebar_social";

interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  label: string;
  surface: Surface;
  children: ReactNode;
}

export default function TrackedExternalLink({
  href,
  label,
  surface,
  children,
  ...rest
}: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("external_link_click", { href, label, surface })}
      {...rest}
    >
      {children}
    </a>
  );
}
