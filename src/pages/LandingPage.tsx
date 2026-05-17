import { Helmet } from "react-helmet-async";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Features from "../components/Features";
import MedicationCategories from "../components/MedicationCategories";
import AudienceSection from "../components/AudienceSection";
import HowItWorks from "../components/HowItWorks";
import FAQ from "../components/FAQ";
import CTA from "../components/CTA";
import Footer from "../components/Footer";
import StructuredData from "../components/StructuredData";

const TITLE = "약꼭 - 복약 알림과 가족 공유로 매일의 약을 챙기는 앱";
const DESCRIPTION =
  "약꼭은 매일 정해진 시간에 복약 알림을 보내고, 가족과 함께 복약을 관리할 수 있는 무료 복약 관리 앱입니다. 영양제부터 처방약까지 캘린더로 한눈에 기록해요.";
const CANONICAL = "https://yakkok.netlify.app/";
const OG_IMAGE = "https://yakkok.netlify.app/og-default.png";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Helmet>
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        <link rel="canonical" href={CANONICAL} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={CANONICAL} />
        <meta property="og:title" content="약꼭 - 매일의 복약을 챙겨주는 앱" />
        <meta
          property="og:description"
          content="매일 정해진 시간에 복약 알림, 가족과 함께 관리하는 캘린더 기록까지. 약꼭이 챙겨드릴게요."
        />
        <meta property="og:image" content={OG_IMAGE} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="약꼭 - 매일의 복약을 챙겨주는 앱" />
        <meta
          name="twitter:description"
          content="매일 정해진 시간에 복약 알림, 가족과 함께 관리하는 캘린더 기록까지."
        />
        <meta name="twitter:image" content={OG_IMAGE} />
      </Helmet>
      <StructuredData />
      <Header />
      <main className="flex-1">
        <Hero />
        <Features />
        <MedicationCategories />
        <AudienceSection />
        <HowItWorks />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
