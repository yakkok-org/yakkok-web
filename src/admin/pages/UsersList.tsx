import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
import { db } from "../firebase";
import { formatDate } from "../lib/format";

type UserRow = {
  id: string;
  nickname?: string;
  email?: string;
  provider?: "kakao" | "apple";
  createdAt?: unknown;
};

type ProviderFilter = "all" | "kakao" | "apple";
const PAGE_SIZE = 20;

export default function UsersList() {
  const [rows, setRows] = useState<UserRow[]>([]);
  const [cursor, setCursor] = useState<QueryDocumentSnapshot<DocumentData> | null>(
    null
  );
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [provider, setProvider] = useState<ProviderFilter>("all");
  const [search, setSearch] = useState("");

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

        const snap = await getDocs(query(collection(db, "users"), ...constraints));
        const next: UserRow[] = snap.docs.map((d) => {
          const data = d.data() as Record<string, unknown>;
          return {
            id: d.id,
            nickname: data.nickname as string | undefined,
            email: data.email as string | undefined,
            provider: data.provider as "kakao" | "apple" | undefined,
            createdAt: data.createdAt,
          };
        });
        setRows((prev) => (mode === "first" ? next : [...prev, ...next]));
        setCursor(snap.docs[snap.docs.length - 1] ?? null);
        setHasMore(snap.size === PAGE_SIZE);
      } catch (err) {
        setError(err instanceof Error ? err.message : "사용자를 불러오지 못했어요.");
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
  if (provider !== "all") {
    filtered = filtered.filter((r) => r.provider === provider);
  }
  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter(
      (r) =>
        r.nickname?.toLowerCase().includes(s) ||
        r.email?.toLowerCase().includes(s)
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">사용자</h1>
      <p className="mt-1 text-sm text-gray-500">가입자 목록과 상세 정보를 확인하세요.</p>

      <div className="mt-6 flex flex-wrap gap-3 items-center">
        <div className="flex rounded-full border border-gray-200 bg-white p-0.5 text-sm">
          {(["all", "kakao", "apple"] as ProviderFilter[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setProvider(p)}
              className={`px-3 py-1.5 rounded-full transition ${
                provider === p
                  ? "bg-brand text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {p === "all" ? "전체" : p === "kakao" ? "Kakao" : "Apple"}
            </button>
          ))}
        </div>
        <input
          type="search"
          placeholder="현재 페이지 내 닉네임/이메일 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm focus:outline-none focus:border-brand"
        />
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
              <th className="text-left px-4 py-3">닉네임</th>
              <th className="text-left px-4 py-3">이메일</th>
              <th className="text-left px-4 py-3">Provider</th>
              <th className="text-left px-4 py-3">가입일</th>
              <th className="px-4 py-3 w-20" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{u.nickname ?? "—"}</td>
                <td className="px-4 py-3 text-gray-600">{u.email ?? "—"}</td>
                <td className="px-4 py-3">
                  <span className="text-xs rounded-full bg-gray-100 px-2 py-0.5">
                    {u.provider ?? "—"}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600">{formatDate(u.createdAt)}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    to={`/dashboard/users/${u.id}`}
                    className="text-brand hover:text-brand-dark text-xs font-medium"
                  >
                    상세
                  </Link>
                </td>
              </tr>
            ))}
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
