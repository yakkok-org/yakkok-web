import AppStoreLink from "@/components/AppStoreLink";

export default function CTA() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <div className="rounded-card bg-brand text-white py-16 md:py-20 px-6 text-center">
        <div className="text-3xl" aria-hidden>
          🙌 💊 ⏰
        </div>
        <h2 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight">
          지금 약꼭과 함께 시작하세요
        </h2>
        <p className="mt-4 text-white/85 max-w-xl mx-auto">
          App Store에서 약꼭을 받아 매일의 복약을 안전하게 챙겨보세요.
        </p>
        <div className="mt-8">
          <AppStoreLink
            location="cta_bottom"
            className="rounded-full bg-white text-brand-dark font-semibold px-6 py-3 hover:bg-gray-100 transition"
          >
            App Store에서 다운로드
          </AppStoreLink>
        </div>
      </div>
    </section>
  );
}
