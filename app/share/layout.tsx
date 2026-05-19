import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "약꼭 앱으로 이동 중" },
  robots: { index: false, follow: false },
};

export default function ShareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
