import type { Metadata } from "next";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import MedicationCategories from "@/components/MedicationCategories";
import AudienceSection from "@/components/AudienceSection";
import HowItWorks from "@/components/HowItWorks";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import OrganizationLd from "@/components/jsonld/OrganizationLd";
import { SITE_URL } from "@/lib/seo";

const TITLE = "약꼭 - 복약 알림과 가족 공유로 매일의 약을 챙기는 앱";
const DESCRIPTION =
  "약꼭은 매일 정해진 시간에 복약 알림을 보내고, 가족과 함께 복약을 관리할 수 있는 무료 복약 관리 앱입니다. 영양제부터 처방약까지 캘린더로 한눈에 기록해요.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: SITE_URL + "/" },
  openGraph: {
    type: "website",
    url: SITE_URL + "/",
    title: "약꼭 - 매일의 복약을 챙겨주는 앱",
    description:
      "매일 정해진 시간에 복약 알림, 가족과 함께 관리하는 캘린더 기록까지. 약꼭이 챙겨드릴게요.",
  },
  twitter: {
    card: "summary_large_image",
    title: "약꼭 - 매일의 복약을 챙겨주는 앱",
    description:
      "매일 정해진 시간에 복약 알림, 가족과 함께 관리하는 캘린더 기록까지.",
  },
};

export default function HomePage() {
  return (
    <>
      <OrganizationLd />
      <Hero />
      <Features />
      <MedicationCategories />
      <AudienceSection />
      <HowItWorks />
      <FAQ />
      <CTA />
    </>
  );
}
