
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Globe, Download, AlertCircle, CheckCircle2, Clock, History } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/auth";

interface Task {
  id: string;
  url: string;
  status: string;
  completed: number;
  total: number;
  created_at: string;
}

export const WebScraper = () => {
  const [url, setUrl] = useState("");
  const [data, setData] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [pollingAttempts, setPollingAttempts] = useState(0);
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const MAX_POLLING_ATTEMPTS = 30; // 1 minute (2s * 30)
  
  useEffect(() => {
    if (user) {
      fetchRecentTasks();
    }
  }, [user]);

  const fetchRecentTasks = async () => {
    try {
      setLoadingHistory(true);
      const { data, error } = await supabase
        .from('scraping_tasks')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error("Error fetching recent tasks:", error);
      } else {
        setRecentTasks(data || []);
      }
    } catch (err) {
      console.error("Unexpected error fetching tasks:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const isValidUrl = (urlString: string): boolean => {
    try {
      const url = new URL(urlString);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  };

  const handleScrape = async () => {
    if (!url) {
      toast({
        title: "URL necessária",
        description: "Por favor, informe uma URL para iniciar a extração",
        variant: "destructive"
      });
      return;
    }
    
    if (!isValidUrl(url)) {
      toast({
        title: "URL inválida",
        description: "Por favor, informe uma URL válida iniciando com http:// ou https://",
        variant: "destructive"
      });
      return;
    }
    
    if (!user) {
      toast({
        title: "Autenticação necessária",
        description: "Você precisa estar autenticado para usar esta funcionalidade",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    setError(null);
    setData(null);
    setStatus("Iniciando extração...");
    setPollingAttempts(0);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("Sessão expirada");
      }

      const { data: result, error: fnError } = await supabase.functions.invoke('crawl-website', {
        body: { url }
      });

      if (fnError) {
        throw new Error(fnError.message || "Falha ao extrair dados");
      }
      
      if (!result || !result.success) {
        throw new Error(result?.error || "Falha ao iniciar a extração");
      }
      
      setTaskId(result.taskId);
      setStatus(`Extração em andamento: ${result.completed || 0}/${result.total || 'N/A'} páginas`);
      
      // Update task history immediately after creating a new task
      fetchRecentTasks();
      
      await pollScrapingResults(result.taskId);
      
      toast({
        title: "Extração iniciada",
        description: "A extração de dados foi iniciada com sucesso",
      });
    } catch (err: any) {
      console.error("Erro durante a extração:", err);
      setError(err.message);
      toast({
        title: "Erro na extração",
        description: err.message || "Ocorreu um erro ao tentar extrair os dados",
        variant: "destructive"
      });
      setLoading(false);
    }
  };
  
  const pollScrapingResults = async (taskId: string) => {
    try {
      if (pollingAttempts >= MAX_POLLING_ATTEMPTS) {
        setError("Tempo limite de extração excedido");
        setStatus("Erro: Tempo limite excedido");
        setLoading(false);
        return;
      }

      setPollingAttempts(prev => prev + 1);
      
      console.log(`Polling attempt ${pollingAttempts} for task ${taskId}`);
      
      // Check task status directly from scraping_tasks table
      const { data: taskData, error: taskError } = await supabase
        .from('scraping_tasks')
        .select('*')
        .eq('id', taskId)
        .single();
      
      if (taskError) {
        console.error(`Error fetching task ${taskId}:`, taskError);
        throw new Error("Erro ao verificar status da tarefa");
      }
      
      console.log(`Task status for ${taskId}:`, taskData.status);
      
      if (taskData.status === 'completed') {
        // Fetch scraped data from scraped_data table
        const { data: scrapedData, error: scrapedError } = await supabase
          .from('scraped_data')
          .select('data')
          .eq('task_id', taskId);
        
        if (scrapedError) {
          console.error(`Error fetching data for task ${taskId}:`, scrapedError);
          throw new Error("Erro ao buscar dados extraídos");
        }
        
        if (scrapedData && scrapedData.length > 0) {
          setData(scrapedData.map(item => item.data));
          setStatus(`Extração concluída com sucesso! ${scrapedData.length} itens encontrados.`);
          setLoading(false);
          return;
        } else {
          setStatus("Extração concluída, mas nenhum dado foi encontrado.");
          setLoading(false);
          return;
        }
      } else if (taskData.status === 'error') {
        setError("A extração falhou. Por favor, tente novamente.");
        setStatus("Erro na extração");
        setLoading(false);
        return;
      }
      
      setStatus(`Extração em andamento: ${taskData.completed || 0}/${taskData.total || 'N/A'} páginas`);
      
      // Poll again after a delay
      setTimeout(() => pollScrapingResults(taskId), 2000);
    } catch (err: any) {
      console.error("Erro ao verificar o status da extração:", err);
      setError(err.message);
      setStatus("Erro ao verificar status da extração");
      setLoading(false);
    }
  };

  const handleExportData = () => {
    if (!data) return;
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `scraping-${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const loadTaskData = async (taskId: string) => {
    setLoading(true);
    setError(null);
    setData(null);
    setStatus("Carregando dados salvos...");
    setTaskId(taskId);
    
    try {
      // Fetch task details
      const { data: taskData, error: taskError } = await supabase
        .from('scraping_tasks')
        .select('*')
        .eq('id', taskId)
        .single();
      
      if (taskError) {
        throw new Error("Erro ao buscar detalhes da tarefa");
      }
      
      setUrl(taskData.url);
      
      // Fetch scraped data
      const { data: scrapedData, error: dataError } = await supabase
        .from('scraped_data')
        .select('data')
        .eq('task_id', taskId);
      
      if (dataError) {
        throw new Error("Erro ao buscar dados extraídos");
      }
      
      if (scrapedData && scrapedData.length > 0) {
        setData(scrapedData.map(item => item.data));
        setStatus(`Dados carregados com sucesso! ${scrapedData.length} itens encontrados.`);
      } else {
        setStatus("Nenhum dado encontrado para esta tarefa.");
      }
    } catch (err: any) {
      console.error("Erro ao carregar dados:", err);
      setError(err.message);
      toast({
        title: "Erro ao carregar dados",
        description: err.message || "Ocorreu um erro ao tentar carregar os dados",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg border-scrapvorn-gray/20 bg-white/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl text-white flex items-center gap-2">
            <Globe className="h-5 w-5 text-scrapvorn-orange" />
            Web Scraper
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-2">
              <Input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Digite a URL do site (ex: https://exemplo.com)"
                className="bg-black/40 border-scrapvorn-gray/30 text-white placeholder:text-white/30 flex-grow"
              />
              <Button
                onClick={handleScrape}
                className="bg-scrapvorn-orange hover:bg-scrapvorn-orange/90 text-black font-medium"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Extraindo...
                  </>
                ) : (
                  "Extrair Dados"
                )}
              </Button>
            </div>
            
            {status && (
              <div className="bg-black/20 border border-scrapvorn-gray/20 rounded-md p-3">
                <div className="flex items-center gap-2">
                  {loading ? (
                    <Loader2 className="h-4 w-4 text-scrapvorn-orange animate-spin" />
                  ) : status.includes("sucesso") ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : status.includes("Erro") ? (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  ) : (
                    <Clock className="h-4 w-4 text-scrapvorn-orange" />
                  )}
                  <span className="text-white">{status}</span>
                </div>
                
                {taskId && !status.includes("Erro") && (
                  <div className="mt-2">
                    <Badge variant="outline" className="bg-scrapvorn-orange/10 text-scrapvorn-orange border-scrapvorn-orange/30">
                      Task ID: {taskId}
                    </Badge>
                  </div>
                )}
              </div>
            )}
            
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-md p-3 text-red-400">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              </div>
            )}
            
            {data && data.length > 0 && (
              <div className="bg-black/20 border border-scrapvorn-gray/20 rounded-md p-4 mt-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium text-white">Dados Extraídos ({data.length} itens)</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-scrapvorn-orange text-scrapvorn-orange hover:bg-scrapvorn-orange/10"
                    onClick={handleExportData}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Exportar JSON
                  </Button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  <pre className="text-xs text-white/70 p-2 whitespace-pre-wrap break-words">
                    {JSON.stringify(data, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Recent Tasks Section */}
      <Card className="shadow-lg border-scrapvorn-gray/20 bg-white/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl text-white flex items-center gap-2">
            <History className="h-5 w-5 text-scrapvorn-orange" />
            Extrações Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingHistory ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 text-scrapvorn-orange animate-spin" />
            </div>
          ) : recentTasks.length > 0 ? (
            <div className="space-y-3">
              {recentTasks.map((task) => (
                <div 
                  key={task.id} 
                  className="p-3 bg-black/30 rounded-md border border-scrapvorn-gray/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-2 cursor-pointer hover:bg-black/40 transition-colors"
                  onClick={() => loadTaskData(task.id)}
                >
                  <div className="flex-1">
                    <div className="text-white font-medium truncate">{task.url}</div>
                    <div className="text-white/60 text-sm">
                      {new Date(task.created_at).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      className={
                        task.status === 'completed' ? 'bg-green-500/20 text-green-400 border-green-500/50' :
                        task.status === 'error' ? 'bg-red-500/20 text-red-400 border-red-500/50' :
                        'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
                      }
                    >
                      {task.status === 'completed' ? 'Concluído' : 
                       task.status === 'error' ? 'Erro' : 'Em Processamento'}
                    </Badge>
                    {task.status === 'completed' && (
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 px-2 text-scrapvorn-orange hover:text-scrapvorn-orange/80"
                        onClick={(e) => {
                          e.stopPropagation();
                          loadTaskData(task.id);
                        }}
                      >
                        Ver Dados
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-white/60">
              Nenhuma extração realizada recentemente.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
