
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HowItWorks as HowItWorksSection } from "@/components/home/HowItWorks";
import { CallToAction } from "@/components/home/CallToAction";

const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main>
        <div className="pt-28 pb-12 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-white font-bold mb-6 leading-tight">
              Como o <span className="text-gradient">Scrapvorn</span> Funciona
            </h1>
            <p className="text-scrapvorn-gray text-xl">
              Entenda o fluxo de trabalho simplificado e eficiente do Scrapvorn para extração de dados.
            </p>
          </div>
        </div>
        <HowItWorksSection />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default HowItWorks;
