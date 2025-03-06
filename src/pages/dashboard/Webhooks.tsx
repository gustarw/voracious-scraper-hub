
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Copy, Webhook, Globe, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

type WebhookType = {
  id: string;
  name: string;
  url: string;
  event: string;
  active: boolean;
};

const Webhooks = () => {
  const [webhooks, setWebhooks] = useState<WebhookType[]>([
    { 
      id: "1", 
      name: "Notificação de Conclusão", 
      url: "https://api.meuapp.com/webhooks/scrapvorn", 
      event: "task.completed",
      active: true 
    },
    { 
      id: "2", 
      name: "Alerta de Erros", 
      url: "https://api.meuapp.com/webhooks/errors", 
      event: "task.error",
      active: false 
    }
  ]);

  const [newWebhookName, setNewWebhookName] = useState("");
  const [newWebhookUrl, setNewWebhookUrl] = useState("");
  const [newWebhookEvent, setNewWebhookEvent] = useState("task.completed");

  const addWebhook = () => {
    if (!newWebhookName.trim() || !newWebhookUrl.trim()) return;
    
    setWebhooks([
      ...webhooks,
      { 
        id: Date.now().toString(), 
        name: newWebhookName.trim(), 
        url: newWebhookUrl.trim(),
        event: newWebhookEvent,
        active: true 
      }
    ]);
    
    setNewWebhookName("");
    setNewWebhookUrl("");
  };

  const deleteWebhook = (id: string) => {
    setWebhooks(webhooks.filter(webhook => webhook.id !== id));
  };

  const toggleWebhook = (id: string) => {
    setWebhooks(webhooks.map(webhook => 
      webhook.id === id ? { ...webhook, active: !webhook.active } : webhook
    ));
  };

  const copyWebhookUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    // Here you could add a toast notification
  };

  return (
    <DashboardLayout>
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Webhooks</h1>
        <p className="text-scrapvorn-gray">
          Configure notificações automáticas para eventos de scraping.
        </p>
      </div>
      
      <div className="space-y-8">
        <Card className="bg-white/5 border border-scrapvorn-gray/10">
          <CardHeader>
            <CardTitle>Gerenciamento de Webhooks</CardTitle>
            <CardDescription>
              Webhooks permitem que seu aplicativo seja notificado automaticamente quando eventos ocorrem.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="webhook-name">Nome do Webhook</Label>
                  <Input 
                    id="webhook-name" 
                    placeholder="Ex: Notificação de conclusão" 
                    value={newWebhookName}
                    onChange={(e) => setNewWebhookName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="webhook-event">Evento</Label>
                  <Select 
                    defaultValue={newWebhookEvent}
                    onValueChange={setNewWebhookEvent}
                  >
                    <SelectTrigger id="webhook-event">
                      <SelectValue placeholder="Selecione um evento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="task.completed">Tarefa Concluída</SelectItem>
                      <SelectItem value="task.started">Tarefa Iniciada</SelectItem>
                      <SelectItem value="task.error">Erro na Tarefa</SelectItem>
                      <SelectItem value="data.updated">Dados Atualizados</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="webhook-url">URL do Webhook</Label>
                  <Input 
                    id="webhook-url" 
                    placeholder="https://seu-app.com/api/webhook" 
                    value={newWebhookUrl}
                    onChange={(e) => setNewWebhookUrl(e.target.value)}
                  />
                  <p className="text-xs text-scrapvorn-gray mt-1">
                    A URL deve ser acessível pela internet e estar preparada para receber requisições POST.
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  className="bg-scrapvorn-orange hover:bg-scrapvorn-orange/90"
                  onClick={addWebhook}
                  disabled={!newWebhookName.trim() || !newWebhookUrl.trim()}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Webhook
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/5 border border-scrapvorn-gray/10">
          <CardHeader>
            <CardTitle>Webhooks Configurados</CardTitle>
            <CardDescription>
              Gerencie seus webhooks existentes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {webhooks.length === 0 ? (
              <div className="text-center py-6 text-scrapvorn-gray">
                <Webhook className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p>Nenhum webhook configurado</p>
              </div>
            ) : (
              <div className="space-y-4">
                {webhooks.map((webhook) => (
                  <div 
                    key={webhook.id} 
                    className="bg-black/20 border border-scrapvorn-gray/10 rounded-lg p-4"
                  >
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div>
                        <div className="flex items-center">
                          <h4 className="text-lg font-medium">{webhook.name}</h4>
                          <Badge 
                            className={`ml-2 ${
                              webhook.active 
                                ? "bg-green-600/20 text-green-400" 
                                : "bg-gray-600/20 text-gray-400"
                            }`}
                          >
                            {webhook.active ? "Ativo" : "Inativo"}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center mt-1 text-sm text-scrapvorn-gray">
                          <Globe className="h-3 w-3 mr-1" />
                          <p className="truncate">{webhook.url}</p>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 ml-1"
                            onClick={() => copyWebhookUrl(webhook.url)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <div className="mt-2 flex items-center">
                          <Badge variant="outline" className="text-xs">
                            {
                              webhook.event === "task.completed" ? "Tarefa Concluída" :
                              webhook.event === "task.started" ? "Tarefa Iniciada" :
                              webhook.event === "task.error" ? "Erro na Tarefa" :
                              "Dados Atualizados"
                            }
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Switch 
                            id={`webhook-active-${webhook.id}`}
                            checked={webhook.active}
                            onCheckedChange={() => toggleWebhook(webhook.id)}
                          />
                        </div>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8 text-red-500 hover:text-red-600"
                          onClick={() => deleteWebhook(webhook.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t border-scrapvorn-gray/10 mt-4 pt-4 block">
            <div className="bg-black/30 rounded-lg p-4 flex items-start">
              <div className="flex-shrink-0 mr-3">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
              </div>
              <div className="text-sm">
                <h5 className="font-medium mb-1">Importante sobre Webhooks</h5>
                <p className="text-scrapvorn-gray">
                  Seu endpoint deve responder com um código HTTP 200 em até 5 segundos, caso contrário, 
                  o sistema tentará reenviar a notificação até 3 vezes. Consulte a documentação para
                  mais detalhes sobre formato de payload e autenticação.
                </p>
              </div>
            </div>
          </CardFooter>
        </Card>
        
        <Card className="bg-white/5 border border-scrapvorn-gray/10">
          <CardHeader>
            <CardTitle>Teste de Webhooks</CardTitle>
            <CardDescription>
              Envie eventos de teste para verificar sua configuração.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="test-webhook">Webhook para Testar</Label>
                <Select defaultValue="all">
                  <SelectTrigger id="test-webhook">
                    <SelectValue placeholder="Selecione um webhook" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Webhooks</SelectItem>
                    {webhooks.map(webhook => (
                      <SelectItem key={webhook.id} value={webhook.id}>
                        {webhook.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="test-event">Evento para Testar</Label>
                <Select defaultValue="task.completed">
                  <SelectTrigger id="test-event">
                    <SelectValue placeholder="Selecione um evento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="task.completed">Tarefa Concluída</SelectItem>
                    <SelectItem value="task.started">Tarefa Iniciada</SelectItem>
                    <SelectItem value="task.error">Erro na Tarefa</SelectItem>
                    <SelectItem value="data.updated">Dados Atualizados</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <Button className="bg-scrapvorn-orange hover:bg-scrapvorn-orange/90">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Testar Webhook
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Webhooks;
