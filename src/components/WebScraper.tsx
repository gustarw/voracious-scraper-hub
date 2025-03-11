import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Globe, Download, AlertCircle, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/auth";

export const WebScraper = () => {
  const [url, setUrl] = useState("");
  const [data, setData] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  
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
      
      if (!result.success) {
        throw new Error(result.error || "Falha ao iniciar a extração");
      }
      
      setTaskId(result.taskId);
      setStatus(`Extração em andamento: ${result.completed || 0}/${result.total || 'N/A'} páginas`);
      
      pollScrapingResults(result.taskId);
      
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
    } finally {
      setLoading(false);
    }
  };
  
  const pollScrapingResults = async (taskId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("Sessão expirada");
      }
      
      const { data, error } = await supabase
        .from('scraping_tasks')
        .select('*')
        .eq('id', taskId)
        .single();
      
      if (error) throw error;
      
      if (data.status === 'completed') {
        const { data: scrapedData, error: scrapedError } = await supabase
          .from('scraped_data')
          .select('data')
          .eq('task_id', taskId);
        
        if (scrapedError) throw scrapedError;
        
        setData(scrapedData.map(item => item.data));
        setStatus("Extração concluída");
        return;
      } else if (data.status === 'error') {
        setError("A extração falhou. Por favor, tente novamente.");
        setStatus("Erro na extração");
        return;
      }
      
      setStatus(`Extração em andamento: ${data.completed || 0}/${data.total || 'N/A'} páginas`);
      
      setTimeout(() => pollScrapingResults(taskId), 2000);
    } catch (err: any) {
      console.error("Erro ao verificar o status da extração:", err);
      setError(err.message);
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

  return (
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
                ) : status.includes("concluída") ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : status.includes("Erro") ? (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                ) : (
                  <Loader2 className="h-4 w-4 text-scrapvorn-orange animate-spin" />
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
                <pre className="text-xs text-white/70 p-2">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

