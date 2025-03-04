
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

const Filtros = () => {
  return (
    <DashboardLayout>
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Filtros</h1>
        <p className="text-scrapvorn-gray">
          Configure filtros avançados para refinar os dados extraídos.
        </p>
      </div>
      
      <div className="bg-white/5 border border-scrapvorn-gray/10 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">Gerenciamento de Filtros</h2>
        <p className="text-scrapvorn-gray mb-6">
          Esta página permitirá criar e gerenciar filtros avançados para 
          inclusão/exclusão de resultados com base em palavras-chave, padrões e outros critérios.
        </p>
        <div className="p-8 border border-dashed border-scrapvorn-gray/30 rounded-lg flex items-center justify-center">
          <p className="text-scrapvorn-gray">Funcionalidade em desenvolvimento</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Filtros;
