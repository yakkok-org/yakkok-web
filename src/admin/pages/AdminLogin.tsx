import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { useAdminAuth } from "../hooks/useAdminAuth";

export default function AdminLogin() {
  const { loading, user, isAdmin } = useAdminAuth();
  const [error, setError] = useState<string | null>(null);
  const [signingIn, setSigningIn] = useState(false);
  const location = useLocation();
  const redirectTo =
    (location.state as { from?: string } | null)?.from ?? "/dashboard";

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

  if (!loading && user && isAdmin) {
    return <Navigate to={redirectTo} replace />;
  }

  const handleLogin = async () => {
    setError(null);
    setSigningIn(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdTokenResult(true);
      if (token.claims.admin !== true) {
        await signOut(auth);
        setError(
          "이 계정은 어드민 권한이 없습니다. 운영자에게 admin 권한 부여를 요청하세요."
        );
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "로그인에 실패했어요.";
      setError(message);
    } finally {
      setSigningIn(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-sm bg-white rounded-card border border-gray-100 shadow-sm p-8 text-center">
        <p className="text-2xl font-bold">
          <span className="text-brand">약꼭</span> 어드민
        </p>
        <p className="mt-2 text-sm text-gray-500">
          운영자 계정으로 로그인하세요
        </p>

        <button
          type="button"
          onClick={handleLogin}
          disabled={signingIn}
          className="mt-8 w-full inline-flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white text-gray-800 font-medium px-4 py-3 hover:border-brand hover:bg-brand-soft transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
            <path
              fill="#4285F4"
              d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.49h4.84a4.14 4.14 0 0 1-1.8 2.71v2.26h2.91c1.7-1.57 2.69-3.88 2.69-6.62z"
            />
            <path
              fill="#34A853"
              d="M9 18c2.43 0 4.47-.81 5.96-2.18l-2.91-2.26c-.81.54-1.84.86-3.05.86-2.34 0-4.32-1.58-5.03-3.71H.96v2.33A9 9 0 0 0 9 18z"
            />
            <path
              fill="#FBBC05"
              d="M3.97 10.71A5.41 5.41 0 0 1 3.68 9c0-.59.1-1.17.29-1.71V4.96H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.04l3.01-2.33z"
            />
            <path
              fill="#EA4335"
              d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.96l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z"
            />
          </svg>
          {signingIn ? "로그인 중…" : "Google로 로그인"}
        </button>

        {error && (
          <p className="mt-4 text-sm text-red-600 leading-relaxed">{error}</p>
        )}

        <p className="mt-8 text-xs text-gray-400 leading-relaxed">
          이 페이지는 검색에 노출되지 않습니다.
        </p>
      </div>
    </div>
  );
}
