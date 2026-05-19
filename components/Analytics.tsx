"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-VXBVZQ8GN1";

declare global {
  interface Window {
    gtag?: (
      command: string,
      target: string,
      params?: Record<string, unknown>
    ) => void;
  }
}

export default function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window.gtag !== "function") return;

    const search = searchParams?.toString();
    const fullPath = search ? `${pathname}?${search}` : pathname;
    const id = window.setTimeout(() => {
      window.gtag?.("event", "page_view", {
        page_path: fullPath,
        page_location: window.location.href,
        page_title: document.title,
        send_to: GA_ID,
      });
    }, 0);

    return () => window.clearTimeout(id);
  }, [pathname, searchParams]);

  return null;
}
