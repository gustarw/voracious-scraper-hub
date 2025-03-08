
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Settings, 
  Shield, 
  Globe, 
  Key, 
  Wifi, 
  Server, 
  Bell, 
  Monitor 
} from "lucide-react";
import { useState } from "react";

const Configuracoes = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(true);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Configurações</h1>
        <p className="text-scrapvorn-gray">
          Gerencie as configurações da sua conta e da plataforma.
        </p>
      </div>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-5 mb-8 bg-black/40 p-1 rounded-md border border-scrapvorn-orange/20">
          <TabsTrigger value="general" className="data-[state=active]:bg-scrapvorn-orange/20 data-[state=active]:text-white">
            <Settings className="mr-2 h-4 w-4 text-scrapvorn-orange" />
            Geral
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-scrapvorn-orange/20 data-[state=active]:text-white">
            <Shield className="mr-2 h-4 w-4 text-scrapvorn-orange" />
            Segurança
          </TabsTrigger>
          <TabsTrigger value="api" className="data-[state=active]:bg-scrapvorn-orange/20 data-[state=active]:text-white">
            <Key className="mr-2 h-4 w-4 text-scrapvorn-orange" />
            API
          </TabsTrigger>
          <TabsTrigger value="proxy" className="data-[state=active]:bg-scrapvorn-orange/20 data-[state=active]:text-white">
            <Wifi className="mr-2 h-4 w-4 text-scrapvorn-orange" />
            Proxies
          </TabsTrigger>
          <TabsTrigger value="limits" className="data-[state=active]:bg-scrapvorn-orange/20 data-[state=active]:text-white">
            <Server className="mr-2 h-4 w-4 text-scrapvorn-orange" />
            Limites
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white/5 border-scrapvorn-gray/10">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Monitor className="mr-2 h-5 w-5 text-scrapvorn-orange" />
                  Preferências de Interface
                </CardTitle>
                <CardDescription className="text-scrapvorn-gray">
                  Configure as opções de aparência e comportamento da plataforma.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="dark-mode" className="text-white">Modo Escuro</Label>
                    <p className="text-sm text-scrapvorn-gray">Ativar interface com tema escuro</p>
                  </div>
                  <Switch 
                    id="dark-mode" 
                    checked={darkModeEnabled}
                    onCheckedChange={setDarkModeEnabled}
                    className="data-[state=checked]:bg-scrapvorn-orange"
                  />
                </div>
                
                <Separator className="bg-scrapvorn-gray/10" />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-save" className="text-white">Salvamento Automático</Label>
                    <p className="text-sm text-scrapvorn-gray">Salvar automaticamente alterações</p>
                  </div>
                  <Switch 
                    id="auto-save" 
                    checked={autoSaveEnabled}
                    onCheckedChange={setAutoSaveEnabled}
                    className="data-[state=checked]:bg-scrapvorn-orange"
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/5 border-scrapvorn-gray/10">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="mr-2 h-5 w-5 text-scrapvorn-orange" />
                  Notificações
                </CardTitle>
                <CardDescription className="text-scrapvorn-gray">
                  Configure como e quando você recebe notificações.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enable-notifications" className="text-white">Ativar Notificações</Label>
                    <p className="text-sm text-scrapvorn-gray">Receber alertas sobre tarefas e eventos</p>
                  </div>
                  <Switch 
                    id="enable-notifications" 
                    checked={notificationsEnabled}
                    onCheckedChange={setNotificationsEnabled}
                    className="data-[state=checked]:bg-scrapvorn-orange"
                  />
                </div>
                
                <Separator className="bg-scrapvorn-gray/10" />
                
                <div>
                  <Label htmlFor="email-notifications" className="text-white block mb-2">Email para Notificações</Label>
                  <Input 
                    id="email-notifications" 
                    placeholder="seu-email@exemplo.com"
                    className="bg-black/40 border-scrapvorn-gray/30 text-white" 
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/5 border-scrapvorn-gray/10 md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="mr-2 h-5 w-5 text-scrapvorn-orange" />
                  Configurações Regionais
                </CardTitle>
                <CardDescription className="text-scrapvorn-gray">
                  Defina suas preferências de idioma e formato.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="language" className="text-white block mb-2">Idioma</Label>
                  <select 
                    id="language" 
                    className="w-full bg-black/40 border border-scrapvorn-gray/30 rounded-md p-2 text-white"
                  >
                    <option value="pt-BR">Português (Brasil)</option>
                    <option value="en-US">English (United States)</option>
                    <option value="es">Español</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="timezone" className="text-white block mb-2">Fuso Horário</Label>
                  <select 
                    id="timezone" 
                    className="w-full bg-black/40 border border-scrapvorn-gray/30 rounded-md p-2 text-white"
                  >
                    <option value="America/Sao_Paulo">Brasília (GMT-3)</option>
                    <option value="America/New_York">New York (GMT-5)</option>
                    <option value="Europe/London">London (GMT+0)</option>
                    <option value="Asia/Tokyo">Tokyo (GMT+9)</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="security">
          <Card className="bg-white/5 border-scrapvorn-gray/10">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5 text-scrapvorn-orange" />
                Configurações de Segurança
              </CardTitle>
              <CardDescription className="text-scrapvorn-gray">
                Gerencie as configurações de segurança da sua conta.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-6 border border-dashed border-scrapvorn-gray/30 rounded-lg flex items-center justify-center">
                <p className="text-scrapvorn-gray">Funcionalidade em desenvolvimento</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="api">
          <Card className="bg-white/5 border-scrapvorn-gray/10">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Key className="mr-2 h-5 w-5 text-scrapvorn-orange" />
                Chaves de API
              </CardTitle>
              <CardDescription className="text-scrapvorn-gray">
                Gerencie suas chaves de API para integrações.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-6 border border-dashed border-scrapvorn-gray/30 rounded-lg flex items-center justify-center">
                <p className="text-scrapvorn-gray">Funcionalidade em desenvolvimento</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="proxy">
          <Card className="bg-white/5 border-scrapvorn-gray/10">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wifi className="mr-2 h-5 w-5 text-scrapvorn-orange" />
                Configurações de Proxies
              </CardTitle>
              <CardDescription className="text-scrapvorn-gray">
                Configure seus proxies para uso em web scraping.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-6 border border-dashed border-scrapvorn-gray/30 rounded-lg flex items-center justify-center">
                <p className="text-scrapvorn-gray">Funcionalidade em desenvolvimento</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="limits">
          <Card className="bg-white/5 border-scrapvorn-gray/10">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Server className="mr-2 h-5 w-5 text-scrapvorn-orange" />
                Limites de Uso
              </CardTitle>
              <CardDescription className="text-scrapvorn-gray">
                Configure limites para controle de recursos.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-6 border border-dashed border-scrapvorn-gray/30 rounded-lg flex items-center justify-center">
                <p className="text-scrapvorn-gray">Funcionalidade em desenvolvimento</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end mt-6">
        <Button 
          className="bg-gradient-to-r from-scrapvorn-orange to-scrapvorn-orange/90 hover:from-scrapvorn-orange/90 hover:to-scrapvorn-orange text-black font-medium"
        >
          Salvar Configurações
        </Button>
      </div>
    </DashboardLayout>
  );
};

export default Configuracoes;
