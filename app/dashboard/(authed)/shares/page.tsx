"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
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
import { formatDate, isExpired } from "@/lib/admin/format";

type ShareRow = {
  id: string;
  shareCode?: string;
  ownerUserId?: string;
  profileId?: string;
  sharedWithUserIds?: string[];
  createdAt?: unknown;
  expiresAt?: unknown;
};

type StatusFilter = "all" | "active" | "expired" | "unused";
const PAGE_SIZE = 30;

function classify(row: ShareRow): "active" | "expired" | "unused" {
  if (isExpired(row.expiresAt)) return "expired";
  if (!row.sharedWithUserIds || row.sharedWithUserIds.length === 0)
    return "unused";
  return "active";
}

function statusBadge(s: "active" | "expired" | "unused") {
  const cfg = {
    active: { label: "활성", cls: "bg-brand-soft text-brand-dark" },
    unused: { label: "미사용", cls: "bg-gray-100 text-gray-500" },
    expired: { label: "만료", cls: "bg-red-50 text-red-700" },
  }[s];
  return (
    <span className={`text-xs rounded-full px-2 py-0.5 ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
}

export default function ProfileShares() {
  const [rows, setRows] = useState<ShareRow[]>([]);
  const [cursor, setCursor] = useState<QueryDocumentSnapshot<DocumentData> | null>(
    null
  );
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<StatusFilter>("all");

  const load = useCallback(
    async (mode: "first" | "more") => {
      setError(null);
      setLoading(true);
      try {
        const constraints: QueryConstraint[] = [orderBy("createdAt", "desc")];
        if (mode === "more" && cursor) {
          constraints.push(startAfter(cursor));
        }
        constraints.push(limit(PAGE_SIZE));

        const snap = await getDocs(
          query(collection(db, "profileShares"), ...constraints)
        );
        const next: ShareRow[] = snap.docs.map((d) => {
          const data = d.data() as Record<string, unknown>;
          return {
            id: d.id,
            shareCode: data.shareCode as string | undefined,
            ownerUserId: data.ownerUserId as string | undefined,
            profileId: data.profileId as string | undefined,
            sharedWithUserIds: (data.sharedWithUserIds as string[]) ?? [],
            createdAt: data.createdAt,
            expiresAt: data.expiresAt,
          };
        });
        setRows((prev) => (mode === "first" ? next : [...prev, ...next]));
        setCursor(snap.docs[snap.docs.length - 1] ?? null);
        setHasMore(snap.size === PAGE_SIZE);
      } catch (err) {
        setError(err instanceof Error ? err.message : "공유 정보를 불러오지 못했어요.");
      } finally {
        setLoading(false);
      }
    },
    [cursor]
  );

  useEffect(() => {
    setRows([]);
    setCursor(null);
    setHasMore(false);
    load("first");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered =
    status === "all" ? rows : rows.filter((r) => classify(r) === status);

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">공유코드</h1>
      <p className="mt-1 text-sm text-gray-500">
        가족 간 프로필 공유 코드 현황을 확인하세요.
      </p>

      <div className="mt-6 flex rounded-full border border-gray-200 bg-white p-0.5 text-sm w-fit">
        {(["all", "active", "unused", "expired"] as StatusFilter[]).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatus(s)}
            className={`px-3 py-1.5 rounded-full transition ${
              status === s
                ? "bg-brand text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {s === "all"
              ? "전체"
              : s === "active"
                ? "활성"
                : s === "unused"
                  ? "미사용"
                  : "만료"}
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
              <th className="text-left px-4 py-3">코드</th>
              <th className="text-left px-4 py-3">상태</th>
              <th className="text-left px-4 py-3">소유자</th>
              <th className="text-right px-4 py-3">공유 받은 수</th>
              <th className="text-left px-4 py-3">생성일</th>
              <th className="text-left px-4 py-3">만료일</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono font-semibold tracking-wider">
                  {r.shareCode ?? "—"}
                </td>
                <td className="px-4 py-3">{statusBadge(classify(r))}</td>
                <td className="px-4 py-3">
                  {r.ownerUserId ? (
                    <Link
                      href={`/dashboard/users/${r.ownerUserId}`}
                      className="font-mono text-xs text-brand hover:text-brand-dark"
                    >
                      {r.ownerUserId.slice(0, 10)}…
                    </Link>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  {r.sharedWithUserIds?.length ?? 0}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {formatDate(r.createdAt)}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {r.expiresAt ? formatDate(r.expiresAt) : "무기한"}
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
    </div>
  );
}
