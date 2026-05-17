import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  collectionGroup,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  type DocumentData,
  type QueryConstraint,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";
import { daysSince, formatDateTime, toIsoString } from "../lib/format";

type DeviceRow = {
  id: string;
  userId?: string;
  platform?: string;
  appVersion?: string;
  notificationEnabled?: boolean;
  lastSeenAt?: unknown;
};

type PlatformFilter = "all" | "ios" | "android";
const PAGE_SIZE = 30;
const INACTIVE_DAYS = 30;

function parseUserId(path: string): string | undefined {
  const parts = path.split("/");
  const idx = parts.indexOf("users");
  return idx >= 0 ? parts[idx + 1] : undefined;
}

export default function Devices() {
  const [rows, setRows] = useState<DeviceRow[]>([]);
  const [cursor, setCursor] = useState<QueryDocumentSnapshot<DocumentData> | null>(
    null
  );
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [platform, setPlatform] = useState<PlatformFilter>("all");
  const [inactiveOnly, setInactiveOnly] = useState(false);

  const load = useCallback(
    async (mode: "first" | "more") => {
      setError(null);
      setLoading(true);
      try {
        const constraints: QueryConstraint[] = [orderBy("lastSeenAt", "desc")];
        if (mode === "more" && cursor) {
          constraints.push(startAfter(cursor));
        }
        constraints.push(limit(PAGE_SIZE));

        const snap = await getDocs(
          query(collectionGroup(db, "fcmTokens"), ...constraints)
        );
        const next: DeviceRow[] = snap.docs.map((d) => {
          const data = d.data() as Record<string, unknown>;
          return {
            id: d.id,
            userId: parseUserId(d.ref.path),
            platform: data.platform as string | undefined,
            appVersion: data.appVersion as string | undefined,
            notificationEnabled: data.notificationEnabled as boolean | undefined,
            lastSeenAt: data.lastSeenAt,
          };
        });
        setRows((prev) => (mode === "first" ? next : [...prev, ...next]));
        setCursor(snap.docs[snap.docs.length - 1] ?? null);
        setHasMore(snap.size === PAGE_SIZE);
      } catch (err) {
        setError(err instanceof Error ? err.message : "디바이스를 불러오지 못했어요.");
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

  let filtered = rows;
  if (platform !== "all") {
    filtered = filtered.filter((r) => r.platform === platform);
  }
  if (inactiveOnly) {
    filtered = filtered.filter((r) => {
      const d = daysSince(r.lastSeenAt);
      return d !== null && d >= INACTIVE_DAYS;
    });
  }

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">디바이스</h1>
      <p className="mt-1 text-sm text-gray-500">
        등록된 FCM 토큰을 플랫폼·활동 시점으로 조회하세요.
      </p>

      <div className="mt-6 flex flex-wrap gap-3 items-center text-sm">
        <div className="flex rounded-full border border-gray-200 bg-white p-0.5">
          {(["all", "ios", "android"] as PlatformFilter[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPlatform(p)}
              className={`px-3 py-1.5 rounded-full transition ${
                platform === p
                  ? "bg-brand text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {p === "all" ? "전체" : p === "ios" ? "iOS" : "Android"}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={inactiveOnly}
            onChange={(e) => setInactiveOnly(e.target.checked)}
            className="accent-brand"
          />
          <span className="text-gray-600">{INACTIVE_DAYS}일 이상 비활성만</span>
        </label>
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
              <th className="text-left px-4 py-3">플랫폼</th>
              <th className="text-left px-4 py-3">앱 버전</th>
              <th className="text-left px-4 py-3">알림</th>
              <th className="text-left px-4 py-3">마지막 활동</th>
              <th className="text-left px-4 py-3">사용자</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((r) => {
              const days = daysSince(r.lastSeenAt);
              const inactive = days !== null && days >= INACTIVE_DAYS;
              return (
                <tr
                  key={`${r.userId}_${r.id}`}
                  className={`hover:bg-gray-50 ${inactive ? "bg-red-50/40" : ""}`}
                >
                  <td className="px-4 py-3 font-medium">{r.platform ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {r.appVersion ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    {r.notificationEnabled === false ? (
                      <span className="text-xs rounded-full bg-gray-100 text-gray-500 px-2 py-0.5">
                        꺼짐
                      </span>
                    ) : (
                      <span className="text-xs rounded-full bg-brand-soft text-brand-dark px-2 py-0.5">
                        켜짐
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {toIsoString(r.lastSeenAt) ? (
                      <>
                        {formatDateTime(r.lastSeenAt)}
                        {days !== null && (
                          <span
                            className={`ml-2 text-xs ${inactive ? "text-red-600" : "text-gray-400"}`}
                          >
                            ({days}일 전)
                          </span>
                        )}
                      </>
                    ) : (
                      "—"
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
                </tr>
              );
            })}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-gray-400">
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
