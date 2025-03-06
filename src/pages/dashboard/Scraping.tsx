
import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FirecrawlService } from "@/services/FirecrawlService";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, ArrowRight } from "lucide-react";

const Scraping = () => {
  const { toast } = useToast();
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [scrapingResult, setScrapingResult] = useState<any>(null);

  const handleScrape = async () => {
    if (!url) {
      toast({
        title: "URL é obrigatório",
        description: "Por favor, insira um URL válido para fazer scraping.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setScrapingResult(null);

    try {
      const apiKey = FirecrawlService.getApiKey();
      
      if (!apiKey) {
        toast({
          title: "API Key não encontrada",
          description: "Configure sua API Key nas configurações primeiro.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const result = await FirecrawlService.crawlWebsite(url);
      
      if (result.success) {
        setScrapingResult(result.data);
        toast({
          title: "Scraping concluído",
          description: "Os dados foram extraídos com sucesso.",
        });
      } else {
        toast({
          title: "Erro ao fazer scraping",
          description: result.error || "Ocorreu um erro ao extrair os dados.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro:", error);
      toast({
        title: "Erro ao fazer scraping",
        description: "Ocorreu um erro ao extrair os dados.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Scraping</h1>
        <p className="text-scrapvorn-gray">
          Extraia dados de qualquer website com configurações avançadas.
        </p>
      </div>
      
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="basic">Scraping Básico</TabsTrigger>
          <TabsTrigger value="advanced">Configurações Avançadas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic">
          <Card className="bg-white/5 border border-scrapvorn-gray/10">
            <CardHeader>
              <CardTitle>Extrair dados de URL</CardTitle>
              <CardDescription>
                Insira o URL de uma página web e extraia todos os dados automaticamente.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <Input
                    placeholder="https://exemplo.com.br"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleScrape} 
                    disabled={isLoading}
                    className="bg-scrapvorn-orange hover:bg-scrapvorn-orange/90"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Extraindo dados...
                      </>
                    ) : (
                      <>
                        Iniciar Scraping
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>

                {scrapingResult && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-2">Resultado</h3>
                    <div className="bg-black/40 p-4 rounded-md overflow-auto max-h-96">
                      <pre className="text-white/90 text-sm">
                        {JSON.stringify(scrapingResult, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="advanced">
          <Card className="bg-white/5 border border-scrapvorn-gray/10">
            <CardHeader>
              <CardTitle>Configurações Avançadas</CardTitle>
              <CardDescription>
                Configure seletores personalizados, limites e filtros para extração de dados.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-8 border border-dashed border-scrapvorn-gray/30 rounded-lg flex flex-col items-center justify-center">
                <p className="text-scrapvorn-gray mb-4">Configurações avançadas em desenvolvimento</p>
                <Button variant="outline">Seja notificado quando disponível</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Scraping;
