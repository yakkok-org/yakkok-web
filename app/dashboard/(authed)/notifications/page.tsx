"use client";

import { useCallback, useEffect, useState } from "react";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  type DocumentData,
  type QueryConstraint,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { formatDateTime } from "@/lib/admin/format";

type DispatchStatus =
  | "pending"
  | "sent"
  | "partial"
  | "failed"
  | "skipped"
  | "no-tokens";

type DispatchRow = {
  id: string;
  status?: DispatchStatus;
  dispatchedAt?: unknown;
  successCount?: number;
  failureCount?: number;
  medicationId?: string;
  intakeTimeId?: string;
  raw: Record<string, unknown>;
};

type Tab = "all" | "sent" | "partial" | "failed" | "no-tokens";
const TABS: { value: Tab; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "sent", label: "성공" },
  { value: "partial", label: "부분" },
  { value: "failed", label: "실패" },
  { value: "no-tokens", label: "토큰 없음" },
];
const PAGE_SIZE = 30;

function statusBadge(status?: DispatchStatus) {
  const cls = {
    sent: "bg-brand-soft text-brand-dark",
    partial: "bg-yellow-50 text-yellow-700",
    failed: "bg-red-50 text-red-700",
    "no-tokens": "bg-gray-100 text-gray-500",
    pending: "bg-blue-50 text-blue-700",
    skipped: "bg-gray-100 text-gray-500",
  }[status ?? "pending"];
  return (
    <span className={`text-xs rounded-full px-2 py-0.5 ${cls}`}>
      {status ?? "—"}
    </span>
  );
}

export default function NotificationDispatches() {
  const [rows, setRows] = useState<DispatchRow[]>([]);
  const [cursor, setCursor] = useState<QueryDocumentSnapshot<DocumentData> | null>(
    null
  );
  const [hasMore, setHasMore] = useState(false);
  const [tab, setTab] = useState<Tab>("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detail, setDetail] = useState<DispatchRow | null>(null);

  const load = useCallback(
    async (mode: "first" | "more") => {
      setError(null);
      setLoading(true);
      try {
        const constraints: QueryConstraint[] = [
          orderBy("dispatchedAt", "desc"),
        ];
        if (mode === "more" && cursor) {
          constraints.push(startAfter(cursor));
        }
        constraints.push(limit(PAGE_SIZE));

        const snap = await getDocs(
          query(collection(db, "notificationDispatches"), ...constraints)
        );
        const next: DispatchRow[] = snap.docs.map((d) => {
          const raw = d.data() as Record<string, unknown>;
          return {
            id: d.id,
            status: raw.status as DispatchStatus | undefined,
            dispatchedAt: raw.dispatchedAt as string | undefined,
            successCount: raw.successCount as number | undefined,
            failureCount: raw.failureCount as number | undefined,
            medicationId: raw.medicationId as string | undefined,
            intakeTimeId: raw.intakeTimeId as string | undefined,
            raw,
          };
        });
        setRows((prev) => (mode === "first" ? next : [...prev, ...next]));
        setCursor(snap.docs[snap.docs.length - 1] ?? null);
        setHasMore(snap.size === PAGE_SIZE);
      } catch (err) {
        setError(err instanceof Error ? err.message : "알림 이력을 불러오지 못했어요.");
      } finally {
        setLoading(false);
      }
    },
    [cursor]
  );

  useEffect(() => {
    load("first");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered =
    tab === "all" ? rows : rows.filter((r) => r.status === tab);

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">알림 이력</h1>
      <p className="mt-1 text-sm text-gray-500">
        notificationDispatches 컬렉션의 발송 결과를 모니터링하세요.
      </p>

      <div className="mt-6 flex rounded-full border border-gray-200 bg-white p-0.5 text-sm w-fit">
        {TABS.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setTab(t.value)}
            className={`px-3 py-1.5 rounded-full transition ${
              tab === t.value
                ? "bg-brand text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="mt-6 rounded-card border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-6 overflow-hidden rounded-card border border-gray-100 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-3">발송 시각</th>
              <th className="text-left px-4 py-3">상태</th>
              <th className="text-right px-4 py-3">성공</th>
              <th className="text-right px-4 py-3">실패</th>
              <th className="text-left px-4 py-3">약 ID</th>
              <th className="px-4 py-3 w-20" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-700">
                  {formatDateTime(r.dispatchedAt)}
                </td>
                <td className="px-4 py-3">{statusBadge(r.status)}</td>
                <td className="px-4 py-3 text-right">{r.successCount ?? 0}</td>
                <td className="px-4 py-3 text-right text-red-600">
                  {r.failureCount ?? 0}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-gray-500 truncate max-w-[180px]">
                  {r.medicationId ?? "—"}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => setDetail(r)}
                    className="text-brand hover:text-brand-dark text-xs font-medium"
                  >
                    상세
                  </button>
                </td>
              </tr>
            ))}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-gray-400">
                  결과가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-center">
        <button
          type="button"
          onClick={() => load("more")}
          disabled={!hasMore || loading}
          className="rounded-full border border-gray-200 bg-white px-5 py-2 text-sm text-gray-700 hover:border-brand hover:text-brand transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "불러오는 중…" : hasMore ? "더 보기" : "마지막입니다"}
        </button>
      </div>

      {detail && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setDetail(null)}
        >
          <div
            className="bg-white rounded-card max-w-2xl w-full max-h-[80vh] overflow-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-gray-500">Dispatch 상세</p>
                <p className="mt-1 font-mono text-xs text-gray-700 break-all">
                  {detail.id}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDetail(null)}
                className="text-gray-400 hover:text-gray-700 text-2xl leading-none"
                aria-label="닫기"
              >
                ×
              </button>
            </div>
            <pre className="mt-4 text-xs bg-gray-50 rounded-lg p-4 overflow-auto">
              {JSON.stringify(detail.raw, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
