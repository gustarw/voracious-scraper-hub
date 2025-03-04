
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

const Configuracoes = () => {
  return (
    <DashboardLayout>
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Configurações</h1>
        <p className="text-scrapvorn-gray">
          Gerencie as configurações da sua conta e da plataforma.
        </p>
      </div>
      
      <div className="bg-white/5 border border-scrapvorn-gray/10 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">Preferências</h2>
        <p className="text-scrapvorn-gray mb-6">
          Esta página permitirá configurar preferências gerais, chaves de API,
          proxies, limites de uso e outras configurações da plataforma.
        </p>
        <div className="p-8 border border-dashed border-scrapvorn-gray/30 rounded-lg flex items-center justify-center">
          <p className="text-scrapvorn-gray">Funcionalidade em desenvolvimento</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Configuracoes;
