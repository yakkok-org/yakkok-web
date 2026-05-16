const CATEGORIES = [
  { dot: "bg-cat-supplement", name: "영양제", example: "비타민, 오메가3" },
  { dot: "bg-cat-otc", name: "일반의약품", example: "해열제, 소화제" },
  {
    dot: "bg-cat-allergy",
    name: "알레르기·호흡기",
    example: "비염, 천식약",
  },
  { dot: "bg-cat-chronic", name: "만성질환", example: "혈압, 당뇨" },
  { dot: "bg-cat-rx", name: "처방약", example: "의사 처방" },
  { dot: "bg-cat-mental", name: "정신건강·수면", example: "수면제, 항우울제" },
];

const DOT_COLORS = [
  "bg-cat-supplement",
  "bg-cat-otc",
  "bg-cat-chronic",
  "bg-cat-mental",
  "bg-cat-allergy",
  "bg-cat-rx",
];

function CalendarPreview() {
  const cells = Array.from({ length: 35 });
  return (
    <div className="mt-12 mx-auto max-w-md rounded-card bg-white border border-gray-100 p-5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold">5월</span>
        <span className="text-gray-400">2026</span>
      </div>
      <div className="grid grid-cols-7 gap-2 mt-3 text-[10px] text-gray-400 text-center">
        {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2 mt-2">
        {cells.map((_, i) => {
          const hasDot1 = (i * 7) % 5 < 3;
          const hasDot2 = i % 4 === 0;
          const hasDot3 = i % 6 === 0;
          return (
            <div
              key={i}
              className="aspect-square rounded-md bg-gray-50 flex flex-col items-center justify-end p-1 gap-0.5"
            >
              <div className="flex gap-0.5">
                {hasDot1 && (
                  <span
                    className={`w-1 h-1 rounded-full ${DOT_COLORS[i % DOT_COLORS.length]}`}
                  />
                )}
                {hasDot2 && (
                  <span
                    className={`w-1 h-1 rounded-full ${DOT_COLORS[(i + 2) % DOT_COLORS.length]}`}
                  />
                )}
                {hasDot3 && (
                  <span
                    className={`w-1 h-1 rounded-full ${DOT_COLORS[(i + 4) % DOT_COLORS.length]}`}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function MedicationCategories() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-brand font-semibold">분류</p>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight">
            약의 종류에 따라 똑똑하게 분류해요
          </h2>
          <p className="mt-4 text-gray-600">
            영양제 알림, 만성질환약 복용 관리, 처방약 기록까지 — 6가지 카테고리로
            약을 정리하면 복약 캘린더에 색깔 점으로 한눈에 확인할 수 있어요.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-4">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.name}
              className="rounded-card bg-white border border-gray-100 p-5 flex items-start gap-3"
            >
              <span
                className={`mt-1.5 w-3 h-3 rounded-full ${cat.dot} flex-shrink-0`}
              />
              <div>
                <p className="font-semibold">{cat.name}</p>
                <p className="text-sm text-gray-500 mt-1">{cat.example}</p>
              </div>
            </div>
          ))}
        </div>
        <CalendarPreview />
      </div>
    </section>
  );
}
