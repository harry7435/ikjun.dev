"use client";

import mixpanel from "mixpanel-browser";

const TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
const isProd = process.env.NODE_ENV === "production";
let initialized = false;

export function initMixpanel() {
  if (initialized || !isProd || !TOKEN) return;
  mixpanel.init(TOKEN, {
    track_pageview: false,
    persistence: "localStorage",
    ip: false,
    autocapture: false,
  });
  initialized = true;
}

export type AnalyticsEvent =
  | { name: "page_view"; props: { path: string; search?: string } }
  | {
      name: "external_link_click";
      props: {
        href: string;
        label: string;
        surface: "about_project" | "footer_social" | "sidebar_social";
      };
    }
  | {
      name: "blog_post_click";
      props: { slug: string; title: string; category: "posts" | "notes" };
    };

export function track<N extends AnalyticsEvent["name"]>(
  name: N,
  props: Extract<AnalyticsEvent, { name: N }>["props"],
) {
  if (!isProd || !initialized) return;
  mixpanel.track(name, props);
}
