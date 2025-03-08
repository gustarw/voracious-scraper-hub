import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CallToAction } from "@/components/home/CallToAction";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/auth";

const Pricing = () => {
  const { user } = useAuth();
  
  const plans = [
    {
      name: "Gratuito",
      price: "R$0",
      description: "Para experimentar e projetos pessoais",
      features: [
        "1.000 extrações por mês",
        "5 projetos ativos",
        "Exportação CSV e JSON",
        "Suporte via comunidade",
        "Acesso à API básica"
      ],
      highlighted: false,
      buttonText: "Começar Grátis"
    },
    {
      name: "Profissional",
      price: "R$99",
      period: "/mês",
      description: "Para profissionais e pequenas equipes",
      features: [
        "20.000 extrações por mês",
        "20 projetos ativos",
        "Exportação para todos os formatos",
        "Suporte prioritário",
        "Acesso à API completa",
        "Proxies rotativos",
        "Agendamento avançado"
      ],
      highlighted: true,
      buttonText: "Escolher Plano"
    },
    {
      name: "Empresarial",
      price: "R$299",
      period: "/mês",
      description: "Para empresas com necessidades avançadas",
      features: [
        "Extrações ilimitadas",
        "Projetos ilimitados",
        "Exportação para todos os formatos",
        "Suporte dedicado 24/7",
        "API com limites elevados",
        "Proxies premium dedicados",
        "Integração personalizada",
        "Treinamento personalizado",
        "SLA garantido"
      ],
      highlighted: false,
      buttonText: "Contato Comercial"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main>
        <div className="pt-28 pb-12 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-white font-bold mb-6 leading-tight">
              <span className="text-gradient">Preços</span> Transparentes
            </h1>
            <p className="text-scrapvorn-gray text-xl">
              Escolha o plano que melhor se adapta às suas necessidades de extração de dados.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <div 
                key={plan.name}
                className={`rounded-2xl overflow-hidden border ${
                  plan.highlighted 
                    ? "border-scrapvorn-orange bg-gradient-to-b from-scrapvorn-orange/20 to-transparent" 
                    : "border-scrapvorn-gray/10 bg-white/5"
                } p-8 flex flex-col h-full relative`}
              >
                {plan.highlighted && (
                  <div className="absolute top-0 right-0 bg-scrapvorn-orange text-black px-4 py-1 text-sm font-medium rounded-bl-lg">
                    Mais Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-scrapvorn-gray ml-1">{plan.period}</span>}
                </div>
                <p className="text-scrapvorn-gray mb-6">{plan.description}</p>
                <ul className="space-y-3 mb-8 flex-grow">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 rounded-full bg-scrapvorn-orange/20 flex items-center justify-center mt-0.5">
                        <Check className="h-3 w-3 text-scrapvorn-orange" />
                      </div>
                      <span className="ml-3 text-scrapvorn-gray">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full ${
                    plan.highlighted 
                      ? "bg-scrapvorn-orange hover:bg-scrapvorn-orangeLight text-black" 
                      : "bg-white/10 hover:bg-white/20"
                  }`}
                  asChild
                >
                  <Link to={user ? "/dashboard" : "/auth"}>{plan.buttonText}</Link>
                </Button>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center max-w-3xl mx-auto">
            <h3 className="text-xl font-medium mb-4">Precisa de um plano personalizado?</h3>
            <p className="text-scrapvorn-gray mb-6">
              Se você tem necessidades específicas ou precisa de uma solução customizada, entre em contato com nossa equipe de vendas.
            </p>
            <Button variant="outline" className="border-scrapvorn-orange text-scrapvorn-orange hover:bg-scrapvorn-orange/10">
              Contato Comercial
            </Button>
          </div>
        </div>
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
