"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAdminAuth } from "./useAdminAuth";

export default function AdminGuard({ children }: { children: ReactNode }) {
  const { loading, user, isAdmin } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      const from = encodeURIComponent(pathname ?? "/dashboard");
      router.replace(`/dashboard/login?from=${from}`);
    }
  }, [loading, user, isAdmin, pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        로딩 중…
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        로그인 페이지로 이동 중…
      </div>
    );
  }

  return <>{children}</>;
}
