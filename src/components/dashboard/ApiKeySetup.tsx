
import { useState } from "react";
import { FirecrawlService } from "@/services/FirecrawlService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Lock, Check, ArrowRight } from "lucide-react";

interface ApiKeySetupProps {
  onApiKeySaved: () => void;
}

export function ApiKeySetup({ onApiKeySaved }: ApiKeySetupProps) {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira uma chave API válida",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // In a real implementation, we'd verify the API key here
    setTimeout(() => {
      try {
        FirecrawlService.saveApiKey(apiKey);
        toast({
          title: "Sucesso",
          description: "Chave API salva com sucesso",
        });
        onApiKeySaved();
      } catch (error) {
        toast({
          title: "Erro",
          description: "Falha ao salvar a chave API",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    }, 1000);
  };
  
  return (
    <div className="max-w-lg mx-auto my-12">
      <div className="bg-white/5 border border-scrapvorn-gray/10 rounded-xl p-6">
        <div className="w-16 h-16 bg-scrapvorn-orange/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="w-8 h-8 text-scrapvorn-orange" />
        </div>
        
        <h2 className="text-2xl font-bold text-center mb-2">Configure sua Chave API</h2>
        <p className="text-scrapvorn-gray text-center mb-6">
          Para começar a extrair dados, você precisa configurar sua chave API do Firecrawl.
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="apiKey" className="block text-sm font-medium text-scrapvorn-gray mb-2">
              Chave API do Firecrawl
            </label>
            <Input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="bg-white/5 border-scrapvorn-gray/20 text-white"
              placeholder="Insira sua chave API aqui"
            />
          </div>
          
          <Button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-scrapvorn-orange hover:bg-scrapvorn-orangeLight text-black"
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                Verificando...
              </span>
            ) : (
              <span className="flex items-center">
                Continuar <ArrowRight className="ml-2 h-4 w-4" />
              </span>
            )}
          </Button>
        </form>
        
        <div className="mt-6 pt-6 border-t border-scrapvorn-gray/10">
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-0.5">
              <Check className="h-5 w-5 text-scrapvorn-orange" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-scrapvorn-gray">
                Não tem uma chave API? Visite o site do Firecrawl para obter uma chave gratuita para testes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
