"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { formatDate } from "@/lib/admin/format";

type UserDoc = {
  nickname?: string;
  email?: string;
  provider?: string;
  name?: string;
  birthDate?: string;
  gender?: string;
  createdAt?: unknown;
};

type ProfileDoc = {
  id: string;
  name?: string;
  isDefault?: boolean;
  medicationCount: number;
};

type FcmTokenDoc = {
  id: string;
  platform?: string;
  appVersion?: string;
  notificationEnabled?: boolean;
  lastSeenAt?: string;
};

type HistoryRow = {
  id: string;
  inTakeDate?: string;
  isTaken?: boolean;
  medicationId?: string;
};

export default function UserDetail() {
  const params = useParams<{ userId: string }>();
  const userId = params?.userId;
  const [user, setUser] = useState<UserDoc | null>(null);
  const [profiles, setProfiles] = useState<ProfileDoc[]>([]);
  const [tokens, setTokens] = useState<FcmTokenDoc[]>([]);
  const [history, setHistory] = useState<HistoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const userSnap = await getDoc(doc(db, "users", userId));
        if (!userSnap.exists()) {
          if (!cancelled) {
            setError("존재하지 않는 사용자입니다.");
            setUser(null);
          }
          return;
        }

        const userData = userSnap.data() as UserDoc;

        const [profilesSnap, tokensSnap] = await Promise.all([
          getDocs(collection(db, "users", userId, "profiles")),
          getDocs(collection(db, "users", userId, "fcmTokens")),
        ]);

        const perProfile = await Promise.all(
          profilesSnap.docs.map(async (p) => {
            const data = p.data() as Record<string, unknown>;
            const medCol = collection(
              db,
              "users",
              userId,
              "profiles",
              p.id,
              "medications"
            );
            const histCol = collection(
              db,
              "users",
              userId,
              "profiles",
              p.id,
              "medicationHistories"
            );
            const [medSnap, histSnap] = await Promise.all([
              getDocs(medCol),
              getDocs(query(histCol, orderBy("inTakeDate", "desc"), limit(5))),
            ]);
            return {
              profile: {
                id: p.id,
                name: data.name as string | undefined,
                isDefault: data.isDefault as boolean | undefined,
                medicationCount: medSnap.size,
              } satisfies ProfileDoc,
              histories: histSnap.docs.map((h) => h.data() as Record<string, unknown>),
            };
          })
        );

        const profileRows: ProfileDoc[] = perProfile.map((p) => p.profile);
        const historyRows: HistoryRow[] = perProfile
          .flatMap((p, idx) =>
            p.histories.map((data, hIdx) => ({
              id: `${perProfile[idx].profile.id}_${hIdx}`,
              inTakeDate: data.inTakeDate as string | undefined,
              isTaken: data.isTaken as boolean | undefined,
              medicationId: data.medicationId as string | undefined,
            }))
          )
          .sort((a, b) =>
            (b.inTakeDate ?? "").localeCompare(a.inTakeDate ?? "")
          )
          .slice(0, 5);

        const tokenRows: FcmTokenDoc[] = tokensSnap.docs.map((t) => {
          const data = t.data() as Record<string, unknown>;
          return {
            id: t.id,
            platform: data.platform as string | undefined,
            appVersion: data.appVersion as string | undefined,
            notificationEnabled: data.notificationEnabled as
              | boolean
              | undefined,
            lastSeenAt: data.lastSeenAt as string | undefined,
          };
        });

        if (cancelled) return;
        setUser(userData);
        setProfiles(profileRows);
        setTokens(tokenRows);
        setHistory(historyRows);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "불러오기 실패");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  if (loading) return <p className="text-sm text-gray-500">로딩 중…</p>;

  if (error || !user) {
    return (
      <div>
        <Link href="/dashboard/users" className="text-sm text-brand">
          ← 목록
        </Link>
        <p className="mt-4 text-sm text-red-600">{error ?? "사용자 없음"}</p>
      </div>
    );
  }

  return (
    <div>
      <Link href="/dashboard/users" className="text-sm text-brand hover:text-brand-dark">
        ← 목록
      </Link>
      <h1 className="mt-2 text-2xl font-bold tracking-tight">
        {user.nickname ?? "이름 없음"}
      </h1>
      <p className="mt-1 text-sm text-gray-500">{user.email ?? "이메일 없음"}</p>

      <section className="mt-8 rounded-card bg-white border border-gray-100 p-5">
        <h2 className="font-semibold">기본 정보</h2>
        <dl className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-6 text-sm">
          <Field label="이름" value={user.name} />
          <Field label="생년월일" value={user.birthDate} />
          <Field label="성별" value={user.gender} />
          <Field label="Provider" value={user.provider} />
          <Field label="가입일" value={formatDate(user.createdAt)} />
          <Field label="User ID" value={userId} mono />
        </dl>
      </section>

      <section className="mt-6 rounded-card bg-white border border-gray-100 p-5">
        <h2 className="font-semibold">프로필 ({profiles.length})</h2>
        {profiles.length === 0 ? (
          <p className="mt-3 text-sm text-gray-400">등록된 프로필 없음</p>
        ) : (
          <ul className="mt-3 divide-y divide-gray-100">
            {profiles.map((p) => (
              <li key={p.id} className="py-2.5 flex items-center justify-between text-sm">
                <span>
                  {p.name ?? p.id}
                  {p.isDefault && (
                    <span className="ml-2 text-xs rounded-full bg-brand-soft text-brand-dark px-2 py-0.5">
                      기본
                    </span>
                  )}
                </span>
                <span className="text-gray-500">등록 약 {p.medicationCount}건</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-6 rounded-card bg-white border border-gray-100 p-5">
        <h2 className="font-semibold">최근 복약 기록 (5건)</h2>
        {history.length === 0 ? (
          <p className="mt-3 text-sm text-gray-400">기록 없음</p>
        ) : (
          <ul className="mt-3 divide-y divide-gray-100 text-sm">
            {history.map((h) => (
              <li key={h.id} className="py-2.5 flex items-center justify-between">
                <span>{h.inTakeDate ?? "—"}</span>
                <span className="text-gray-500 truncate ml-3" title={h.medicationId}>
                  {h.medicationId ?? "—"}
                </span>
                <span className="ml-3">
                  {h.isTaken ? (
                    <span className="text-xs rounded-full bg-brand-soft text-brand-dark px-2 py-0.5">
                      복용
                    </span>
                  ) : (
                    <span className="text-xs rounded-full bg-gray-100 text-gray-500 px-2 py-0.5">
                      미복용
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-6 rounded-card bg-white border border-gray-100 p-5">
        <h2 className="font-semibold">FCM 토큰 ({tokens.length})</h2>
        {tokens.length === 0 ? (
          <p className="mt-3 text-sm text-gray-400">등록된 디바이스 없음</p>
        ) : (
          <ul className="mt-3 divide-y divide-gray-100 text-sm">
            {tokens.map((t) => (
              <li key={t.id} className="py-2.5 flex items-center justify-between gap-3">
                <span className="text-gray-700">
                  {t.platform ?? "—"}
                  {t.appVersion && (
                    <span className="ml-2 text-xs text-gray-400">v{t.appVersion}</span>
                  )}
                </span>
                <span className="text-xs text-gray-500">
                  {t.notificationEnabled === false ? "알림 끔" : "알림 켬"}
                </span>
                <span className="text-xs text-gray-400 truncate" title={t.id}>
                  {t.id}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Field({
  label,
  value,
  mono,
}: {
  label: string;
  value?: string;
  mono?: boolean;
}) {
  return (
    <>
      <dt className="text-gray-500">{label}</dt>
      <dd
        className={`md:col-span-2 font-medium ${mono ? "font-mono text-xs break-all" : ""}`}
      >
        {value ?? "—"}
      </dd>
    </>
  );
}
