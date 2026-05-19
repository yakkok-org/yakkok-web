import type { Metadata } from "next";
import FAQList from "@/components/FAQList";
import FaqLd from "@/components/jsonld/FaqLd";
import CTA from "@/components/CTA";
import { FAQ_ITEMS } from "@/lib/faqItems";
import { SITE_URL } from "@/lib/seo";

const TITLE = "자주 묻는 질문 (FAQ) | 약꼭";
const DESCRIPTION =
  "약꼭 복약 관리 앱에 대한 자주 묻는 질문을 모았습니다. 요금, 가족 공유, 알림, 로그인, 출시 일정 등 궁금한 점을 한 곳에서 확인해보세요.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: SITE_URL + "/faq" },
  openGraph: {
    type: "website",
    url: SITE_URL + "/faq",
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default function FaqPage() {
  return (
    <>
      <FaqLd items={FAQ_ITEMS} />
      <section
        className="max-w-3xl mx-auto px-6 py-20"
        aria-labelledby="faq-page-heading"
      >
        <div className="text-center">
          <p className="text-brand font-semibold">FAQ</p>
          <h1
            id="faq-page-heading"
            className="mt-2 text-3xl md:text-4xl font-bold tracking-tight"
          >
            자주 묻는 질문
          </h1>
          <p className="mt-4 text-gray-600">
            약꼭을 처음 사용하시는 분들이 가장 많이 묻는 질문을 카테고리별로
            정리했어요. 찾으시는 답변이 없다면{" "}
            <a
              href="mailto:yakkok.official@gmail.com"
              className="text-brand-dark hover:underline"
            >
              yakkok.official@gmail.com
            </a>
            으로 알려주세요.
          </p>
        </div>
        <div className="mt-12">
          <FAQList items={FAQ_ITEMS} layout="grouped" />
        </div>
      </section>
      <CTA />
    </>
  );
}
