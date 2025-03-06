
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AlertCircle, Code, Database, Eye, EyeOff, Key, Plug, Plus, Settings, Table } from "lucide-react";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const IntegracaoAPIs = () => {
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKey, setApiKey] = useState("sk_test_51HG6R9K8956DjKl3Xyz123AbcXyzTestKey");

  const toggleApiKeyVisibility = () => {
    setShowApiKey(!showApiKey);
  };

  const generateNewApiKey = () => {
    // This would typically make an API call to generate a new key
    const newKey = `sk_test_${Math.random().toString(36).substring(2, 15)}`;
    setApiKey(newKey);
  };

  return (
    <DashboardLayout>
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Integração com APIs</h1>
        <p className="text-scrapvorn-gray">
          Configure integrações com serviços externos e APIs.
        </p>
      </div>
      
      <Tabs defaultValue="api-keys" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="api-keys">Chaves de API</TabsTrigger>
          <TabsTrigger value="external">Integrações Externas</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="docs">Documentação</TabsTrigger>
        </TabsList>
        
        <TabsContent value="api-keys">
          <Card className="bg-white/5 border border-scrapvorn-gray/10">
            <CardHeader>
              <CardTitle>Suas Chaves de API</CardTitle>
              <CardDescription>
                Use estas chaves para autenticar suas solicitações de API.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="api-key" className="text-sm font-medium">
                    Chave de API (não compartilhe com ninguém)
                  </Label>
                  <div className="mt-1 flex">
                    <div className="relative flex-grow">
                      <Input
                        id="api-key"
                        type={showApiKey ? "text" : "password"}
                        value={apiKey}
                        readOnly
                        className="pr-10 font-mono text-sm"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full"
                        onClick={toggleApiKeyVisibility}
                      >
                        {showApiKey ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <Button
                      className="ml-2 bg-scrapvorn-orange hover:bg-scrapvorn-orange/90"
                      onClick={() => navigator.clipboard.writeText(apiKey)}
                    >
                      Copiar
                    </Button>
                  </div>
                </div>

                <div className="pt-4 border-t border-scrapvorn-gray/10">
                  <Button
                    variant="outline"
                    onClick={generateNewApiKey}
                    className="bg-white/5 hover:bg-white/10"
                  >
                    <Key className="mr-2 h-4 w-4" />
                    Gerar Nova Chave
                  </Button>
                  <p className="mt-2 text-sm text-scrapvorn-gray">
                    Ao gerar uma nova chave, todas as chaves antigas serão invalidadas.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-scrapvorn-gray/10 block">
              <div className="mt-4 bg-black/30 p-4 rounded-lg flex items-start">
                <AlertCircle className="h-5 w-5 text-orange-500 mr-3 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium mb-1">Mantenha suas chaves seguras</p>
                  <p className="text-scrapvorn-gray">
                    Suas chaves de API concedem acesso total à sua conta. Nunca compartilhe-as 
                    em repositórios públicos ou em código-fonte acessível publicamente.
                  </p>
                </div>
              </div>
            </CardFooter>
          </Card>

          <div className="mt-8">
            <Card className="bg-white/5 border border-scrapvorn-gray/10">
              <CardHeader>
                <CardTitle>Registros de Uso da API</CardTitle>
                <CardDescription>
                  Monitore o uso da sua API e gerencie limites.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-black/30 p-4 rounded-lg">
                      <p className="text-scrapvorn-gray text-sm">Requisições hoje</p>
                      <h3 className="text-2xl font-bold mt-1">128</h3>
                    </div>
                    <div className="bg-black/30 p-4 rounded-lg">
                      <p className="text-scrapvorn-gray text-sm">Limite diário</p>
                      <h3 className="text-2xl font-bold mt-1">1000</h3>
                    </div>
                    <div className="bg-black/30 p-4 rounded-lg">
                      <p className="text-scrapvorn-gray text-sm">Total este mês</p>
                      <h3 className="text-2xl font-bold mt-1">1,243</h3>
                    </div>
                  </div>

                  <div className="p-8 border border-dashed border-scrapvorn-gray/30 rounded-lg flex flex-col items-center justify-center">
                    <p className="text-scrapvorn-gray mb-4">Logs detalhados de requisições em desenvolvimento</p>
                    <Button variant="outline">Receber notificação quando disponível</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="external">
          <Card className="bg-white/5 border border-scrapvorn-gray/10">
            <CardHeader>
              <CardTitle>Integrações Disponíveis</CardTitle>
              <CardDescription>
                Conecte o Scrapvorn com outros serviços e plataformas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border border-scrapvorn-gray/10">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="px-2 py-0 h-5">
                        Popular
                      </Badge>
                      <Switch id="google-sheets" />
                    </div>
                    <CardTitle className="text-lg mt-2">Google Sheets</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-scrapvorn-gray">
                      Exporte dados diretamente para planilhas Google
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full">
                      Configurar
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card className="border border-scrapvorn-gray/10">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="px-2 py-0 h-5">
                        Novo
                      </Badge>
                      <Switch id="zapier" />
                    </div>
                    <CardTitle className="text-lg mt-2">Zapier</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-scrapvorn-gray">
                      Conecte com mais de 3000 apps através do Zapier
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full">
                      Configurar
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card className="border border-scrapvorn-gray/10">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="px-2 py-0 h-5">
                        Útil
                      </Badge>
                      <Switch id="slack" />
                    </div>
                    <CardTitle className="text-lg mt-2">Slack</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-scrapvorn-gray">
                      Receba notificações e relatórios no Slack
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full">
                      Configurar
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card className="border border-scrapvorn-gray/10">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="px-2 py-0 h-5">
                        Database
                      </Badge>
                      <Switch id="mysql" />
                    </div>
                    <CardTitle className="text-lg mt-2">MySQL / PostgreSQL</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-scrapvorn-gray">
                      Envie dados para seu banco de dados SQL
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full">
                      Configurar
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card className="border border-scrapvorn-gray/10">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="px-2 py-0 h-5">
                        Marketing
                      </Badge>
                      <Switch id="mailchimp" />
                    </div>
                    <CardTitle className="text-lg mt-2">Mailchimp</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-scrapvorn-gray">
                      Adicione contatos extraídos ao Mailchimp
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full">
                      Configurar
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card className="border border-scrapvorn-gray/10 flex items-center justify-center p-6">
                  <Button variant="outline" className="h-auto py-3 px-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Integração
                  </Button>
                </Card>
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-8">
            <Card className="bg-white/5 border border-scrapvorn-gray/10">
              <CardHeader>
                <CardTitle>Desenvolvedor de Integrações</CardTitle>
                <CardDescription>
                  Crie integrações personalizadas para suas necessidades específicas.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-8 border border-dashed border-scrapvorn-gray/30 rounded-lg flex flex-col items-center justify-center">
                  <p className="text-scrapvorn-gray mb-4">Ferramentas para desenvolvedores em desenvolvimento</p>
                  <Button variant="outline">Receber notificação quando disponível</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="webhooks">
          <Card className="bg-white/5 border border-scrapvorn-gray/10">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Gerenciamento de Webhooks</CardTitle>
                  <CardDescription>
                    Configure callbacks para notificações automáticas.
                  </CardDescription>
                </div>
                <Button>
                  <Plug className="mr-2 h-4 w-4" />
                  Abrir Webhooks
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <p className="text-scrapvorn-gray mb-2">
                    Para configurar webhooks, acesse o menu de Webhooks na barra lateral.
                  </p>
                  <Button variant="outline" className="mt-2">
                    Configurar Webhooks
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="docs">
          <Card className="bg-white/5 border border-scrapvorn-gray/10">
            <CardHeader>
              <CardTitle>Documentação da API</CardTitle>
              <CardDescription>
                Recursos para ajudar você a integrar com o Scrapvorn.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border border-scrapvorn-gray/10">
                    <CardHeader className="pb-2">
                      <div className="flex items-center">
                        <Code className="h-5 w-5 mr-2 text-scrapvorn-orange" />
                        <CardTitle className="text-lg">Guia de Início Rápido</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <p className="text-sm text-scrapvorn-gray">
                        Aprenda a fazer sua primeira requisição de API em minutos
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="w-full">
                        Ver Guia
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card className="border border-scrapvorn-gray/10">
                    <CardHeader className="pb-2">
                      <div className="flex items-center">
                        <Database className="h-5 w-5 mr-2 text-scrapvorn-orange" />
                        <CardTitle className="text-lg">Referência da API</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <p className="text-sm text-scrapvorn-gray">
                        Documentação completa de todos os endpoints disponíveis
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="w-full">
                        Ver Documentação
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card className="border border-scrapvorn-gray/10">
                    <CardHeader className="pb-2">
                      <div className="flex items-center">
                        <Table className="h-5 w-5 mr-2 text-scrapvorn-orange" />
                        <CardTitle className="text-lg">Exemplos de Código</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <p className="text-sm text-scrapvorn-gray">
                        Código de exemplo para diversas linguagens de programação
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="w-full">
                        Ver Exemplos
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card className="border border-scrapvorn-gray/10">
                    <CardHeader className="pb-2">
                      <div className="flex items-center">
                        <Settings className="h-5 w-5 mr-2 text-scrapvorn-orange" />
                        <CardTitle className="text-lg">Bibliotecas SDKs</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <p className="text-sm text-scrapvorn-gray">
                        Bibliotecas oficiais para facilitar integração com APIs
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="w-full">
                        Ver SDKs
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
                
                <Separator className="my-6 bg-scrapvorn-gray/10" />
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Exemplos de Requisição</h3>
                  <div className="bg-black/40 p-4 rounded-md">
                    <pre className="text-white/90 text-sm overflow-auto whitespace-pre-wrap">
{`// Exemplo de requisição usando JavaScript
const response = await fetch('https://api.scrapvorn.com/v1/scrape', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    url: 'https://exemplo.com',
    selectors: {
      title: 'h1',
      price: '.product-price',
      description: '.product-description'
    }
  })
});

const data = await response.json();
console.log(data);`}
                    </pre>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default IntegracaoAPIs;
