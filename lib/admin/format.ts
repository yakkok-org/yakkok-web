/**
 * Firestore의 date-like 필드는 다음 중 하나로 저장돼 있다:
 * - ISO string ("2026-05-17T...")
 * - Firestore Timestamp 객체 ({ toDate(): Date })
 * - JS Date
 *
 * 어떤 형태든 안전하게 ISO string으로 변환한다.
 */
export function toIsoString(v: unknown): string | undefined {
  if (v == null) return undefined;
  if (typeof v === "string") return v;
  if (v instanceof Date) return v.toISOString();
  if (
    typeof v === "object" &&
    v !== null &&
    "toDate" in v &&
    typeof (v as { toDate: unknown }).toDate === "function"
  ) {
    try {
      return (v as { toDate: () => Date }).toDate().toISOString();
    } catch {
      return undefined;
    }
  }
  return undefined;
}

export function formatDate(v: unknown): string {
  const iso = toIsoString(v);
  return iso ? iso.slice(0, 10) : "—";
}

export function formatDateTime(v: unknown): string {
  const iso = toIsoString(v);
  return iso ? iso.replace("T", " ").slice(0, 16) : "—";
}

export function daysSince(v: unknown): number | null {
  const iso = toIsoString(v);
  if (!iso) return null;
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return null;
  return Math.floor((Date.now() - t) / (1000 * 60 * 60 * 24));
}

export function isExpired(v: unknown): boolean {
  const iso = toIsoString(v);
  if (!iso) return false;
  return iso < new Date().toISOString();
}
