import { Link } from "react-router-dom";
import { FAQ_ITEMS } from "./faqItems";
import FAQList from "./FAQList";

export default function FAQ() {
  const preview = FAQ_ITEMS.filter((item) => item.featured);
  return (
    <section
      className="max-w-3xl mx-auto px-6 py-20"
      aria-labelledby="faq-heading"
    >
      <div className="text-center">
        <p className="text-brand font-semibold">FAQ</p>
        <h2
          id="faq-heading"
          className="mt-2 text-3xl md:text-4xl font-bold tracking-tight"
        >
          약꼭에 대해 자주 묻는 질문
        </h2>
        <p className="mt-4 text-gray-600">
          복약 관리 앱 약꼭이 처음이신 분들을 위해 자주 묻는 질문을 모았어요.
        </p>
      </div>
      <div className="mt-10">
        <FAQList items={preview} layout="flat" />
      </div>
      <div className="mt-8 text-center">
        <Link
          to="/faq"
          className="inline-flex items-center gap-1 text-brand font-semibold hover:underline"
        >
          전체 FAQ 보기
          <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}
