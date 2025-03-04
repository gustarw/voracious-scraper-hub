
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

const Projetos = () => {
  return (
    <DashboardLayout>
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Projetos</h1>
        <p className="text-scrapvorn-gray">
          Gerencie seus projetos de extração de dados.
        </p>
      </div>
      
      <div className="bg-white/5 border border-scrapvorn-gray/10 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">Gerenciamento de Projetos</h2>
        <p className="text-scrapvorn-gray mb-6">
          Esta página permitirá criar, editar e gerenciar projetos de scraping, 
          agrupando diferentes tarefas e configurações sob um único identificador.
        </p>
        <div className="p-8 border border-dashed border-scrapvorn-gray/30 rounded-lg flex items-center justify-center">
          <p className="text-scrapvorn-gray">Funcionalidade em desenvolvimento</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Projetos;
