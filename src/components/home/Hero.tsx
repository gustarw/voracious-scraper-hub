
import { ArrowRight, Database, Code, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-28 overflow-hidden bg-black">
      {/* Background gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-full">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-3/4 h-3/4 bg-scrapvorn-orange/20 rounded-full blur-[120px] opacity-70"></div>
      </div>
      
      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center space-y-8 animate-fade-in">
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-scrapvorn-gray/30 bg-scrapvorn-gray/5 backdrop-blur-sm">
            <span className="text-sm font-medium text-scrapvorn-orange">Apresentando Scrapvorn 1.0</span>
          </div>
          
          <h1 className="max-w-4xl font-bold leading-tight tracking-tighter">
            <span className="block text-gradient">Extração Voraz de Dados</span>
            <span className="block text-white">Para Profissionais Modernos</span>
          </h1>
          
          <p className="max-w-2xl text-xl text-scrapvorn-gray">
            Plataforma precisa e poderosa de web scraping para profissionais de marketing, analistas de dados e empresas que buscam insights acionáveis a partir de dados web.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-8">
            <Button 
              size="lg" 
              className="bg-scrapvorn-orange hover:bg-scrapvorn-orangeLight text-black font-medium px-8 py-6 rounded-lg group"
            >
              Começar a Extrair 
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-scrapvorn-gray/30 hover:bg-white/5 text-scrapvorn-orange hover:text-scrapvorn-orangeLight"
            >
              Ver Demonstração
            </Button>
          </div>
          
          {/* Trust indicators */}
          <div className="mt-16 w-full">
            <p className="text-scrapvorn-gray mb-6">Confiado por equipes orientadas a dados em todo o mundo</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-2">
              {["Company 1", "Company 2", "Company 3", "Company 4"].map((company, index) => (
                <div 
                  key={company} 
                  className="flex justify-center items-center h-12 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="text-scrapvorn-gray font-medium">{company}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Features preview */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-24 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Database,
              title: "Extração Poderosa",
              description: "Extraia dados de qualquer site com precisão e velocidade."
            },
            {
              icon: Code,
              title: "Filtros Avançados",
              description: "Filtre e transforme seus dados com nosso poderoso motor de consultas."
            },
            {
              icon: Shield,
              title: "Seguro & Confiável",
              description: "Segurança de nível empresarial com proxies rotativos e limitadores de taxa."
            }
          ].map((feature, index) => (
            <FeatureCard 
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={index}
            />
          ))}
        </div>
      </div>
      
      {/* Scroll down indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center animate-pulse-subtle">
        <span className="text-scrapvorn-gray text-sm mb-2">Role para explorar</span>
        <div className="w-[30px] h-[50px] rounded-full border-2 border-scrapvorn-gray/30 flex justify-center p-2">
          <div className="w-1 h-3 bg-scrapvorn-orange rounded-full animate-[bounce_2s_infinite]"></div>
        </div>
      </div>
    </section>
  );
}

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  index: number;
}

function FeatureCard({ icon: Icon, title, description, index }: FeatureCardProps) {
  return (
    <div 
      className={cn(
        "group p-6 rounded-xl border border-scrapvorn-gray/10 bg-gradient-to-b from-white/5 to-transparent backdrop-blur-sm hover:border-scrapvorn-orange/30 transition-all duration-300 animate-slide-up",
      )}
      style={{ animationDelay: `${index * 100 + 300}ms` }}
    >
      <div className="w-12 h-12 rounded-lg bg-scrapvorn-orange/10 flex items-center justify-center mb-4 group-hover:bg-scrapvorn-orange/20 transition-colors">
        <Icon className="h-6 w-6 text-scrapvorn-orange" />
      </div>
      <h3 className="font-medium text-xl text-white mb-2">{title}</h3>
      <p className="text-scrapvorn-gray">{description}</p>
    </div>
  );
}
