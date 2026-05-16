import { FAQ_ITEMS } from "./faqItems";

export default function FAQ() {
  return (
    <section className="max-w-3xl mx-auto px-6 py-20" aria-labelledby="faq-heading">
      <div className="text-center">
        <p className="text-brand font-semibold">FAQ</p>
        <h2 id="faq-heading" className="mt-2 text-3xl md:text-4xl font-bold tracking-tight">
          약꼭에 대해 자주 묻는 질문
        </h2>
        <p className="mt-4 text-gray-600">
          복약 관리 앱 약꼭이 처음이신 분들을 위해 자주 묻는 질문을 모았어요.
        </p>
      </div>
      <div className="mt-10 space-y-3">
        {FAQ_ITEMS.map((item) => (
          <details
            key={item.q}
            className="group rounded-card border border-gray-200 bg-white p-5 open:border-brand transition"
          >
            <summary className="flex items-center justify-between cursor-pointer list-none font-semibold text-gray-900">
              <span>{item.q}</span>
              <span
                aria-hidden
                className="ml-4 text-gray-400 group-open:rotate-45 transition-transform text-xl leading-none"
              >
                +
              </span>
            </summary>
            <p className="mt-3 text-gray-600 leading-relaxed">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
