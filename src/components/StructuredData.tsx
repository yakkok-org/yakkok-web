import { useEffect } from "react";
import { FAQ_ITEMS } from "./faqItems";

const SITE_URL = "https://yakkok.netlify.app";
const OG_IMAGE = `${SITE_URL}/og-default.png`;

const ORGANIZATION = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "약꼭",
  alternateName: "yakkok",
  url: SITE_URL,
  logo: OG_IMAGE,
  description: "매일의 복약을 챙겨주는 복약 관리 서비스",
};

const SOFTWARE_APP = {
  "@context": "https://schema.org",
  "@type": "MobileApplication",
  name: "약꼭",
  description:
    "약꼭은 매일 정해진 시간에 복약 알림을 보내고, 가족과 함께 복약을 관리할 수 있는 무료 복약 관리 앱입니다.",
  applicationCategory: "HealthApplication",
  operatingSystem: "iOS, Android",
  url: SITE_URL,
  image: OG_IMAGE,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "KRW",
  },
  author: {
    "@type": "Organization",
    name: "약꼭",
  },
};

const FAQ_PAGE = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

const SCHEMAS = [ORGANIZATION, SOFTWARE_APP, FAQ_PAGE];

export default function StructuredData() {
  useEffect(() => {
    document.head
      .querySelectorAll('script[data-seo="structured-data"]')
      .forEach((n) => n.remove());

    const nodes = SCHEMAS.map((schema) => {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.dataset.seo = "structured-data";
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
      return script;
    });
    return () => {
      nodes.forEach((n) => n.remove());
    };
  }, []);
  return null;
}
