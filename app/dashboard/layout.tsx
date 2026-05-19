import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "약꼭 어드민" },
  robots: { index: false, follow: false },
};

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
