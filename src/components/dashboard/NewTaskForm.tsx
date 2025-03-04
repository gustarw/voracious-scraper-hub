
import { useState } from "react";
import { FirecrawlService } from "@/services/FirecrawlService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Globe } from "lucide-react";

export function NewTaskForm() {
  const { toast } = useToast();
  const [url, setUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim() || !isValidUrl(url)) {
      toast({
        title: "Erro",
        description: "Por favor, insira uma URL válida",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create a new scraping task
      const task = await FirecrawlService.createScrapingTask(url);
      
      // Execute the task immediately
      const result = await FirecrawlService.executeScrapingTask(task.id);
      
      if (result.success) {
        toast({
          title: "Sucesso",
          description: "Tarefa de scraping criada e executada com sucesso",
        });
        setUrl("");
      } else {
        toast({
          title: "Aviso",
          description: result.error || "A tarefa foi criada, mas houve um erro na execução",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao criar a tarefa de scraping",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };
  
  return (
    <div className="bg-white/5 border border-scrapvorn-gray/10 rounded-xl p-6 mb-8">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <Globe className="mr-2 h-5 w-5 text-scrapvorn-orange" />
        Nova Tarefa de Scraping
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="url" className="block text-sm font-medium text-scrapvorn-gray mb-2">
            URL do Site
          </label>
          <Input
            id="url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="bg-white/5 border-scrapvorn-gray/20 text-white"
            placeholder="https://example.com"
            disabled={isSubmitting}
          />
        </div>
        
        <Button 
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-scrapvorn-orange hover:bg-scrapvorn-orangeLight text-black"
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processando...
            </span>
          ) : (
            "Iniciar Scraping"
          )}
        </Button>
      </form>
      
      <div className="mt-4 text-sm text-scrapvorn-gray">
        <p>
          Esta versão utiliza configurações padrão. Para opções avançadas, use a página de Configurações.
        </p>
      </div>
    </div>
  );
}
