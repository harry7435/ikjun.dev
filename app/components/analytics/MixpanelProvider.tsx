"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { initMixpanel, track } from "./mixpanel";

function PageviewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;
    const search = searchParams?.toString();
    track("page_view", {
      path: pathname,
      ...(search ? { search } : {}),
    });
  }, [pathname, searchParams]);

  return null;
}

export default function MixpanelProvider() {
  useEffect(() => {
    initMixpanel();
  }, []);

  if (process.env.NODE_ENV !== "production") return null;

  return (
    <Suspense fallback={null}>
      <PageviewTracker />
    </Suspense>
  );
}
