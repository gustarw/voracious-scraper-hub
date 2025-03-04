
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

const Scraping = () => {
  return (
    <DashboardLayout>
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Scraping</h1>
        <p className="text-scrapvorn-gray">
          Configure as tarefas de extração de dados da web com opções avançadas.
        </p>
      </div>
      
      <div className="bg-white/5 border border-scrapvorn-gray/10 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">Editor de Scraping</h2>
        <p className="text-scrapvorn-gray mb-6">
          Esta página permitirá criar e editar tarefas de scraping com opções avançadas, 
          como seletores CSS/XPath, tipos de dados, intervalos, limites de páginas e filtros.
        </p>
        <div className="p-8 border border-dashed border-scrapvorn-gray/30 rounded-lg flex items-center justify-center">
          <p className="text-scrapvorn-gray">Funcionalidade em desenvolvimento</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Scraping;
