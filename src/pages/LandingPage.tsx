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

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
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
