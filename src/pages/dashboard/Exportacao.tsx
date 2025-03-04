
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

const Exportacao = () => {
  return (
    <DashboardLayout>
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Exportação</h1>
        <p className="text-scrapvorn-gray">
          Configure as opções de exportação para os dados extraídos.
        </p>
      </div>
      
      <div className="bg-white/5 border border-scrapvorn-gray/10 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">Formatos de Exportação</h2>
        <p className="text-scrapvorn-gray mb-6">
          Esta página permitirá configurar opções de exportação em diferentes formatos 
          como CSV, JSON, Excel, além de agendamento de exportações automáticas.
        </p>
        <div className="p-8 border border-dashed border-scrapvorn-gray/30 rounded-lg flex items-center justify-center">
          <p className="text-scrapvorn-gray">Funcionalidade em desenvolvimento</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Exportacao;
