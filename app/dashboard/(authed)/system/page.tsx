"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

type StatusSummary = Record<string, number>;

const PROJECT_ID = "yakkok-c9922";
const EXTERNAL_LINKS = [
  {
    label: "Firebase Console",
    href: `https://console.firebase.google.com/project/${PROJECT_ID}/overview`,
    desc: "프로젝트 전체 콘솔",
  },
  {
    label: "Cloud Functions Logs",
    href: `https://console.cloud.google.com/functions/list?project=${PROJECT_ID}`,
    desc: "scheduled / dispatch 함수 실행 로그",
  },
  {
    label: "Firestore",
    href: `https://console.firebase.google.com/project/${PROJECT_ID}/firestore`,
    desc: "컬렉션 / 문서 직접 조회 · 편집",
  },
  {
    label: "Authentication",
    href: `https://console.firebase.google.com/project/${PROJECT_ID}/authentication/users`,
    desc: "사용자 / 로그인 방식 관리",
  },
];

function isoDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

export default function SystemLog() {
  const [summary24h, setSummary24h] = useState<StatusSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const snap = await getDocs(
          query(
            collection(db, "notificationDispatches"),
            where("dispatchedAt", ">=", isoDaysAgo(1))
          )
        );
        const counts: StatusSummary = {};
        snap.forEach((d) => {
          const s = (d.get("status") as string | undefined) ?? "unknown";
          counts[s] = (counts[s] ?? 0) + 1;
        });
        if (!cancelled) setSummary24h(counts);
      } catch (err) {
        if (!cancelled)
          setError(err instanceof Error ? err.message : "불러오기 실패");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const total = summary24h
    ? Object.values(summary24h).reduce((acc, v) => acc + v, 0)
    : 0;

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">시스템 로그</h1>
      <p className="mt-1 text-sm text-gray-500">
        스케줄러·알림 상태 요약과 외부 콘솔로 가는 바로가기를 모았어요.
      </p>

      <section className="mt-8 rounded-card bg-white border border-gray-100 p-5">
        <h2 className="font-semibold">최근 24시간 알림 발송</h2>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        {loading ? (
          <p className="mt-3 text-sm text-gray-400">로딩 중…</p>
        ) : !summary24h ? null : total === 0 ? (
          <p className="mt-3 text-sm text-gray-500">기록 없음</p>
        ) : (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(summary24h).map(([status, count]) => (
              <div
                key={status}
                className="rounded-lg border border-gray-100 p-4"
              >
                <p className="text-xs text-gray-500 uppercase">{status}</p>
                <p className="mt-1 text-2xl font-bold tracking-tight">
                  {count.toLocaleString("ko-KR")}
                </p>
              </div>
            ))}
            <div className="rounded-lg border border-gray-100 p-4 bg-gray-50">
              <p className="text-xs text-gray-500 uppercase">total</p>
              <p className="mt-1 text-2xl font-bold tracking-tight">
                {total.toLocaleString("ko-KR")}
              </p>
            </div>
          </div>
        )}
      </section>

      <section className="mt-6 rounded-card bg-white border border-gray-100 p-5">
        <h2 className="font-semibold">외부 콘솔</h2>
        <p className="mt-1 text-sm text-gray-500">
          상세 로그·룰·인증 관리는 Firebase / Google Cloud 콘솔에서 확인하세요.
        </p>
        <ul className="mt-4 divide-y divide-gray-100">
          {EXTERNAL_LINKS.map((l) => (
            <li key={l.href} className="py-3 flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{l.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{l.desc}</p>
              </div>
              <a
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-brand hover:text-brand-dark"
              >
                열기 ↗
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
