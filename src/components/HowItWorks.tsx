const STEPS = [
  {
    n: 1,
    title: "간편 로그인",
    body: "Kakao 또는 Apple 계정으로 1초만에 시작하세요.",
  },
  {
    n: 2,
    title: "약 등록",
    body: "약 이름, 복용 시간, 요일을 입력해 주세요.",
  },
  {
    n: 3,
    title: "알림 받기",
    body: "시간이 되면 약꼭이 알려드려요. 체크 한 번으로 끝.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-brand font-semibold">시작하는 법</p>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight">
            3단계로 시작하세요
          </h2>
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-8">
          {STEPS.map((s) => (
            <div key={s.n} className="text-center md:text-left">
              <div className="w-12 h-12 rounded-full bg-brand text-white flex items-center justify-center text-lg font-bold mx-auto md:mx-0">
                {s.n}
              </div>
              <h3 className="mt-4 font-semibold text-lg">{s.title}</h3>
              <p className="mt-2 text-gray-600 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
