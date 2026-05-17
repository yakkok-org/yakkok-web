import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  fetchOverviewKpis,
  fetchProviderDist,
  fetchSignupTrend14d,
  type OverviewKpis,
  type ProviderDist,
  type SignupPoint,
} from "../lib/aggregate";

function KpiCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-card bg-white border border-gray-100 p-5">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
      {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
    </div>
  );
}

export default function Overview() {
  const [kpis, setKpis] = useState<OverviewKpis | null>(null);
  const [trend, setTrend] = useState<SignupPoint[]>([]);
  const [dist, setDist] = useState<ProviderDist[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [k, t, d] = await Promise.all([
          fetchOverviewKpis(),
          fetchSignupTrend14d(),
          fetchProviderDist(),
        ]);
        if (cancelled) return;
        setKpis(k);
        setTrend(t);
        setDist(d);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "데이터를 불러오지 못했어요.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">개요</h1>
      <p className="mt-1 text-sm text-gray-500">
        가입·활성·알림 지표를 한눈에 확인하세요.
      </p>

      {error && (
        <div className="mt-6 rounded-card border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="총 가입자"
          value={loading || !kpis ? "—" : kpis.totalUsers.toLocaleString("ko-KR")}
        />
        <KpiCard
          label="오늘 신규"
          value={loading || !kpis ? "—" : kpis.newToday.toLocaleString("ko-KR")}
          hint="자정 이후 가입"
        />
        <KpiCard
          label="활성 프로필"
          value={
            loading || !kpis ? "—" : kpis.activeProfiles.toLocaleString("ko-KR")
          }
          hint="공유 프로필 포함"
        />
        <KpiCard
          label="알림 성공률"
          value={
            loading || !kpis
              ? "—"
              : kpis.notificationSuccessRate7d === null
                ? "데이터 없음"
                : `${(kpis.notificationSuccessRate7d * 100).toFixed(1)}%`
          }
          hint="최근 7일"
        />
      </div>

      <div className="mt-10 grid lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 rounded-card bg-white border border-gray-100 p-5">
          <h2 className="font-semibold">가입 추이 (14일)</h2>
          <div className="mt-4 h-64">
            {loading ? (
              <p className="text-sm text-gray-400">로딩 중…</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                  <YAxis allowDecimals={false} stroke="#9ca3af" fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="kakao"
                    stroke="#18c988"
                    name="Kakao"
                  />
                  <Line
                    type="monotone"
                    dataKey="apple"
                    stroke="#6366f1"
                    name="Apple"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </section>

        <section className="rounded-card bg-white border border-gray-100 p-5">
          <h2 className="font-semibold">Provider 분포</h2>
          <div className="mt-4 h-64">
            {loading ? (
              <p className="text-sm text-gray-400">로딩 중…</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dist}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="provider" stroke="#9ca3af" fontSize={12} />
                  <YAxis allowDecimals={false} stroke="#9ca3af" fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#18c988" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
