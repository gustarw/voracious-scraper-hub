
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { CheckCircle, ArrowRight } from "lucide-react";

const AssinaturaSucesso = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [planId, setPlanId] = useState<string | null>(null);
  
  // Plans data
  const plans = {
    pro: {
      name: "Profissional",
      price: "R$ 49/mês"
    },
    enterprise: {
      name: "Empresarial",
      price: "R$ 199/mês"
    }
  };
  
  // Get the plan from URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const plan = params.get('plan');
    if (plan) {
      setPlanId(plan);
    }
  }, [location]);
  
  const planInfo = planId && (planId in plans) 
    ? plans[planId as keyof typeof plans] 
    : null;
  
  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <Card className="bg-white/5 border-scrapvorn-gray/10 text-center">
          <CardHeader className="pb-4">
            <div className="mx-auto w-16 h-16 bg-scrapvorn-orange/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-scrapvorn-orange" />
            </div>
            <CardTitle className="text-2xl">Assinatura confirmada!</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-8">
              <p className="text-lg mb-2">
                {planInfo 
                  ? `Você agora é assinante do plano ${planInfo.name}` 
                  : "Sua assinatura foi realizada com sucesso"}
              </p>
              {planInfo && (
                <p className="text-scrapvorn-gray">
                  Valor: {planInfo.price}
                </p>
              )}
            </div>
            
            <div className="space-y-2 mb-8 text-left max-w-md mx-auto">
              <p className="font-medium mb-2">O que você pode fazer agora:</p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-scrapvorn-orange/10 rounded-full flex items-center justify-center mr-3">
                    <CheckCircle className="h-4 w-4 text-scrapvorn-orange" />
                  </div>
                  <span>Explorar todos os recursos do seu novo plano</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-scrapvorn-orange/10 rounded-full flex items-center justify-center mr-3">
                    <CheckCircle className="h-4 w-4 text-scrapvorn-orange" />
                  </div>
                  <span>Configurar as opções avançadas de scraping</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-scrapvorn-orange/10 rounded-full flex items-center justify-center mr-3">
                    <CheckCircle className="h-4 w-4 text-scrapvorn-orange" />
                  </div>
                  <span>Explorar as integrações disponíveis</span>
                </li>
              </ul>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate("/dashboard")}
                className="bg-scrapvorn-orange hover:bg-scrapvorn-orange/90 text-black font-medium"
              >
                Ir para o Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/dashboard/perfil")}
                className="border-scrapvorn-gray/30 hover:bg-white/5"
              >
                Voltar ao Perfil
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AssinaturaSucesso;
