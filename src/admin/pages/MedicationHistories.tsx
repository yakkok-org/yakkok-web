import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  collectionGroup,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
  type DocumentData,
  type QueryConstraint,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";

type HistoryRow = {
  id: string;
  userId?: string;
  profileId?: string;
  medicationId?: string;
  inTakeDate?: string;
  isTaken?: boolean;
};

type TakenFilter = "all" | "taken" | "missed";
const PAGE_SIZE = 30;

function parseUserAndProfile(path: string): { userId?: string; profileId?: string } {
  // users/{userId}/profiles/{profileId}/medicationHistories/{historyId}
  const parts = path.split("/");
  const userIdx = parts.indexOf("users");
  const profileIdx = parts.indexOf("profiles");
  return {
    userId: userIdx >= 0 ? parts[userIdx + 1] : undefined,
    profileId: profileIdx >= 0 ? parts[profileIdx + 1] : undefined,
  };
}

function todayIso(daysAgo = 0): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

export default function MedicationHistories() {
  const [rows, setRows] = useState<HistoryRow[]>([]);
  const [cursor, setCursor] = useState<QueryDocumentSnapshot<DocumentData> | null>(
    null
  );
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [from, setFrom] = useState(() => todayIso(6));
  const [to, setTo] = useState(() => todayIso(0));
  const [taken, setTaken] = useState<TakenFilter>("all");

  const load = useCallback(
    async (mode: "first" | "more") => {
      setError(null);
      setLoading(true);
      try {
        const constraints: QueryConstraint[] = [
          where("inTakeDate", ">=", from),
          where("inTakeDate", "<=", to),
          orderBy("inTakeDate", "desc"),
        ];
        if (mode === "more" && cursor) {
          constraints.push(startAfter(cursor));
        }
        constraints.push(limit(PAGE_SIZE));

        const snap = await getDocs(
          query(collectionGroup(db, "medicationHistories"), ...constraints)
        );
        const next: HistoryRow[] = snap.docs.map((d) => {
          const data = d.data() as Record<string, unknown>;
          const parsed = parseUserAndProfile(d.ref.path);
          return {
            id: d.id,
            ...parsed,
            medicationId: data.medicationId as string | undefined,
            inTakeDate: data.inTakeDate as string | undefined,
            isTaken: data.isTaken as boolean | undefined,
          };
        });
        setRows((prev) => (mode === "first" ? next : [...prev, ...next]));
        setCursor(snap.docs[snap.docs.length - 1] ?? null);
        setHasMore(snap.size === PAGE_SIZE);
      } catch (err) {
        setError(err instanceof Error ? err.message : "복약 기록을 불러오지 못했어요.");
      } finally {
        setLoading(false);
      }
    },
    [cursor, from, to]
  );

  useEffect(() => {
    setRows([]);
    setCursor(null);
    setHasMore(false);
    load("first");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, to]);

  const filtered =
    taken === "all"
      ? rows
      : rows.filter((r) => r.isTaken === (taken === "taken"));

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">복약 기록</h1>
      <p className="mt-1 text-sm text-gray-500">
        전체 사용자의 복약 기록을 날짜·복용 여부로 조회하세요.
      </p>

      <div className="mt-6 flex flex-wrap gap-3 items-center text-sm">
        <label className="flex items-center gap-2">
          <span className="text-gray-500">시작</span>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 focus:outline-none focus:border-brand"
          />
        </label>
        <label className="flex items-center gap-2">
          <span className="text-gray-500">끝</span>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 focus:outline-none focus:border-brand"
          />
        </label>
        <div className="flex rounded-full border border-gray-200 bg-white p-0.5">
          {(["all", "taken", "missed"] as TakenFilter[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTaken(t)}
              className={`px-3 py-1.5 rounded-full transition ${
                taken === t
                  ? "bg-brand text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {t === "all" ? "전체" : t === "taken" ? "복용" : "미복용"}
            </button>
          ))}
        </div>
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
              <th className="text-left px-4 py-3">날짜</th>
              <th className="text-left px-4 py-3">상태</th>
              <th className="text-left px-4 py-3">사용자</th>
              <th className="text-left px-4 py-3">약 ID</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((r) => (
              <tr key={`${r.userId}_${r.id}`} className="hover:bg-gray-50">
                <td className="px-4 py-3">{r.inTakeDate ?? "—"}</td>
                <td className="px-4 py-3">
                  {r.isTaken ? (
                    <span className="text-xs rounded-full bg-brand-soft text-brand-dark px-2 py-0.5">
                      복용
                    </span>
                  ) : (
                    <span className="text-xs rounded-full bg-gray-100 text-gray-500 px-2 py-0.5">
                      미복용
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {r.userId ? (
                    <Link
                      to={`/dashboard/users/${r.userId}`}
                      className="font-mono text-xs text-brand hover:text-brand-dark"
                    >
                      {r.userId.slice(0, 10)}…
                    </Link>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-gray-500 truncate max-w-[240px]">
                  {r.medicationId ?? "—"}
                </td>
              </tr>
            ))}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-gray-400">
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
