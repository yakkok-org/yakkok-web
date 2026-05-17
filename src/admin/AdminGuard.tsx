import { useEffect, type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAdminAuth } from "./hooks/useAdminAuth";

function useNoIndex() {
  useEffect(() => {
    const existing = document.head.querySelector<HTMLMetaElement>(
      'meta[name="robots"]'
    );
    const prev = existing?.content ?? null;
    let meta = existing;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "robots";
      document.head.appendChild(meta);
    }
    meta.content = "noindex, nofollow";
    return () => {
      if (prev !== null && meta) {
        meta.content = prev;
      } else {
        meta?.remove();
      }
    };
  }, []);
}

export default function AdminGuard({ children }: { children: ReactNode }) {
  const { loading, user, isAdmin } = useAdminAuth();
  const location = useLocation();
  useNoIndex();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        로딩 중…
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <Navigate to="/dashboard/login" replace state={{ from: location.pathname }} />
    );
  }

  return <>{children}</>;
}
