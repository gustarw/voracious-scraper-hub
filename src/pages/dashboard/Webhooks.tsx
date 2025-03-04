
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

const Webhooks = () => {
  return (
    <DashboardLayout>
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Webhooks</h1>
        <p className="text-scrapvorn-gray">
          Configure notificações automáticas para eventos de scraping.
        </p>
      </div>
      
      <div className="bg-white/5 border border-scrapvorn-gray/10 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">Configuração de Webhooks</h2>
        <p className="text-scrapvorn-gray mb-6">
          Esta página permitirá configurar URLs para receber notificações automáticas 
          sobre eventos relacionados às tarefas de scraping, como conclusão, erros ou novos dados.
        </p>
        <div className="p-8 border border-dashed border-scrapvorn-gray/30 rounded-lg flex items-center justify-center">
          <p className="text-scrapvorn-gray">Funcionalidade em desenvolvimento</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Webhooks;
