
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { ArrowLeft, CheckCircle } from "lucide-react";

const Assinatura = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  
  // Get the plan from URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const plan = params.get('plan');
    if (plan) {
      setSelectedPlan(plan);
    }
  }, [location]);
  
  // Plans data
  const plans = {
    basic: {
      id: "basic",
      name: "Básico",
      price: "Grátis",
      description: "Comece a usar o Scrapvorn agora mesmo, sem custos.",
      features: [
        "5 scrapes por dia",
        "Exportação em CSV",
        "Suporte por email"
      ]
    },
    pro: {
      id: "pro",
      name: "Profissional",
      price: "R$ 49/mês",
      description: "Ideal para profissionais e pequenas empresas que precisam de mais recursos.",
      features: [
        "100 scrapes por dia",
        "Exportação em CSV e JSON",
        "Agendamento de tarefas",
        "Suporte prioritário",
      ]
    },
    enterprise: {
      id: "enterprise",
      name: "Empresarial",
      price: "R$ 199/mês",
      description: "Solução completa para empresas com necessidades avançadas de web scraping.",
      features: [
        "Scrapes ilimitados",
        "Todos os formatos de exportação",
        "API dedicada",
        "Suporte 24/7",
        "Treinamento personalizado"
      ]
    }
  };
  
  const currentPlan = selectedPlan ? plans[selectedPlan as keyof typeof plans] : null;
  
  const handleSubmit = async () => {
    if (!currentPlan) return;
    
    // Mock payment processing
    setProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      setProcessing(false);
      
      if (currentPlan.id === "basic") {
        // For the free plan, just show success
        navigate("/dashboard/perfil");
        toast({
          title: "Plano alterado com sucesso",
          description: "Você está utilizando o plano Básico."
        });
      } else {
        // For paid plans, redirect to success page
        navigate("/dashboard/assinatura/sucesso?plan=" + currentPlan.id);
      }
    }, 1500);
  };
  
  const handleGoBack = () => {
    navigate("/dashboard/perfil");
  };
  
  return (
    <DashboardLayout>
      <div className="mb-8">
        <Button 
          variant="ghost" 
          onClick={handleGoBack}
          className="mb-4 text-scrapvorn-gray hover:text-white"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar ao perfil
        </Button>
        
        <h1 className="text-3xl font-bold mb-2">Alterar Plano</h1>
        <p className="text-scrapvorn-gray">
          {currentPlan 
            ? `Você está prestes a mudar para o plano ${currentPlan.name}.` 
            : "Selecione um plano na página de perfil."}
        </p>
      </div>
      
      {currentPlan ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-white/5 border-scrapvorn-gray/10">
            <CardHeader>
              <CardTitle>Resumo do plano</CardTitle>
              <CardDescription>
                Detalhes do plano selecionado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <p className="text-xl font-bold">{currentPlan.name}</p>
                <p className="text-2xl font-bold mt-2">{currentPlan.price}</p>
                <p className="text-scrapvorn-gray mt-2">{currentPlan.description}</p>
              </div>
              
              <div className="space-y-2">
                <p className="font-medium mb-2">Recursos incluídos:</p>
                <ul className="space-y-2">
                  {currentPlan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-scrapvorn-orange mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleSubmit}
                className="w-full bg-scrapvorn-orange hover:bg-scrapvorn-orange/90 text-black font-medium"
                disabled={processing}
              >
                {processing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                    Processando...
                  </>
                ) : (
                  currentPlan.id === "basic" 
                    ? "Confirmar Plano Básico" 
                    : "Continuar para o Pagamento"
                )}
              </Button>
            </CardFooter>
          </Card>
          
          <div className="hidden md:block">
            <Card className="bg-white/5 border-scrapvorn-gray/10 h-full">
              <CardHeader>
                <CardTitle>Por que escolher o Scrapvorn?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-lg">
                    <h3 className="text-lg font-medium mb-2">Fácil de usar</h3>
                    <p className="text-scrapvorn-gray">
                      Nossa plataforma foi projetada para ser intuitiva e simples, mesmo para quem não tem experiência técnica.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-white/5 rounded-lg">
                    <h3 className="text-lg font-medium mb-2">Poderoso</h3>
                    <p className="text-scrapvorn-gray">
                      Nossas ferramentas de scraping são capazes de extrair dados de qualquer site, não importa quão complexo seja.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-white/5 rounded-lg">
                    <h3 className="text-lg font-medium mb-2">Suporte</h3>
                    <p className="text-scrapvorn-gray">
                      Nossa equipe está sempre disponível para ajudar você a tirar o máximo proveito da nossa plataforma.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="bg-white/5 border border-scrapvorn-gray/10 rounded-xl p-8 text-center">
          <p className="text-xl mb-4">Nenhum plano selecionado</p>
          <Button 
            onClick={handleGoBack}
            className="bg-scrapvorn-orange hover:bg-scrapvorn-orange/90 text-black font-medium"
          >
            Voltar ao perfil para selecionar um plano
          </Button>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Assinatura;
