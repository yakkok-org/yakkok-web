import { SITE_URL, OG_DEFAULT } from "@/lib/seo";

const ORGANIZATION = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "약꼭",
  alternateName: "yakkok",
  url: SITE_URL,
  logo: OG_DEFAULT,
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
  image: OG_DEFAULT,
  offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
  author: { "@type": "Organization", name: "약꼭" },
};

export default function OrganizationLd() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SOFTWARE_APP) }}
      />
    </>
  );
}
