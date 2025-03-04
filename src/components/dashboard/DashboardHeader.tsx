
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DashboardHeader() {
  return (
    <div className="mb-10">
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <p className="text-scrapvorn-gray mb-4 sm:mb-0">
          Gerencie suas tarefas de extração de dados e visualize os resultados.
        </p>
        <Button variant="outline" className="border-scrapvorn-gray/30 hover:bg-white/5">
          Documentação <ArrowUpRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        <StatCard title="Tarefas Totais" value="0" />
        <StatCard title="Tarefas Concluídas" value="0" />
        <StatCard title="Páginas Extraídas" value="0" />
        <StatCard title="Créditos Utilizados" value="0" />
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
}

function StatCard({ title, value }: StatCardProps) {
  return (
    <div className="bg-white/5 rounded-lg p-4 border border-scrapvorn-gray/10">
      <p className="text-scrapvorn-gray text-sm mb-1">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
