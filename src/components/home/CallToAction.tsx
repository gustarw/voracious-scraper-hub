import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/auth";

export function CallToAction() {
  const { user } = useAuth();
  
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-black">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-3/4 bg-scrapvorn-orange/10 rounded-full blur-[150px] opacity-80"></div>
        </div>
      </div>
      
      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-white font-bold mb-6 leading-tight">
            Pronto para Extrair Dados com <span className="text-gradient">Precisão Incomparável</span>?
          </h2>
          
          <p className="text-scrapvorn-gray text-xl mb-10 max-w-2xl mx-auto">
            Junte-se a milhares de profissionais que confiam no Scrapvorn para suas necessidades de extração de dados. Comece a extrair em minutos.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-scrapvorn-orange hover:bg-scrapvorn-orangeLight text-black font-medium px-8 py-6 rounded-lg group"
              asChild
            >
              <Link to={user ? "/dashboard" : "/auth"}>
                {user ? "Ir para o Dashboard" : "Começar a Extrair Agora"}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-scrapvorn-gray/30 hover:bg-white/5 text-scrapvorn-orange hover:text-scrapvorn-orangeLight"
            >
              Agendar uma Demo
            </Button>
          </div>
          
          <div className="mt-10 pt-10 border-t border-scrapvorn-gray/10 max-w-xl mx-auto">
            <p className="text-scrapvorn-gray">
              Não é necessário cartão de crédito. Comece com nosso plano gratuito e faça upgrade conforme suas necessidades.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
