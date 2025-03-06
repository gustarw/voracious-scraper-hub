
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Download, FileJson, FileSpreadsheet, FileText, Upload, Send } from "lucide-react";

const Exportacao = () => {
  return (
    <DashboardLayout>
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Exportação</h1>
        <p className="text-scrapvorn-gray">
          Configure as opções de exportação para os dados extraídos.
        </p>
      </div>
      
      <Tabs defaultValue="formats" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="formats">Formatos de Exportação</TabsTrigger>
          <TabsTrigger value="destinations">Destinos</TabsTrigger>
          <TabsTrigger value="scheduled">Exportações Agendadas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="formats">
          <Card className="bg-white/5 border border-scrapvorn-gray/10">
            <CardHeader>
              <CardTitle>Formatos de Exportação</CardTitle>
              <CardDescription>
                Escolha em qual formato você deseja exportar seus dados.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <RadioGroup defaultValue="excel">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2 border border-scrapvorn-gray/10 rounded-lg p-4 transition-colors hover:bg-white/5">
                      <RadioGroupItem value="excel" id="excel" />
                      <Label htmlFor="excel" className="flex items-center cursor-pointer">
                        <FileSpreadsheet className="mr-2 h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium">Excel (.xlsx)</p>
                          <p className="text-xs text-scrapvorn-gray">Compatível com Excel, Google Sheets, etc.</p>
                        </div>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2 border border-scrapvorn-gray/10 rounded-lg p-4 transition-colors hover:bg-white/5">
                      <RadioGroupItem value="csv" id="csv" />
                      <Label htmlFor="csv" className="flex items-center cursor-pointer">
                        <FileText className="mr-2 h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium">CSV (.csv)</p>
                          <p className="text-xs text-scrapvorn-gray">Formato simples e universalmente compatível</p>
                        </div>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2 border border-scrapvorn-gray/10 rounded-lg p-4 transition-colors hover:bg-white/5">
                      <RadioGroupItem value="json" id="json" />
                      <Label htmlFor="json" className="flex items-center cursor-pointer">
                        <FileJson className="mr-2 h-5 w-5 text-yellow-600" />
                        <div>
                          <p className="font-medium">JSON (.json)</p>
                          <p className="text-xs text-scrapvorn-gray">Ideal para integrações e programadores</p>
                        </div>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
                
                <div className="flex justify-end">
                  <Button className="bg-scrapvorn-orange hover:bg-scrapvorn-orange/90">
                    <Download className="mr-2 h-4 w-4" />
                    Exportar Dados
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="destinations">
          <Card className="bg-white/5 border border-scrapvorn-gray/10">
            <CardHeader>
              <CardTitle>Destinos de Exportação</CardTitle>
              <CardDescription>
                Configure destinos para envio automático dos dados extraídos.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center border-dashed">
                  <Upload className="h-8 w-8 mb-2" />
                  <span className="font-medium">Google Drive</span>
                  <span className="text-xs text-scrapvorn-gray mt-1">Exportar diretamente para sua conta</span>
                </Button>
                
                <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center border-dashed">
                  <Upload className="h-8 w-8 mb-2" />
                  <span className="font-medium">Dropbox</span>
                  <span className="text-xs text-scrapvorn-gray mt-1">Sincronizar com sua conta Dropbox</span>
                </Button>
                
                <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center border-dashed">
                  <Send className="h-8 w-8 mb-2" />
                  <span className="font-medium">E-mail</span>
                  <span className="text-xs text-scrapvorn-gray mt-1">Receba exportações no seu e-mail</span>
                </Button>
                
                <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center border-dashed">
                  <Upload className="h-8 w-8 mb-2" />
                  <span className="font-medium">FTP / SFTP</span>
                  <span className="text-xs text-scrapvorn-gray mt-1">Envie para seu servidor via FTP</span>
                </Button>
              </div>
              
              <div className="mt-6 p-8 border border-dashed border-scrapvorn-gray/30 rounded-lg flex flex-col items-center justify-center">
                <p className="text-scrapvorn-gray mb-4">Integração com destinos em desenvolvimento</p>
                <Button variant="outline">Seja notificado quando disponível</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="scheduled">
          <Card className="bg-white/5 border border-scrapvorn-gray/10">
            <CardHeader>
              <CardTitle>Exportações Agendadas</CardTitle>
              <CardDescription>
                Configure exportações automáticas em intervalos regulares.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-8 border border-dashed border-scrapvorn-gray/30 rounded-lg flex flex-col items-center justify-center">
                <p className="text-scrapvorn-gray mb-4">Agendamento de exportações em desenvolvimento</p>
                <Button variant="outline">Seja notificado quando disponível</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Exportacao;
