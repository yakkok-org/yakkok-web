export default function Hero() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20 md:py-28">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-brand-soft text-brand-dark px-3 py-1 text-sm font-medium">
            <span aria-hidden>🙌</span> 가족과 함께 챙기는 복약 습관
          </p>
          <h1 className="mt-5 text-4xl md:text-6xl font-bold tracking-tight leading-tight">
            약을 잊지 마세요.
            <br />
            <span className="text-brand">약꼭</span>이 챙겨드릴게요.
          </h1>
          <p className="mt-6 text-lg text-gray-600 leading-relaxed">
            약꼭은 매일 정해진 시간에 복약 알림을 보내드리는 복약 관리 앱이에요.
            <br className="hidden md:block" />
            영양제부터 처방약까지, 가족과 함께 한 곳에서 똑똑하게 챙기세요.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="https://apps.apple.com/kr/app/id6752120136"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-brand text-white px-6 py-3 font-semibold shadow-sm hover:bg-brand-dark transition"
            >
              App Store에서 받기
            </a>
            <a
              href="#features"
              className="rounded-full border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:border-brand hover:text-brand transition"
            >
              더 알아보기
            </a>
          </div>
        </div>

        <div className="relative">
          <div className="bg-brand-soft rounded-card p-8 md:p-10">
            <div className="bg-white rounded-card shadow-sm p-5 flex items-start gap-3">
              <div className="text-2xl" aria-hidden>
                ⏰
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">오전 8:30</p>
                <p className="mt-1 font-semibold">
                  지금 복용할 시간이에요!
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  비타민 D · 오메가3
                </p>
                <div className="mt-3 flex gap-2 text-xs">
                  <span className="rounded-full bg-brand text-white px-3 py-1 font-medium">
                    복용했어요
                  </span>
                  <span className="rounded-full border border-gray-200 text-gray-600 px-3 py-1">
                    10분 미루기
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 bg-white rounded-card shadow-sm p-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand text-white flex items-center justify-center text-lg">
                ✓
              </div>
              <div>
                <p className="font-semibold">복약을 완료했어요</p>
                <p className="text-sm text-gray-500">
                  약꼭을 시작한지 28일째에요 🙌
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
              <span className="w-2 h-2 rounded-full bg-cat-supplement" />
              <span>영양제</span>
              <span className="w-2 h-2 rounded-full bg-cat-chronic ml-2" />
              <span>만성질환</span>
              <span className="w-2 h-2 rounded-full bg-cat-mental ml-2" />
              <span>수면</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
