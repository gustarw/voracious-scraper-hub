
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

const IntegracaoAPIs = () => {
  return (
    <DashboardLayout>
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Integração com APIs</h1>
        <p className="text-scrapvorn-gray">
          Configure integrações com serviços externos.
        </p>
      </div>
      
      <div className="bg-white/5 border border-scrapvorn-gray/10 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">Serviços de Integração</h2>
        <p className="text-scrapvorn-gray mb-6">
          Esta página permitirá configurar integrações com serviços externos
          como Google Sheets, CRMs e outras ferramentas via APIs.
        </p>
        <div className="p-8 border border-dashed border-scrapvorn-gray/30 rounded-lg flex items-center justify-center">
          <p className="text-scrapvorn-gray">Funcionalidade em desenvolvimento</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default IntegracaoAPIs;
