"use client";

import { FaGithub, FaLinkedin } from "react-icons/fa";
import { SiVelog } from "react-icons/si";
import { Mail } from "lucide-react";
import { socials, type Social } from "../data/about-data";
import TrackedExternalLink from "@/app/components/analytics/TrackedExternalLink";

const ICON_MAP: Record<Social["icon"], React.ComponentType<{ size?: number }>> = {
  github: FaGithub,
  linkedin: FaLinkedin,
  velog: SiVelog,
  mail: Mail,
};

export default function SidebarSocials() {
  return (
    <ul className="mt-8 flex items-center gap-5">
      {socials.map((social) => {
        const Icon = ICON_MAP[social.icon];
        return (
          <li key={social.label}>
            <TrackedExternalLink
              href={social.href}
              label={social.label}
              surface="sidebar_social"
              aria-label={social.label}
              className="text-gray-500 transition-colors hover:text-amber-600 dark:text-gray-400 dark:hover:text-amber-400"
            >
              <Icon size={22} />
            </TrackedExternalLink>
          </li>
        );
      })}
    </ul>
  );
}
