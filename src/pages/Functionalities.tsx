
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Features } from "@/components/home/Features";
import { CallToAction } from "@/components/home/CallToAction";

const Functionalities = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main>
        <div className="pt-28 pb-12 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-white font-bold mb-6 leading-tight">
              <span className="text-gradient">Funcionalidades</span> Poderosas
            </h1>
            <p className="text-scrapvorn-gray text-xl">
              Conheça todas as funcionalidades do Scrapvorn que tornam a extração de dados web mais simples e eficiente.
            </p>
          </div>
        </div>
        <Features />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Functionalities;
