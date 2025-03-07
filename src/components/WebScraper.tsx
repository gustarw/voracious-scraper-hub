
import { useState, useEffect } from 'react';
import { useAuth } from "@/context/AuthContext";
import { FirecrawlService } from "@/services/FirecrawlService";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, FileText, AlertCircle, Globe } from "lucide-react";

interface ScrapingTask {
  id: string;
  url: string;
  status: string;
  completed: number;
  total: number;
  credits_used: number;
  expires_at: string;
  created_at: string;
}

interface ScrapedDataItem {
  id: string;
  task_id: string;
  data: any;
  created_at: string;
}

export function WebScraper() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentTask, setCurrentTask] = useState<ScrapingTask | null>(null);
  const [scrapedData, setScrapedData] = useState<ScrapedDataItem[]>([]);
  const [progress, setProgress] = useState(0);
  const [selectedDataItem, setSelectedDataItem] = useState<any | null>(null);
  const [pollingInterval, setPollingInterval] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para usar esta funcionalidade",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    setCurrentTask(null);
    setScrapedData([]);
    setProgress(0);
    
    try {
      const result = await FirecrawlService.startCrawl(url);
      
      if (result.success && result.taskId) {
        toast({
          title: "Sucesso",
          description: "Extração de dados iniciada com sucesso",
        });
        
        // Set up polling to check status
        const interval = window.setInterval(() => {
          checkTaskStatus(result.taskId as string);
        }, 3000);
        
        setPollingInterval(interval);
        
        // Set the current task
        if (result.data) {
          setCurrentTask({
            id: result.taskId,
            url: url,
            status: 'processing',
            completed: result.data.completed || 0,
            total: result.data.total || 0,
            credits_used: result.data.creditsUsed || 0,
            expires_at: result.data.expiresAt || '',
            created_at: new Date().toISOString()
          });
          
          // Calculate progress
          if (result.data.total > 0) {
            setProgress(Math.round((result.data.completed / result.data.total) * 100));
          }
        }
      } else {
        toast({
          title: "Erro",
          description: result.error || "Falha ao iniciar a extração de dados",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error starting scraping task:', error);
      toast({
        title: "Erro",
        description: "Falha ao iniciar a extração de dados",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const checkTaskStatus = async (taskId: string) => {
    try {
      const result = await FirecrawlService.getCrawlStatus(taskId);
      
      if (result.success && result.data) {
        const { task, data } = result.data;
        
        if (task) {
          setCurrentTask(task);
          
          // Calculate progress
          if (task.total > 0) {
            setProgress(Math.round((task.completed / task.total) * 100));
          }
          
          // If the task is complete, stop polling
          if (task.status === 'completed') {
            if (pollingInterval) {
              clearInterval(pollingInterval);
              setPollingInterval(null);
            }
          }
        }
        
        if (data && data.length > 0) {
          setScrapedData(data);
        }
      }
    } catch (error) {
      console.error('Error checking task status:', error);
    }
  };
  
  useEffect(() => {
    // Clean up polling interval when component unmounts
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500">Pendente</Badge>;
      case 'processing':
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500">Processando</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-500/10 text-green-500">Concluído</Badge>;
      case 'failed':
        return <Badge variant="outline" className="bg-destructive/10 text-destructive">Falha</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  return (
    <div className="space-y-8">
      <Card className="bg-white/5 border border-scrapvorn-gray/10">
        <CardHeader>
          <CardTitle>Extração de Dados da Web</CardTitle>
          <CardDescription>
            Extraia dados de qualquer site especificando a URL abaixo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Input
                  type="url"
                  placeholder="https://exemplo.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                  className="w-full"
                  disabled={isLoading}
                />
              </div>
              <Button 
                type="submit" 
                disabled={isLoading || !url}
                className="bg-scrapvorn-orange hover:bg-scrapvorn-orange/90 text-black"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  "Extrair Dados"
                )}
              </Button>
            </div>
          </form>
          
          {currentTask && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-scrapvorn-orange" />
                  <span className="font-medium">URL: </span>
                  <a href={currentTask.url} target="_blank" rel="noopener noreferrer" className="text-scrapvorn-gray hover:text-white truncate max-w-md">
                    {currentTask.url}
                  </a>
                </div>
                {getStatusBadge(currentTask.status)}
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progresso: {currentTask.completed} de {currentTask.total} páginas</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="bg-black/20 p-3 rounded">
                  <span className="text-scrapvorn-gray">Status:</span>
                  <div className="font-medium mt-1">{currentTask.status}</div>
                </div>
                <div className="bg-black/20 p-3 rounded">
                  <span className="text-scrapvorn-gray">Créditos Usados:</span>
                  <div className="font-medium mt-1">{currentTask.credits_used || 0}</div>
                </div>
                <div className="bg-black/20 p-3 rounded">
                  <span className="text-scrapvorn-gray">Data de Expiração:</span>
                  <div className="font-medium mt-1">
                    {currentTask.expires_at 
                      ? new Date(currentTask.expires_at).toLocaleDateString() 
                      : 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {scrapedData.length > 0 && (
        <Card className="bg-white/5 border border-scrapvorn-gray/10">
          <CardHeader>
            <CardTitle>Dados Extraídos</CardTitle>
            <CardDescription>
              {scrapedData.length} itens de dados extraídos da URL
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {scrapedData.map((item) => (
                <Card 
                  key={item.id} 
                  className="cursor-pointer hover:border-scrapvorn-orange transition-colors"
                  onClick={() => setSelectedDataItem(item.data)}
                >
                  <CardHeader className="p-4">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-scrapvorn-orange" />
                      <CardTitle className="text-sm">
                        {item.data.title || item.data.url?.split('/').pop() || 'Dados Extraídos'}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-xs text-scrapvorn-gray truncate">
                      {item.data.url || 'Sem URL'}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {selectedDataItem && (
              <div className="mt-8">
                <Card className="bg-black/20 border border-scrapvorn-gray/20">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {selectedDataItem.title || 'Detalhes do Item'}
                    </CardTitle>
                    {selectedDataItem.url && (
                      <CardDescription>
                        <a href={selectedDataItem.url} target="_blank" rel="noopener noreferrer" className="text-scrapvorn-orange hover:underline">
                          {selectedDataItem.url}
                        </a>
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="bg-black/40 p-4 rounded overflow-auto max-h-96">
                      <pre className="text-xs">
                        {JSON.stringify(selectedDataItem, null, 2)}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </CardContent>
      )}
      
      {currentTask && currentTask.status === 'processing' && scrapedData.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8">
          <Loader2 className="h-8 w-8 text-scrapvorn-orange animate-spin mb-4" />
          <p className="text-scrapvorn-gray">
            Extraindo dados... Por favor, aguarde.
          </p>
        </div>
      )}
      
      {currentTask && currentTask.status === 'completed' && scrapedData.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8">
          <AlertCircle className="h-8 w-8 text-yellow-500 mb-4" />
          <p className="text-scrapvorn-gray">
            A extração foi concluída, mas nenhum dado foi encontrado.
          </p>
        </div>
      )}
    </div>
  );
}
