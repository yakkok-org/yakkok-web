import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Suspense } from "react";
import Analytics from "@/components/Analytics";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://yakkok.netlify.app";
const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-VXBVZQ8GN1";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "약꼭 — 약을 잊지 마세요",
    template: "%s | 약꼭",
  },
  description:
    "약꼭이 챙겨드릴게요. 복약·영양제 알림, 가족 공유, 복약 기록을 한 번에.",
  keywords: [
    "약꼭",
    "복약 관리",
    "복약 관리 앱",
    "복약 알림",
    "약 알리미",
    "약 알림 앱",
    "약 챙겨주는 앱",
    "영양제 알림",
    "가족 복약 관리",
    "약 기록 앱",
    "처방약 관리",
    "만성질환 관리",
  ],
  authors: [{ name: "약꼭" }],
  manifest: "/manifest.webmanifest",
  icons: { icon: "/favicon.svg" },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
  },
  openGraph: {
    type: "website",
    siteName: "약꼭",
    locale: "ko_KR",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "약꼭 — 약을 잊지 마세요. 약꼭이 챙겨드릴게요.",
      },
    ],
  },
  twitter: { card: "summary_large_image" },
  verification: {
    google: "uOvQedqwiwRibqwoufEaW43dL5rhyMgUgOFPaCATiBA",
    other: {
      "naver-site-verification": "94fdeed1177679e6360df83e84d713244fc81423",
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#18c988",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="preconnect"
          href="https://cdn.jsdelivr.net"
          crossOrigin=""
        />
        <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body>
        {children}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { send_page_view: false });
        `}</Script>
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
      </body>
    </html>
  );
}
