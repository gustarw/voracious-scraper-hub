
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Clock, Calendar, Bell, Plus, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Agendamento = () => {
  return (
    <DashboardLayout>
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Agendamento</h1>
        <p className="text-scrapvorn-gray">
          Configure a execução automática das suas tarefas de scraping.
        </p>
      </div>
      
      <Tabs defaultValue="schedules" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="schedules">Tarefas Agendadas</TabsTrigger>
          <TabsTrigger value="create">Criar Agendamento</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>
        
        <TabsContent value="schedules">
          <Card className="bg-white/5 border border-scrapvorn-gray/10">
            <CardHeader>
              <CardTitle>Tarefas Agendadas</CardTitle>
              <CardDescription>
                Visualize e gerencie todas as suas tarefas programadas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Seus Agendamentos</h3>
                  <Button className="bg-scrapvorn-orange hover:bg-scrapvorn-orange/90">
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Agendamento
                  </Button>
                </div>
                
                <div className="bg-black/20 rounded-lg p-6 border border-scrapvorn-gray/10">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div>
                      <h4 className="text-lg font-medium">E-commerce Monitor</h4>
                      <p className="text-scrapvorn-gray text-sm">https://exemplo-ecommerce.com.br</p>
                      <div className="flex items-center mt-2">
                        <div className="flex items-center text-xs text-scrapvorn-gray mr-4">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>Diário às 08:00</span>
                        </div>
                        <div className="flex items-center text-xs text-scrapvorn-gray">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>Próxima: 25/05/2023</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="schedule1" className="text-sm">Ativo</Label>
                        <Switch id="schedule1" defaultChecked />
                      </div>
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-black/20 rounded-lg p-6 border border-scrapvorn-gray/10">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div>
                      <h4 className="text-lg font-medium">Monitoramento de Preços</h4>
                      <p className="text-scrapvorn-gray text-sm">https://loja-concorrente.com.br</p>
                      <div className="flex items-center mt-2">
                        <div className="flex items-center text-xs text-scrapvorn-gray mr-4">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>Semanal (Segunda-feira)</span>
                        </div>
                        <div className="flex items-center text-xs text-scrapvorn-gray">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>Próxima: 29/05/2023</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="schedule2" className="text-sm">Ativo</Label>
                        <Switch id="schedule2" defaultChecked />
                      </div>
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="create">
          <Card className="bg-white/5 border border-scrapvorn-gray/10">
            <CardHeader>
              <CardTitle>Criar Novo Agendamento</CardTitle>
              <CardDescription>
                Configure um novo agendamento para execução automática de tarefas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="schedule-name">Nome do Agendamento</Label>
                    <Input id="schedule-name" placeholder="Ex: Monitoramento de Preços" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="target-url">URL Alvo</Label>
                    <Input id="target-url" placeholder="https://exemplo.com.br" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="frequency">Frequência</Label>
                    <Select>
                      <SelectTrigger id="frequency">
                        <SelectValue placeholder="Selecione uma frequência" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Diário</SelectItem>
                        <SelectItem value="weekly">Semanal</SelectItem>
                        <SelectItem value="monthly">Mensal</SelectItem>
                        <SelectItem value="custom">Personalizado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="time">Horário</Label>
                    <Input id="time" type="time" defaultValue="08:00" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="export-format">Formato de Exportação</Label>
                    <Select>
                      <SelectTrigger id="export-format">
                        <SelectValue placeholder="Selecione um formato" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                        <SelectItem value="csv">CSV (.csv)</SelectItem>
                        <SelectItem value="json">JSON (.json)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notifications">Notificações</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Switch id="notifications" />
                      <Label htmlFor="notifications" className="text-sm">
                        <div className="flex items-center">
                          <Bell className="h-4 w-4 mr-1" />
                          <span>Receber notificações por email</span>
                        </div>
                      </Label>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button className="bg-scrapvorn-orange hover:bg-scrapvorn-orange/90">
                    <Clock className="mr-2 h-4 w-4" />
                    Criar Agendamento
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports">
          <Card className="bg-white/5 border border-scrapvorn-gray/10">
            <CardHeader>
              <CardTitle>Relatórios de Execução</CardTitle>
              <CardDescription>
                Visualize o histórico de execuções das suas tarefas agendadas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-8 border border-dashed border-scrapvorn-gray/30 rounded-lg flex flex-col items-center justify-center">
                <p className="text-scrapvorn-gray mb-4">Relatórios detalhados em desenvolvimento</p>
                <Button variant="outline">Seja notificado quando disponível</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Agendamento;
