const AUDIENCE = [
  { emoji: "💊", title: "만성질환 환자", body: "혈압·당뇨 등 매일 챙겨야 하는 약" },
  { emoji: "🧓", title: "어르신", body: "큰 글자와 간단한 체크로 부담 없이" },
  { emoji: "👪", title: "보호자·가족", body: "공유 코드로 함께 관리" },
  { emoji: "🐶", title: "반려동물 보호자", body: "우리 아이 약도 같은 방식으로" },
  { emoji: "🌿", title: "영양제 챙기는 누구나", body: "비타민·오메가3도 잊지 않게" },
];

export default function AudienceSection() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <div className="text-center max-w-2xl mx-auto">
        <p className="text-brand font-semibold">사용자</p>
        <h2 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight">
          누구를 위한 앱인가요?
        </h2>
        <p className="mt-4 text-gray-600">
          약을 챙겨야 하는 모든 분께. 혼자서도, 가족과 함께도.
        </p>
      </div>
      <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {AUDIENCE.map((a) => (
          <div
            key={a.title}
            className="rounded-card bg-white border border-gray-100 p-5 text-center hover:border-brand transition"
          >
            <div className="text-3xl" aria-hidden>
              {a.emoji}
            </div>
            <p className="mt-3 font-semibold">{a.title}</p>
            <p className="mt-1 text-sm text-gray-500 leading-relaxed">{a.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
