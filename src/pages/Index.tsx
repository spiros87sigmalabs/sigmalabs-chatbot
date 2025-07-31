import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { ServicesSection } from "@/components/ServicesSection";
import { ProcessSection } from "@/components/ProcessSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";
import AiBusinessProblemSolver from "@/components/AiBusinessProblemSolver"; // 👈 Νέο import

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <ServicesSection />
      <ProcessSection />

      {/* ✅ AI-Powered Problem Solver Section */}
      <AiBusinessProblemSolver />

      <TestimonialsSection />

      {/* ✅ Scroll anchor για CTA */}
      <section id="cta">
        <CTASection />
      </section>

      <Footer />
    </div>
  );
};

export default Index;
