export default function CTA() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <div className="rounded-card bg-brand text-white py-16 md:py-20 px-6 text-center">
        <div className="text-3xl" aria-hidden>
          🙌 💊 ⏰
        </div>
        <h2 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight">
          곧 만나요. 약꼭이 곧 출시됩니다.
        </h2>
        <p className="mt-4 text-white/85 max-w-xl mx-auto">
          오늘부터 약 걱정 없이. 출시 알림을 받으면 가장 먼저 소식을 전해
          드릴게요.
        </p>
        <div className="mt-8">
          <button
            type="button"
            disabled
            className="rounded-full bg-white text-brand-dark font-semibold px-6 py-3 cursor-not-allowed opacity-90"
          >
            출시 알림 받기 (준비 중)
          </button>
        </div>
      </div>
    </section>
  );
}
