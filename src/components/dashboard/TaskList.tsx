
import { useState, useEffect } from "react";
import { FirecrawlService } from "@/services/FirecrawlService";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  ExternalLink, Clock, CheckCircle, 
  XCircle, MoreHorizontal, Trash2
} from "lucide-react";

export function TaskList() {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    loadTasks();
  }, []);
  
  const loadTasks = () => {
    setIsLoading(true);
    const taskData = FirecrawlService.getScrapingTasks();
    setTasks(taskData);
    setIsLoading(false);
  };
  
  const handleDeleteTask = (taskId: string) => {
    const deleted = FirecrawlService.deleteScrapingTask(taskId);
    
    if (deleted) {
      toast({
        title: "Sucesso",
        description: "Tarefa removida com sucesso",
      });
      loadTasks();
    } else {
      toast({
        title: "Erro",
        description: "Falha ao remover a tarefa",
        variant: "destructive",
      });
    }
  };
  
  const handleViewResult = (taskId: string) => {
    const result = FirecrawlService.getScrapingResultByTaskId(taskId);
    
    if (result) {
      // In a real application, you'd show a modal or navigate to a detail page
      console.log("Result:", result);
      alert(JSON.stringify(result, null, 2));
    } else {
      toast({
        title: "Informação",
        description: "Não há resultados disponíveis para esta tarefa",
      });
    }
  };
  
  if (isLoading) {
    return (
      <div className="bg-white/5 border border-scrapvorn-gray/10 rounded-xl p-6">
        <div className="text-center py-8">
          <div className="w-8 h-8 border-2 border-scrapvorn-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-scrapvorn-gray">Carregando tarefas...</p>
        </div>
      </div>
    );
  }
  
  if (tasks.length === 0) {
    return (
      <div className="bg-white/5 border border-scrapvorn-gray/10 rounded-xl p-6">
        <div className="text-center py-8">
          <p className="text-scrapvorn-gray mb-4">Nenhuma tarefa de scraping encontrada.</p>
          <p className="text-sm">Crie uma nova tarefa para começar a extrair dados.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white/5 border border-scrapvorn-gray/10 rounded-xl p-6">
      <h2 className="text-xl font-bold mb-4">Tarefas de Scraping</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-scrapvorn-gray/10">
              <th className="text-left py-3 px-4 text-sm font-medium text-scrapvorn-gray">URL</th>
              <th className="text-center py-3 px-4 text-sm font-medium text-scrapvorn-gray">Status</th>
              <th className="text-center py-3 px-4 text-sm font-medium text-scrapvorn-gray">Data de Criação</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-scrapvorn-gray">Ações</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} className="border-b border-scrapvorn-gray/10 hover:bg-white/5">
                <td className="py-3 px-4">
                  <div className="flex items-center">
                    <span className="truncate max-w-[200px]">{task.url}</span>
                    <a href={task.url} target="_blank" rel="noopener noreferrer" className="ml-2 text-scrapvorn-gray hover:text-white">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </td>
                <td className="py-3 px-4 text-center">
                  <StatusBadge status={task.status} />
                </td>
                <td className="py-3 px-4 text-center text-sm text-scrapvorn-gray">
                  {new Date(task.createdAt).toLocaleString()}
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    {task.status === 'completed' && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewResult(task.id)}
                        className="text-scrapvorn-gray hover:text-white hover:bg-white/10"
                      >
                        Ver
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface StatusBadgeProps {
  status: 'pending' | 'completed' | 'failed';
}

function StatusBadge({ status }: StatusBadgeProps) {
  const config = {
    pending: {
      icon: Clock,
      background: 'bg-yellow-500/10',
      text: 'text-yellow-500',
      label: 'Pendente'
    },
    completed: {
      icon: CheckCircle,
      background: 'bg-green-500/10',
      text: 'text-green-500',
      label: 'Concluído'
    },
    failed: {
      icon: XCircle,
      background: 'bg-red-500/10',
      text: 'text-red-500',
      label: 'Falhou'
    }
  };
  
  const { icon: Icon, background, text, label } = config[status];
  
  return (
    <div className={`inline-flex items-center px-2.5 py-1 rounded-full ${background} ${text}`}>
      <Icon className="h-3.5 w-3.5 mr-1" />
      <span className="text-xs font-medium">{label}</span>
    </div>
  );
}
