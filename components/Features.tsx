import FeatureCard from "./FeatureCard";

const FEATURES = [
  {
    emoji: "⏰",
    title: "정확한 복약 알림",
    body: "정해진 시간에 잊지 않게 알려드려요. 요일별, 시간별 자유로운 설정.",
  },
  {
    emoji: "✓",
    title: "간편한 체크",
    body: "복용했어요 · 10분 미루기 · 오늘 건너뛰기. 실제 생활에 맞춘 선택지.",
  },
  {
    emoji: "📅",
    title: "캘린더 기록",
    body: "한눈에 보는 복약 히스토리. 빠진 약도, 챙긴 약도 색깔로 확인.",
  },
  {
    emoji: "👨‍👩‍👧",
    title: "가족과 함께",
    body: "공유 코드 한 줄로 부모님 복약도 함께 관리할 수 있어요.",
  },
  {
    emoji: "🐾",
    title: "반려동물도 OK",
    body: "프로필을 추가해 우리 아이의 약도 같은 방식으로 챙기세요.",
  },
  {
    emoji: "🔐",
    title: "간편 로그인",
    body: "Kakao · Apple 로그인으로 1초만에 시작.",
  },
];

export default function Features() {
  return (
    <section id="features" className="max-w-6xl mx-auto px-6 py-20">
      <div className="text-center max-w-2xl mx-auto">
        <p className="text-brand font-semibold">기능</p>
        <h2 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight">
          복약 관리에 필요한 모든 기능
        </h2>
        <p className="mt-4 text-gray-600">
          정확한 복약 알림, 손쉬운 복약 기록, 가족 공유까지 — 약 알림 앱에 필요한
          모든 기능을 한 곳에서 제공해요.
        </p>
      </div>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURES.map((f) => (
          <FeatureCard key={f.title} {...f} />
        ))}
      </div>
    </section>
  );
}
