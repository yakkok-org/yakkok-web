"use client";

import type { ReactNode } from "react";

const APP_STORE_URL = "https://apps.apple.com/kr/app/id6752120136";
const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-VXBVZQ8GN1";

type Props = {
  location: "hero_main" | "header_nav" | "cta_bottom" | "blog_post_bottom";
  className?: string;
  children: ReactNode;
};

export default function AppStoreLink({ location, className, children }: Props) {
  return (
    <a
      href={APP_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => {
        window.gtag?.("event", "app_download_click", {
          location,
          platform: "ios",
          send_to: GA_ID,
        });
      }}
    >
      {children}
    </a>
  );
}
