import {
  collection,
  collectionGroup,
  getCountFromServer,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export type Provider = "kakao" | "apple";

export type OverviewKpis = {
  totalUsers: number;
  newToday: number;
  activeProfiles: number;
  notificationSuccessRate7d: number | null;
};

export type SignupPoint = {
  date: string;
  kakao: number;
  apple: number;
};

export type ProviderDist = { provider: Provider | "기타"; count: number };

function startOfDayIso(daysAgo = 0): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
}

function dateKey(iso: string): string {
  return iso.slice(0, 10);
}

export async function fetchOverviewKpis(): Promise<OverviewKpis> {
  const usersRef = collection(db, "users");
  const profilesRef = collectionGroup(db, "profiles");

  const todayStart = startOfDayIso(0);
  const sevenDaysAgo = startOfDayIso(6);

  const [totalSnap, todaySnap, profilesSnap, dispatchSnap] = await Promise.all([
    getCountFromServer(usersRef),
    getCountFromServer(query(usersRef, where("createdAt", ">=", todayStart))),
    getCountFromServer(profilesRef),
    getDocs(
      query(
        collection(db, "notificationDispatches"),
        where("dispatchedAt", ">=", sevenDaysAgo)
      )
    ),
  ]);

  let sent = 0;
  let attempted = 0;
  dispatchSnap.forEach((doc) => {
    const s = doc.get("status") as string | undefined;
    if (!s) return;
    if (s === "sent" || s === "partial" || s === "failed") {
      attempted += 1;
      if (s === "sent" || s === "partial") sent += 1;
    }
  });

  return {
    totalUsers: totalSnap.data().count,
    newToday: todaySnap.data().count,
    activeProfiles: profilesSnap.data().count,
    notificationSuccessRate7d: attempted > 0 ? sent / attempted : null,
  };
}

export async function fetchSignupTrend14d(): Promise<SignupPoint[]> {
  const since = startOfDayIso(13);
  const snap = await getDocs(
    query(collection(db, "users"), where("createdAt", ">=", since))
  );

  const buckets = new Map<string, { kakao: number; apple: number }>();
  for (let i = 13; i >= 0; i -= 1) {
    buckets.set(dateKey(startOfDayIso(i)), { kakao: 0, apple: 0 });
  }
  snap.forEach((doc) => {
    const iso = doc.get("createdAt") as string | undefined;
    const provider = doc.get("provider") as Provider | undefined;
    if (!iso || !provider) return;
    const key = dateKey(iso);
    const b = buckets.get(key);
    if (b && (provider === "kakao" || provider === "apple")) {
      b[provider] += 1;
    }
  });

  return Array.from(buckets.entries()).map(([date, counts]) => ({
    date: date.slice(5),
    ...counts,
  }));
}

export async function fetchProviderDist(): Promise<ProviderDist[]> {
  const snap = await getDocs(collection(db, "users"));
  const counts: Record<string, number> = { kakao: 0, apple: 0, 기타: 0 };
  snap.forEach((doc) => {
    const p = doc.get("provider") as string | undefined;
    if (p === "kakao" || p === "apple") counts[p] += 1;
    else counts["기타"] += 1;
  });
  return (Object.keys(counts) as Array<Provider | "기타">).map((provider) => ({
    provider,
    count: counts[provider],
  }));
}
